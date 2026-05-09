"use client";

import { useEffect, useState } from "react";
import { BarChart3, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { adminFetch, type AdminSummary, relTime, formatNum } from "./lib";

export function Telemetry() {
  const [data, setData] = useState<AdminSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const d = await adminFetch<AdminSummary>("/api/admin/summary");
        if (!cancelled) { setData(d); setError(null); }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    }
    load();
    const t = setInterval(() => { setTick((x) => x + 1); load(); }, 5000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  if (!data && !error) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-trgt-crimson" />
      </div>
    );
  }
  if (error && !data) {
    return (
      <Card glass carbon className="p-6">
        <div className="text-sm font-mono text-trgt-crimson break-all">{error}</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <StatusCodes data={data!} tick={tick} />
      <RouteTable data={data!} />
    </div>
  );
}

function StatusCodes({ data, tick }: { data: AdminSummary; tick: number }) {
  const codes = Object.entries(data.metrics.status_codes);
  const max = Math.max(1, ...codes.map(([, n]) => n));
  return (
    <Card glass carbon className="p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display font-black text-xl uppercase tracking-tighter text-white">
          Status <span className="text-trgt-crimson">codes</span>
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">tick #{tick}</span>
      </div>
      {codes.length === 0 && (
        <div className="text-sm text-text-muted font-mono py-6 text-center">No traffic yet.</div>
      )}
      {codes.length > 0 && (
        <ul className="space-y-2">
          {codes.sort(([a], [b]) => Number(a) - Number(b)).map(([code, n]) => {
            const tone = code.startsWith("2") ? "bg-f1-green" : code.startsWith("4") ? "bg-f1-yellow" : code.startsWith("5") ? "bg-trgt-crimson" : "bg-f1-purple";
            const text = code.startsWith("2") ? "text-f1-green" : code.startsWith("4") ? "text-f1-yellow" : code.startsWith("5") ? "text-trgt-crimson" : "text-f1-purple";
            return (
              <li key={code} className="flex items-center gap-3">
                <span className={`font-mono text-xs w-12 ${text}`}>{code}</span>
                <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
                  <div className={`h-full ${tone}`} style={{ width: `${(n / max) * 100}%` }} />
                </div>
                <span className="font-mono text-xs text-white tabular-nums w-14 text-right">{formatNum(n)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function RouteTable({ data }: { data: AdminSummary }) {
  const max = Math.max(1, ...data.metrics.per_route.map((r) => r.total));
  return (
    <Card glass carbon className="p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display font-black text-xl uppercase tracking-tighter text-white">
          Per-route <span className="text-trgt-crimson">telemetry</span>
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted inline-flex items-center gap-2">
          <BarChart3 className="h-3 w-3" />
          {data.metrics.per_route.length} routes
        </span>
      </div>
      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
              <th className="text-left pb-2 pr-3">Route</th>
              <th className="text-right pb-2 px-3">Total</th>
              <th className="text-right pb-2 px-3">Errors</th>
              <th className="text-right pb-2 px-3">Avg ms</th>
              <th className="text-right pb-2 pl-3">Last seen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {data.metrics.per_route.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-muted font-mono">
                  Idle — fire a request to populate.
                </td>
              </tr>
            )}
            {data.metrics.per_route.map((r) => (
              <tr key={r.route}>
                <td className="py-2.5 pr-3">
                  <div className="font-mono text-white text-xs truncate max-w-[220px]">{r.route}</div>
                  <div className="mt-1 h-1 w-full rounded-full bg-white/6 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-trgt-crimson via-f1-yellow to-f1-green" style={{ width: `${(r.total / max) * 100}%` }} />
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-white tabular-nums">{formatNum(r.total)}</td>
                <td className={`py-2.5 px-3 text-right font-mono tabular-nums ${r.errors ? "text-trgt-crimson" : "text-text-secondary"}`}>{r.errors}</td>
                <td className="py-2.5 px-3 text-right font-mono text-white tabular-nums">{r.avg_latency_ms ?? "—"}</td>
                <td className="py-2.5 pl-3 text-right font-mono text-text-secondary text-xs">{relTime(r.last_seen)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
