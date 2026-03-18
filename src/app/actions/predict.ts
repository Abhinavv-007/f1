"use server";

import { prisma } from "@/lib/prisma";
import { fetchSessionSnapshot } from "@/lib/race";
import { revalidatePath } from "next/cache";

function readFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitPrediction(formData: FormData) {
  const userId = readFormValue(formData, "userId");
  const userEmail = readFormValue(formData, "userEmail");
  const userName = readFormValue(formData, "userName");
  const userImage = readFormValue(formData, "userImage");
  const p1 = readFormValue(formData, "p1");
  const p2 = readFormValue(formData, "p2");
  const p3 = readFormValue(formData, "p3");
  const fastestLap = readFormValue(formData, "fastestLap");
  const firstRetirement = readFormValue(formData, "firstRetirement");
  const safetyCar = formData.get("safetyCar") === "true";
  const winningMargin = readFormValue(formData, "winningMargin");

  if (!userId || !userEmail || !p1 || !p2 || !p3) {
    return { error: "Missing required prediction fields" };
  }

  if (new Set([p1, p2, p3]).size !== 3) {
    return { error: "Podium picks must be three different drivers." };
  }

  try {
    const session = await fetchSessionSnapshot(new Date());

    if (!session.round || !session.season) {
      return { error: "No active race weekend is available for predictions." };
    }

    if (session.isLocked) {
      return { error: `Predictions are locked for Round ${session.round}.` };
    }

    await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: userEmail,
        name: userName || null,
        image: userImage || null,
      },
      create: {
        id: userId,
        email: userEmail,
        name: userName || null,
        image: userImage || null,
      },
    });

    const prediction = await prisma.prediction.upsert({
      where: {
        userId_season_raceRound: {
          userId,
          season: session.season,
          raceRound: session.round,
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
        locked: false,
      },
      create: {
        userId,
        season: session.season,
        raceRound: session.round,
        winner: p1,
        p2,
        p3,
        fastestLap,
        firstRetirement,
        safetyCar,
        winningMargin,
        locked: false,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/predict");
    revalidatePath("/leaderboard");
    return { success: true, prediction };
  } catch (error) {
    console.error("Prediction error:", error);
    return { error: "Database error saving prediction" };
  }
}
