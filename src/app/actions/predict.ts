"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitPrediction(formData: FormData) {
  // In a real app we'd get the user ID from the session securely on the server
  // For now we get it from the payload
  const userId = formData.get("userId") as string;
  const p1 = formData.get("p1") as string;
  const p2 = formData.get("p2") as string;
  const p3 = formData.get("p3") as string;
  const fastestLap = formData.get("fastestLap") as string;
  const firstRetirement = formData.get("firstRetirement") as string;
  const safetyCar = formData.get("safetyCar") === "true";
  const winningMargin = formData.get("winningMargin") as string;
  const season = 2025;
  const raceRound = 1;

  if (!userId || !p1 || !p2 || !p3) {
    return { error: "Missing required prediction fields" };
  }

  try {
    // Upsert so users can update their prediction before lockout instead of throwing unique constraint error
    const prediction = await prisma.prediction.upsert({
      where: {
        userId_season_raceRound: {
          userId,
          season,
          raceRound,
        },
      },
      update: {
        winner: p1,
        p2,
        p3,
        fastestLap,
        firstRetirement,
        safetyCar,
        winningMargin,
        locked: true,
      },
      create: {
        userId,
        season,
        raceRound,
        winner: p1,
        p2,
        p3,
        fastestLap,
        firstRetirement,
        safetyCar,
        winningMargin,
        locked: true,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/predict");
    return { success: true, prediction };
  } catch (err: any) {
    console.error("Prediction error:", err);
    return { error: "Database error saving prediction" };
  }
}
