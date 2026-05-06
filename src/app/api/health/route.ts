/**
 * GET /api/health
 *
 * Public liveness probe consumed by lnch.in's LaunchOps health probe and
 * any external uptime monitor. Cheap, cacheable, never returns secrets.
 */
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "trgt",
      ts: Math.floor(Date.now() / 1000),
      version: "phase-1-public-face",
    },
    {
      headers: {
        "cache-control": "public, max-age=10, s-maxage=30",
      },
    },
  );
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: { "cache-control": "public, max-age=10" },
  });
}
