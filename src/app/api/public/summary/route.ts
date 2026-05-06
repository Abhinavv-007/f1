/**
 * GET /api/public/summary
 *
 * Tiny aggregate stats for lnch.in's public landing. The full DB-backed
 * summary (user count, prediction count, accuracy histogram) lands in
 * Phase 2 once the D1 binding is plumbed through to the Edge runtime —
 * Prisma's node client doesn't run on Pages Edge today so for now we
 * return a stable-shape placeholder.
 */
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json(
    {
      service: "trgt",
      generatedAt: Math.floor(Date.now() / 1000),
      surface: {
        framework: "next",
        runtime: "edge",
        // Phase 2 will replace these with real counts read directly via
        // @prisma/adapter-d1 against the existing D1 binding.
        backend: "phase-2-pending",
      },
      counts: {},
      last24h: {},
      note: "phase-1 minimum — see lnch.in/projects/trgt",
    },
    {
      headers: {
        "cache-control": "public, max-age=60, s-maxage=120, stale-while-revalidate=300",
      },
    },
  );
}
