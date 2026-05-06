/**
 * GET /api/admin/summary
 *
 * Single-shot read powering LaunchOps' "TRGT" panel. Returns boot/uptime
 * info, per-instance config flags, and the in-memory request metrics.
 *
 * D1-backed counts (users, predictions, badges) will be wired in once we
 * route Prisma through @prisma/adapter-d1 on the Edge runtime. For now
 * the response carries the stable shape with `db: "phase-2-pending"`
 * so the lnch.in adapter can render the panel without crashing.
 */
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getMetrics, serializeRoutes, serializeStatusCodes } from "@/lib/admin-metrics";

export const runtime = "edge";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const m = getMetrics();
  const now = Date.now();

  return NextResponse.json(
    {
      service: "trgt",
      generatedAt: Math.floor(now / 1000),
      process: {
        booted_at: Math.floor(m.bootedAt / 1000),
        uptime_ms: now - m.bootedAt,
        uptime_seconds: Math.floor((now - m.bootedAt) / 1000),
        runtime: "edge",
      },
      config: {
        firebase_configured: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        gemini_configured: !!process.env.GEMINI_API_KEY,
        admin_secret_set: !!(process.env.TRGT_ADMIN_SECRET || process.env.ADMIN_SECRET),
        node_env: process.env.NODE_ENV ?? null,
      },
      db: "phase-2-pending",
      metrics: {
        total_requests: m.totalRequests,
        per_route: serializeRoutes(),
        status_codes: serializeStatusCodes(),
      },
    },
    { headers: { "cache-control": "private, no-store" } },
  );
}
