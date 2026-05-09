"use client";

import { useEffect, useState } from "react";
import { Loader2, ScrollText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { adminFetch, relTime } from "./lib";

interface AuditEntry {
  ts: number;
  route?: string;
  status?: number;
  message?: string;
  [k: string]: unknown;
}
interface Resp {
  ok: boolean;
  events: AuditEntry[];
  [k: string]: unknown;
}

export function Audit() {
  const [data, setData] = useState<Resp | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminFetch<Resp>("/api/admin/audit")
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError((e as Error).message));
    return () => { cancelled = true; };
  }, []);

  return (
    <Card glass carbon className="p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-display font-black text-xl uppercase tracking-tighter text-white">
          Audit <span className="text-trgt-crimson">log</span>
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">last events</span>
      </div>
      {error && <div className="text-xs font-mono text-trgt-crimson break-all">{error}</div>}
      {!data && !error && (
        <div className="min-h-[20vh] flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-trgt-crimson" />
        </div>
      )}
      {data && (data.events?.length ?? 0) === 0 && (
        <div className="text-sm text-text-muted font-mono py-8 text-center inline-flex items-center justify-center gap-2 w-full">
          <ScrollText className="h-4 w-4" /> No events yet.
        </div>
      )}
      {data && data.events && data.events.length > 0 && (
        <ul className="divide-y divide-white/8">
          {data.events.map((e, i) => (
            <li key={i} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="font-mono text-sm text-white truncate">
                  {e.route ?? e.message ?? JSON.stringify(e)}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted whitespace-nowrap">
                  {relTime(e.ts)}
                </span>
              </div>
              {e.status != null && (
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-secondary mt-0.5">
                  status {e.status}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
