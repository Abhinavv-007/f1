/**
 * GET /api/health
 *
 * Public liveness probe consumed by lnch.in's LaunchOps health probe and
 * any external uptime monitor. Cheap, cacheable, never returns secrets.
 */
import { NextResponse } from "next/server";
import { bumpMetric } from "@/lib/admin-metrics";

export const runtime = "edge";

export async function GET() {
  const t0 = Date.now();
  const res = NextResponse.json(
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
  bumpMetric("/api/health", 200, Date.now() - t0);
  return res;
}

export async function HEAD() {
  const t0 = Date.now();
  const res = new Response(null, {
    status: 200,
    headers: { "cache-control": "public, max-age=10" },
  });
  bumpMetric("/api/health", 200, Date.now() - t0);
  return res;
}
