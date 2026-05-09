"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, Star, Trophy } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { adminFetch, relTime } from "./lib";
import { formatNationalityFlag } from "@/lib/utils";

interface Driver {
  id: string;
  email: string;
  username: string | null;
  country: string | null;
  totalPoints: number;
  predictionAccuracy: number;
  isPro: boolean;
  createdAt: string;
}
interface Resp {
  ok: boolean;
  db_available: boolean;
  db_error: string | null;
  total: number;
  drivers: Driver[];
}

export function Drivers() {
  const [data, setData] = useState<Resp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setData(null);
    const t = setTimeout(async () => {
      try {
        const d = await adminFetch<Resp>(`/api/admin/drivers?q=${encodeURIComponent(q)}`);
        if (!cancelled) setData(d);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [q]);

  return (
    <Card glass carbon className="p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
        <div>
          <h2 className="font-display font-black text-xl uppercase tracking-tighter text-white">
            Driver <span className="text-trgt-crimson">roster</span>
          </h2>
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-text-muted mt-1">
            {data?.total != null ? `${data.total} total · showing ${data.drivers.length}` : "loading…"}
          </p>
        </div>
        <label className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search email / username / name"
            className="w-full bg-black/40 border border-border-strong rounded-full pl-10 pr-4 h-10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-trgt-crimson focus:ring-2 focus:ring-trgt-crimson/30 transition-colors"
          />
        </label>
      </div>

      {error && <div className="text-xs font-mono text-trgt-crimson break-all">{error}</div>}
      {!data && !error && (
        <div className="min-h-[20vh] flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-trgt-crimson" />
        </div>
      )}

      {data && data.db_available === false && (
        <div className="rounded-md border border-f1-yellow/40 bg-f1-yellow/10 px-4 py-3 text-xs font-mono text-f1-yellow">
          D1 binding not yet wired to Prisma. Roster will populate once the @prisma/adapter-d1 setup is complete.
          {data.db_error ? <div className="mt-1 text-text-secondary text-[10px]">{data.db_error}</div> : null}
        </div>
      )}

      {data && data.drivers.length > 0 && (
        <div className="overflow-x-auto -mx-2 px-2 mt-2">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                <th className="text-left pb-2 pr-3">Driver</th>
                <th className="text-left pb-2 px-3">Country</th>
                <th className="text-right pb-2 px-3">Points</th>
                <th className="text-right pb-2 px-3">Accuracy</th>
                <th className="text-right pb-2 px-3">Tier</th>
                <th className="text-right pb-2 pl-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {data.drivers.map((d) => (
                <tr key={d.id}>
                  <td className="py-2.5 pr-3">
                    <div className="text-white">{d.username || d.email.split("@")[0]}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">{d.email}</div>
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary">
                    <span className="mr-1.5">{formatNationalityFlag(d.country ?? "")}</span>
                    {d.country ?? "—"}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-white tabular-nums">{d.totalPoints}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-text-secondary tabular-nums">{(d.predictionAccuracy * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right">
                    {d.isPro ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-f1-purple/40 bg-f1-purple-glow px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.16em] text-f1-purple">
                        <Star className="h-3 w-3" /> Pro
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">Free</span>
                    )}
                  </td>
                  <td className="py-2.5 pl-3 text-right font-mono text-text-secondary text-xs">
                    {relTime(Math.floor(new Date(d.createdAt).getTime() / 1000))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.db_available && data.drivers.length === 0 && (
        <div className="text-sm text-text-muted font-mono py-8 text-center inline-flex items-center justify-center gap-2 w-full">
          <Trophy className="h-4 w-4 text-text-muted" /> No drivers match.
        </div>
      )}
    </Card>
  );
}
