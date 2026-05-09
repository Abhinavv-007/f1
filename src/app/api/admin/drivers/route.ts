/**
 * GET /api/admin/drivers — paginated user roster for the /admin Drivers tab.
 *
 * Pulls from Prisma when D1 is wired; gracefully returns an empty list
 * with `db_available: false` when it isn't, so the UI can render an
 * informative empty state instead of a 500.
 */
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "edge";

interface DriverRow {
  id: string;
  email: string;
  username: string | null;
  country: string | null;
  totalPoints: number;
  predictionAccuracy: number;
  isPro: boolean;
  createdAt: string;
}

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").toLowerCase();
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 25));

  let drivers: DriverRow[] = [];
  let total = 0;
  let dbAvailable = false;
  let dbError: string | null = null;

  try {
    const mod = (await import("@/lib/prisma")) as { prisma?: any };
    const prisma = mod.prisma;
    if (prisma) {
      const where = q
        ? {
            OR: [
              { email: { contains: q } },
              { username: { contains: q } },
              { name: { contains: q } },
            ],
          }
        : undefined;
      const rows = await prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      const count = await prisma.user.count({ where });
      drivers = rows.map((u: any) => ({
        id: u.id,
        email: u.email,
        username: u.username ?? null,
        country: u.country ?? null,
        totalPoints: u.totalPoints,
        predictionAccuracy: u.predictionAccuracy,
        isPro: u.isPro,
        createdAt: (u.createdAt instanceof Date ? u.createdAt : new Date(u.createdAt)).toISOString(),
      }));
      total = count;
      dbAvailable = true;
    }
  } catch (err) {
    dbError = (err as Error).message;
  }

  return NextResponse.json(
    { ok: true, db_available: dbAvailable, db_error: dbError, total, drivers },
    { headers: { "cache-control": "private, no-store" } },
  );
}
