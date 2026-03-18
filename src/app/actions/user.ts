"use server";

import {
  type AuthenticatedUserInput,
  syncAuthenticatedUserRecord,
  syncUserBadges,
} from "@/lib/badge-service";

export async function syncAuthenticatedUser(input: AuthenticatedUserInput) {
  try {
    const user = await syncAuthenticatedUserRecord(input);
    await syncUserBadges(user.id);

    return { success: true };
  } catch (error) {
    console.error("User sync error:", error);
    return { success: false, error: "Failed to sync account data." };
  }
}
