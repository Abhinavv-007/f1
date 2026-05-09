/**
 * GET /api/admin/races — race schedule snapshot for the /admin Race Control tab.
 */
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "edge";

interface RaceRow {
  id: string;
  season: number;
  round: number;
  name: string;
  circuitId: string;
  country: string;
  raceDate: string;
  status: string;
  winnerCode: string | null;
  fastestLapCode: string | null;
}

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const season = Number(url.searchParams.get("season")) || undefined;

  let races: RaceRow[] = [];
  let total = 0;
  let dbAvailable = false;
  let dbError: string | null = null;

  try {
    const mod = (await import("@/lib/prisma")) as { prisma?: any };
    const prisma = mod.prisma;
    if (prisma) {
      const where = season ? { season } : undefined;
      const rows = await prisma.race.findMany({
        where,
        orderBy: [{ season: "desc" }, { round: "asc" }],
        take: 50,
      });
      const count = await prisma.race.count({ where });
      races = rows.map((r: any) => ({
        id: r.id,
        season: r.season,
        round: r.round,
        name: r.name,
        circuitId: r.circuitId,
        country: r.country,
        raceDate: (r.raceDate instanceof Date ? r.raceDate : new Date(r.raceDate)).toISOString(),
        status: r.status,
        winnerCode: r.winnerCode ?? null,
        fastestLapCode: r.fastestLapCode ?? null,
      }));
      total = count;
      dbAvailable = true;
    }
  } catch (err) {
    dbError = (err as Error).message;
  }

  return NextResponse.json(
    { ok: true, db_available: dbAvailable, db_error: dbError, total, races },
    { headers: { "cache-control": "private, no-store" } },
  );
}
