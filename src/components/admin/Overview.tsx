"use client";

import { useEffect, useState } from "react";
import { Activity, Cpu, Database, Flame, Radio, Server, Sparkles, Wrench } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { adminFetch, type AdminSummary, relTime, shortUptime, formatNum } from "./lib";

export function Overview() {
  const [data, setData] = useState<AdminSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    const t = setInterval(load, 8000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  return (
    <div className="space-y-6">
      <KpiGrid data={data} />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <TelemetryFeed data={data} error={error} />
        <SystemHealth data={data} />
      </div>
    </div>
  );
}

function KpiGrid({ data }: { data: AdminSummary | null }) {
  const total = data?.metrics.total_requests;
  const routes = data?.metrics.per_route?.length;
  const uptime = data ? shortUptime(data.process.uptime_ms) : null;
  const errPct = data && data.metrics.per_route.length
    ? (data.metrics.per_route.reduce((s, r) => s + r.errors, 0) /
       Math.max(1, data.metrics.per_route.reduce((s, r) => s + r.total, 0)) * 100).toFixed(1)
    : null;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Kpi label="Total requests" value={total != null ? formatNum(total) : "—"} icon={Activity} accent="crimson" />
      <Kpi label="Live routes"    value={routes != null ? String(routes) : "—"} icon={Radio} accent="purple" />
      <Kpi label="Edge uptime"    value={uptime ?? "—"} icon={Server} accent="green" />
      <Kpi label="Error rate"     value={errPct != null ? `${errPct}%` : "—"} icon={Flame} accent="yellow" />
    </div>
  );
}

const ACCENT_TEXT = {
  crimson: "text-trgt-crimson",
  purple: "text-f1-purple",
  green: "text-f1-green",
  yellow: "text-f1-yellow",
} as const;
type Accent = keyof typeof ACCENT_TEXT;

function Kpi({ label, value, icon: Icon, accent }: { label: string; value: string; icon: React.ElementType; accent: Accent }) {
  return (
    <Card glass carbon className="p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">{label}</span>
        <Icon className={`h-4 w-4 ${ACCENT_TEXT[accent]}`} />
      </div>
      <div className="mt-3 font-display font-black text-3xl tracking-tighter text-white">{value}</div>
    </Card>
  );
}

function TelemetryFeed({ data, error }: { data: AdminSummary | null; error: string | null }) {
  return (
    <Card glass carbon className="p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display font-black text-xl uppercase tracking-tighter text-white">Telemetry feed</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">live · 8s poll</span>
      </div>
      {error && (
        <div className="text-xs font-mono text-trgt-crimson border border-trgt-crimson/40 bg-trgt-crimson-glow rounded-md px-3 py-2 break-all">
          {error}
        </div>
      )}
      {!data && !error && (
        <ul className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="h-10 rounded-md bg-white/5 animate-pulse" />
          ))}
        </ul>
      )}
      {data && (
        <ul className="divide-y divide-white/8">
          {data.metrics.per_route.length === 0 && (
            <li className="py-8 text-sm text-text-muted text-center font-mono">
              No traffic yet — fire a request to populate the feed.
            </li>
          )}
          {data.metrics.per_route.slice(0, 6).map((r) => (
            <li key={r.route} className="flex items-center justify-between py-3">
              <div className="min-w-0 flex-1">
                <div className="font-mono text-sm text-white truncate">{r.route}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                  {r.total} hits · {(r.error_rate_pct ?? 0).toFixed(1)}% err · {r.avg_latency_ms ?? 0}ms
                </div>
              </div>
              <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                {relTime(r.last_seen)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function SystemHealth({ data }: { data: AdminSummary | null }) {
  const cfg = data?.config;
  const items = [
    { label: "Firebase auth", ok: cfg?.firebase_configured, icon: Sparkles },
    { label: "Gemini AI",     ok: cfg?.gemini_configured,   icon: Cpu },
    { label: "Admin secret",  ok: cfg?.admin_secret_set,    icon: Wrench },
    { label: "D1 (Prisma)",   ok: data?.db !== "phase-2-pending", icon: Database, hint: data?.db ?? "" },
  ];
  return (
    <Card glass carbon className="p-6">
      <h2 className="font-display font-black text-xl uppercase tracking-tighter text-white mb-4">
        Power <span className="text-trgt-crimson">unit</span>
      </h2>
      <ul className="space-y-3">
        {items.map((i) => {
          const Icon = i.icon;
          const ok = !!i.ok;
          return (
            <li key={i.label} className="flex items-center gap-3 rounded-lg border border-border-strong/60 px-3 py-2.5 bg-black/30">
              <Icon className={`h-4 w-4 ${ok ? "text-f1-green" : "text-trgt-crimson"}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white">{i.label}</div>
                {i.hint && <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted truncate">{i.hint}</div>}
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-[0.22em] ${ok ? "text-f1-green" : "text-trgt-crimson"}`}>
                {ok ? "OK" : "OFF"}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 pt-4 border-t border-white/8 grid grid-cols-2 gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
        <div>Runtime · <span className="text-white">{data?.process.runtime ?? "—"}</span></div>
        <div className="text-right">Env · <span className="text-white">{data?.config.node_env ?? "—"}</span></div>
      </div>
    </Card>
  );
}
