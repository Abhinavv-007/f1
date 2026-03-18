"use server";

import type { Prediction } from "@prisma/client";
import { buildBadgeStates, type BadgeState } from "@/lib/badges";
import {
  getUserBadgeMetrics,
  syncAuthenticatedUserRecord,
  syncUserBadges,
  type AuthenticatedUserInput,
} from "@/lib/badge-service";
import { prisma } from "@/lib/prisma";

export type ProfilePrediction = Pick<
  Prediction,
  | "id"
  | "season"
  | "raceRound"
  | "winner"
  | "p2"
  | "p3"
  | "fastestLap"
  | "firstRetirement"
  | "safetyCar"
  | "winningMargin"
  | "pointsEarned"
  | "accuracyScore"
  | "submittedAt"
>;

export interface ProfileStats {
  totalPoints: number;
  accuracy: number;
  globalRank: number | null;
  predictionsCount: number;
}

export interface ProfileUser {
  createdAt: string;
}

export type ProfileActionResult =
  | {
      success: true;
      user: ProfileUser;
      stats: ProfileStats;
      badges: BadgeState[];
      predictions: ProfilePrediction[];
    }
  | {
      success: false;
      error: string;
    };

export async function getUserProfile(input: AuthenticatedUserInput) {
  try {
    const syncedUser = await syncAuthenticatedUserRecord(input);
    const [user, predictions, storedBadges, badgeMetrics] = await Promise.all([
      prisma.user.findUnique({
        where: { id: syncedUser.id },
        select: { globalRank: true, createdAt: true },
      }),
      prisma.prediction.findMany({
        where: { userId: syncedUser.id },
        orderBy: [{ season: "desc" }, { raceRound: "desc" }],
      }),
      syncUserBadges(syncedUser.id),
      getUserBadgeMetrics(syncedUser.id),
    ]);

    const totalPoints = badgeMetrics.totalPoints;
    const accuracy = badgeMetrics.accuracy;

    return {
      success: true,
      user: {
        createdAt: user?.createdAt.toISOString() ?? syncedUser.createdAt.toISOString(),
      },
      stats: {
        totalPoints,
        accuracy,
        globalRank: user?.globalRank ?? null,
        predictionsCount: predictions.length,
      },
      badges: buildBadgeStates(
        {
          accountCreatedAt: user?.createdAt ?? syncedUser.createdAt,
          predictionsCount: badgeMetrics.predictionsCount,
          totalPoints: badgeMetrics.totalPoints,
          accuracy: badgeMetrics.accuracy,
        },
        storedBadges
      ),
      predictions,
    } satisfies ProfileActionResult;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { success: false, error: "Failed to load profile data." } satisfies ProfileActionResult;
  }
}
