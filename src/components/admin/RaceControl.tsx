"use client";

import { useEffect, useState } from "react";
import { Flag, Loader2, MapPin, Timer } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { adminFetch } from "./lib";
import { formatCountryFlag } from "@/lib/utils";

interface Race {
  id: string;
  season: number;
  round: number;
  name: string;
  circuitId: string;
  country: string;
  raceDate: string;
  status: string;
  winnerCode: string | null;
  fastestLapCode: string | null;
}
interface Resp {
  ok: boolean;
  db_available: boolean;
  db_error: string | null;
  total: number;
  races: Race[];
}

export function RaceControl() {
  const [data, setData] = useState<Resp | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminFetch<Resp>("/api/admin/races")
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError((e as Error).message));
    return () => { cancelled = true; };
  }, []);

  return (
    <Card glass carbon className="p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display font-black text-xl uppercase tracking-tighter text-white">
          Race <span className="text-trgt-crimson">control</span>
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
          {data?.total != null ? `${data.total} rounds` : "loading…"}
        </span>
      </div>
      {error && <div className="text-xs font-mono text-trgt-crimson break-all">{error}</div>}
      {!data && !error && (
        <div className="min-h-[20vh] flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-trgt-crimson" />
        </div>
      )}
      {data && data.db_available === false && (
        <div className="rounded-md border border-f1-yellow/40 bg-f1-yellow/10 px-4 py-3 text-xs font-mono text-f1-yellow">
          D1 binding not yet wired. Schedule will populate once the database is online.
        </div>
      )}
      {data && data.races.length > 0 && (
        <ul className="space-y-3 mt-3">
          {data.races.map((r) => (
            <li key={r.id} className="flex items-center gap-4 rounded-lg border border-border-strong/60 bg-black/30 px-4 py-3">
              <div className="font-display font-black text-2xl tracking-tighter text-white w-12 text-right">
                {String(r.round).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-lg">{formatCountryFlag(r.country)}</span>
                  <span className="truncate">{r.name}</span>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted inline-flex items-center gap-3 mt-0.5">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.circuitId}</span>
                  <span className="inline-flex items-center gap-1"><Timer className="h-3 w-3" /> {new Date(r.raceDate).toUTCString().slice(0, 22)}</span>
                </div>
              </div>
              <StatusPill status={r.status} />
            </li>
          ))}
        </ul>
      )}
      {data && data.db_available && data.races.length === 0 && (
        <div className="text-sm text-text-muted font-mono py-8 text-center inline-flex items-center justify-center gap-2 w-full">
          <Flag className="h-4 w-4" /> No races scheduled yet.
        </div>
      )}
    </Card>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles =
    status === "live"      ? "border-f1-green/50 bg-f1-green/15 text-f1-green" :
    status === "completed" ? "border-text-muted/40 bg-white/5 text-text-secondary" :
                             "border-trgt-crimson/40 bg-trgt-crimson-glow text-white";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${styles}`}>
      {status === "live" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-f1-green opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-f1-green" />
        </span>
      )}
      {status}
    </span>
  );
}
