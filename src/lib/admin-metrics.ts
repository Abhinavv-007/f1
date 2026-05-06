/**
 * In-memory request metrics for the trgt admin panel.
 *
 * Edge Functions are stateless and cold-start often, so these counters
 * reset frequently. That's fine — LaunchOps keeps its own 24h aggregate
 * via probe history. The per-instance numbers are useful for "is this
 * worker even serving traffic right now?" sanity checks.
 */

export interface RouteMetric {
  total: number;
  success: number;
  errors: number;
  lastSeen: number;
  latencySum: number;
}

export interface AdminMetrics {
  bootedAt: number;
  totalRequests: number;
  perRoute: Map<string, RouteMetric>;
  statusCodes: Map<number, number>;
}

declare global {
  var __trgtAdminMetrics: AdminMetrics | undefined;
}

function init(): AdminMetrics {
  return {
    bootedAt: Date.now(),
    totalRequests: 0,
    perRoute: new Map(),
    statusCodes: new Map(),
  };
}

export function getMetrics(): AdminMetrics {
  if (!globalThis.__trgtAdminMetrics) {
    globalThis.__trgtAdminMetrics = init();
  }
  return globalThis.__trgtAdminMetrics;
}

export function bumpMetric(route: string, status: number, latencyMs: number): void {
  const m = getMetrics();
  m.totalRequests += 1;
  const r =
    m.perRoute.get(route) ?? { total: 0, success: 0, errors: 0, lastSeen: 0, latencySum: 0 };
  r.total += 1;
  if (status >= 400) r.errors += 1;
  else r.success += 1;
  r.lastSeen = Math.floor(Date.now() / 1000);
  r.latencySum += latencyMs;
  m.perRoute.set(route, r);
  m.statusCodes.set(status, (m.statusCodes.get(status) ?? 0) + 1);
}

export interface SerializedRouteMetric {
  route: string;
  total: number;
  success: number;
  errors: number;
  error_rate_pct: number | null;
  last_seen: number;
  avg_latency_ms: number | null;
}

export function serializeRoutes(): SerializedRouteMetric[] {
  const m = getMetrics();
  return Array.from(m.perRoute.entries())
    .map(([route, r]) => ({
      route,
      total: r.total,
      success: r.success,
      errors: r.errors,
      error_rate_pct: r.total > 0 ? Number(((r.errors / r.total) * 100).toFixed(2)) : null,
      last_seen: r.lastSeen,
      avg_latency_ms: r.total > 0 ? Math.round(r.latencySum / r.total) : null,
    }))
    .sort((a, b) => b.total - a.total);
}

export function serializeStatusCodes(): Record<string, number> {
  const m = getMetrics();
  const out: Record<string, number> = {};
  for (const [code, count] of m.statusCodes.entries()) {
    out[String(code)] = count;
  }
  return out;
}
