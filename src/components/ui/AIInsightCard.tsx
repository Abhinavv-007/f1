"use client";

import { useEffect, useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightCardProps {
  circuitId: string;
  lap?: number;
  className?: string;
}

interface InsightState {
  key: string;
  status: "loading" | "ready" | "error";
  fact: string;
}

export function AIInsightCard({ circuitId, lap, className }: AIInsightCardProps) {
  const requestKey = `${circuitId}-${lap ?? "general"}`;
  const [state, setState] = useState<InsightState>({
    key: requestKey,
    status: "loading",
    fact: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    const url = `/api/facts?circuit=${encodeURIComponent(circuitId)}${lap ? `&lap=${lap}` : ""}`;

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        const payload = (await response.json()) as { fact?: string; error?: string };
        if (!response.ok) {
          throw new Error(payload.error || "Telemetry uplink unavailable.");
        }

        return payload;
      })
      .then((payload) => {
        if (!controller.signal.aborted) {
          setState({
            key: requestKey,
            status: "ready",
            fact: payload.fact || "Telemetry uplink unavailable.",
          });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setState({
            key: requestKey,
            status: "error",
            fact: error instanceof Error ? error.message : "Telemetry uplink unavailable.",
          });
        }
      });

    return () => {
      controller.abort();
    };
  }, [circuitId, lap, requestKey]);

  const loading = state.key !== requestKey || state.status === "loading";
  const fact = state.key === requestKey ? state.fact : "";

  return (
    <div
      className={cn(
        "relative rounded-xl border border-[#7B2FBE]/40 bg-gradient-to-br from-[#0f0014]/90 to-black/90 p-5 overflow-hidden group",
        className
      )}
    >
      {/* Ambient purple glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7B2FBE]/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded bg-[#7B2FBE]/30 flex items-center justify-center">
          <Zap className="w-3 h-3 text-[#B56EFF]" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#B56EFF]">
          AI Race Intel
        </span>
        {loading && <Loader2 className="w-3 h-3 animate-spin text-[#B56EFF] ml-auto" />}
      </div>

      {/* Fact */}
      {loading ? (
        <div className="flex flex-col gap-2 mt-2">
          <div className="h-3 bg-white/5 rounded animate-pulse w-full" />
          <div className="h-3 bg-white/5 rounded animate-pulse w-4/5" />
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-white/80 relative z-10">
          {fact}
        </p>
      )}
    </div>
  );
}
