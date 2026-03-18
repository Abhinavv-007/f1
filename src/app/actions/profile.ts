"use server";

import type { Prediction } from "@prisma/client";
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

export type ProfileActionResult =
  | {
      success: true;
      stats: ProfileStats;
      predictions: ProfilePrediction[];
    }
  | {
      success: false;
      error: string;
    };

export async function getUserProfile(userId: string) {
  try {
    const [user, predictions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { globalRank: true },
      }),
      prisma.prediction.findMany({
        where: { userId },
        orderBy: [{ season: "desc" }, { raceRound: "desc" }],
      }),
    ]);

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
      success: true,
      stats: {
        totalPoints,
        accuracy,
        globalRank: user?.globalRank ?? null,
        predictionsCount: predictions.length,
      },
      predictions,
    } satisfies ProfileActionResult;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { success: false, error: "Failed to load profile data." } satisfies ProfileActionResult;
  }
}
