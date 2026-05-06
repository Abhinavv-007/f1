/**
 * GET /api/admin/health
 *
 * Extended health check. Public /api/health is intentionally terse and
 * cacheable; this admin variant includes per-instance metrics, env
 * configuration, and explicit indication that the D1 wiring is still
 * pending.
 */
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getMetrics } from "@/lib/admin-metrics";

export const runtime = "edge";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const m = getMetrics();

  return NextResponse.json(
    {
      ok: true,
      service: "trgt",
      ts: Math.floor(Date.now() / 1000),
      version: "phase-2-admin-api",
      booted_at: Math.floor(m.bootedAt / 1000),
      uptime_ms: Date.now() - m.bootedAt,
      runtime: "edge",
      db: "phase-2-pending",
      config: {
        firebase_configured: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        gemini_configured: !!process.env.GEMINI_API_KEY,
        admin_secret_set: !!(process.env.TRGT_ADMIN_SECRET || process.env.ADMIN_SECRET),
      },
      metrics: {
        total_requests: m.totalRequests,
        per_route_count: m.perRoute.size,
      },
    },
    { headers: { "cache-control": "private, no-store" } },
  );
}
