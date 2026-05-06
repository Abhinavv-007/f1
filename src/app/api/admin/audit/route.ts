/**
 * GET /api/admin/audit
 *
 * Process-level event feed. trgt is currently stateless on the read side
 * (Prisma + D1 wiring lands in a separate PR), so the audit feed surfaces
 * boot events and recent error counts. LaunchOps composes its own audit
 * surface from its probe history.
 */
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getMetrics } from "@/lib/admin-metrics";

export const runtime = "edge";

interface AuditEvent {
  type: string;
  ts: number;
  details: Record<string, unknown>;
}

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const m = getMetrics();
  const events: AuditEvent[] = [
    {
      type: "process.boot",
      ts: Math.floor(m.bootedAt / 1000),
      details: {
        runtime: "edge",
        node_env: process.env.NODE_ENV ?? null,
      },
    },
  ];
  for (const [code, count] of m.statusCodes.entries()) {
    if (code >= 500) {
      events.push({
        type: "response.5xx",
        ts: Math.floor(Date.now() / 1000),
        details: { status: code, count },
      });
    }
  }

  return NextResponse.json(
    {
      service: "trgt",
      generatedAt: Math.floor(Date.now() / 1000),
      events: events.sort((a, b) => b.ts - a.ts),
    },
    { headers: { "cache-control": "private, no-store" } },
  );
}
