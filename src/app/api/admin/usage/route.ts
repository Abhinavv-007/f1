/**
 * GET /api/admin/usage
 *
 * Lighter sibling of /api/admin/summary — returns only the in-memory
 * counters block. Used by the LaunchOps panel to refresh metrics
 * without re-rendering the whole config view.
 */
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getMetrics, serializeRoutes, serializeStatusCodes } from "@/lib/admin-metrics";

export const runtime = "edge";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const m = getMetrics();

  return NextResponse.json(
    {
      service: "trgt",
      generatedAt: Math.floor(Date.now() / 1000),
      booted_at: Math.floor(m.bootedAt / 1000),
      total_requests: m.totalRequests,
      per_route: serializeRoutes(),
      status_codes: serializeStatusCodes(),
    },
    { headers: { "cache-control": "private, no-store" } },
  );
}
