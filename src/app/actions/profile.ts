"use server";

import { prisma } from "@/lib/prisma";

export async function getUserProfile(userId: string) {
  try {
    // 1. Fetch user data if we had it, but mostly we rely on Firebase auth user data for name/email
    // In D1 we store predictions
    
    // 2. Fetch all predictions for this user
    const predictions = await prisma.prediction.findMany({
      where: { userId },
      orderBy: { raceRound: 'desc' }
    });

    // 3. Compute stats
    let totalPoints = 0;
    let accuratePredictions = 0;
    
    predictions.forEach(p => {
      totalPoints += p.pointsEarned || 0;
      if (p.accuracyScore && p.accuracyScore > 80) accuratePredictions++; // Just a mock logic
    });

    const accuracy = predictions.length > 0 ? Math.round((accuratePredictions / predictions.length) * 100) : 0;

    return {
      success: true,
      stats: {
        totalPoints,
        accuracy,
        globalRank: "TBD", // Requires leaderboard logic
        predictionsCount: predictions.length
      },
      predictions
    };
  } catch (err: any) {
    console.error("Error fetching profile:", err);
    return { error: "Failed to load profile data." };
  }
}
