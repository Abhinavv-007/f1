import { NextResponse } from "next/server";
import { fetchSessionSnapshot } from "@/lib/race";

export const runtime = "edge";

let cachedSession:
  | {
      timestamp: number;
      data: Awaited<ReturnType<typeof fetchSessionSnapshot>>;
    }
  | null = null;

const CACHE_TTL = 5 * 60 * 1000;

export async function GET() {
  const now = Date.now();

  if (cachedSession && now - cachedSession.timestamp < CACHE_TTL) {
    return NextResponse.json(cachedSession.data);
  }

  try {
    const data = await fetchSessionSnapshot(new Date());
    cachedSession = {
      timestamp: now,
      data,
    };

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch session";
    return NextResponse.json({ error: message, isActive: false, isLocked: true }, { status: 502 });
  }
}
