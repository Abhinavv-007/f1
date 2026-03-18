import type { Badge, Prediction, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { BADGES, type BadgeId } from "@/lib/badges";

export interface AuthenticatedUserInput {
  id: string;
  email: string | null;
  name?: string | null;
  image?: string | null;
}

interface BadgeMetrics {
  predictionsCount: number;
  totalPoints: number;
  accuracy: number;
}

function normalizeEmail(user: AuthenticatedUserInput): string {
  const email = user.email?.trim();
  return email && email.length > 0 ? email : `${user.id}@trgt.local`;
}

function calculateMetrics(predictions: Pick<Prediction, "pointsEarned" | "accuracyScore">[]): BadgeMetrics {
  const totalPoints = predictions.reduce((sum, prediction) => sum + (prediction.pointsEarned ?? 0), 0);
  const scoredPredictions = predictions.filter(
    (prediction) => typeof prediction.accuracyScore === "number"
  );
  const accuracy =
    scoredPredictions.length > 0
      ? Math.round(
          scoredPredictions.reduce(
            (sum, prediction) => sum + (prediction.accuracyScore ?? 0),
            0
          ) / scoredPredictions.length
        )
      : 0;

  return {
    predictionsCount: predictions.length,
    totalPoints,
    accuracy,
  };
}

function isBadgeEligible(badgeId: BadgeId, metrics: BadgeMetrics): boolean {
  switch (badgeId) {
    case "paddock_pass":
      return true;
    case "lights_out":
      return metrics.predictionsCount >= 1;
    case "formation_lap":
      return metrics.predictionsCount >= 3;
    case "grid_regular":
      return metrics.predictionsCount >= 10;
    case "points_hunter":
      return metrics.totalPoints >= 25;
    case "apex_reader":
      return metrics.accuracy >= 60;
    case "pit_wall_mind":
      return metrics.accuracy >= 75;
  }
}

function resolveAccuracyUnlockDate(
  predictions: Pick<Prediction, "submittedAt" | "accuracyScore">[],
  target: number
): Date {
  let sum = 0;
  let count = 0;

  for (const prediction of predictions) {
    if (typeof prediction.accuracyScore !== "number") {
      continue;
    }

    sum += prediction.accuracyScore;
    count += 1;

    if (Math.round(sum / count) >= target) {
      return prediction.submittedAt;
    }
  }

  return predictions.at(-1)?.submittedAt ?? new Date();
}

function resolvePointsUnlockDate(
  predictions: Pick<Prediction, "submittedAt" | "pointsEarned">[],
  target: number
): Date {
  let total = 0;

  for (const prediction of predictions) {
    total += prediction.pointsEarned ?? 0;
    if (total >= target) {
      return prediction.submittedAt;
    }
  }

  return predictions.at(-1)?.submittedAt ?? new Date();
}

function resolveBadgeEarnedAt(
  badgeId: BadgeId,
  user: Pick<User, "createdAt">,
  predictions: Pick<Prediction, "submittedAt" | "pointsEarned" | "accuracyScore">[]
): Date {
  switch (badgeId) {
    case "paddock_pass":
      return user.createdAt;
    case "lights_out":
      return predictions[0]?.submittedAt ?? user.createdAt;
    case "formation_lap":
      return predictions[2]?.submittedAt ?? predictions.at(-1)?.submittedAt ?? user.createdAt;
    case "grid_regular":
      return predictions[9]?.submittedAt ?? predictions.at(-1)?.submittedAt ?? user.createdAt;
    case "points_hunter":
      return resolvePointsUnlockDate(predictions, 25);
    case "apex_reader":
      return resolveAccuracyUnlockDate(predictions, 60);
    case "pit_wall_mind":
      return resolveAccuracyUnlockDate(predictions, 75);
  }
}

export async function syncAuthenticatedUserRecord(input: AuthenticatedUserInput) {
  const user = await prisma.user.upsert({
    where: { id: input.id },
    update: {
      email: normalizeEmail(input),
      name: input.name || null,
      image: input.image || null,
    },
    create: {
      id: input.id,
      email: normalizeEmail(input),
      name: input.name || null,
      image: input.image || null,
    },
  });

  await prisma.badge.upsert({
    where: {
      userId_badgeType: {
        userId: user.id,
        badgeType: "paddock_pass",
      },
    },
    update: {},
    create: {
      userId: user.id,
      badgeType: "paddock_pass",
      earnedAt: user.createdAt,
    },
  });

  return user;
}

export async function syncUserBadges(userId: string) {
  const [user, predictions, existingBadges] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, createdAt: true },
    }),
    prisma.prediction.findMany({
      where: { userId },
      orderBy: { submittedAt: "asc" },
      select: {
        submittedAt: true,
        pointsEarned: true,
        accuracyScore: true,
      },
    }),
    prisma.badge.findMany({
      where: { userId },
      select: {
        badgeType: true,
      },
    }),
  ]);

  if (!user) {
    return [];
  }

  const metrics = calculateMetrics(predictions);
  const existingTypes = new Set(existingBadges.map((badge) => badge.badgeType));

  for (const badge of BADGES) {
    if (existingTypes.has(badge.id) || !isBadgeEligible(badge.id, metrics)) {
      continue;
    }

    await prisma.badge.upsert({
      where: {
        userId_badgeType: {
          userId,
          badgeType: badge.id,
        },
      },
      update: {},
      create: {
        userId,
        badgeType: badge.id,
        earnedAt: resolveBadgeEarnedAt(badge.id, user, predictions),
      },
    });
  }

  return prisma.badge.findMany({
    where: { userId },
    orderBy: { earnedAt: "asc" },
  });
}

export async function getUserBadgeMetrics(userId: string) {
  const predictions = await prisma.prediction.findMany({
    where: { userId },
    select: {
      pointsEarned: true,
      accuracyScore: true,
    },
  });

  return calculateMetrics(predictions);
}

export async function getStoredBadges(userId: string): Promise<Badge[]> {
  return prisma.badge.findMany({
    where: { userId },
    orderBy: { earnedAt: "asc" },
  });
}
