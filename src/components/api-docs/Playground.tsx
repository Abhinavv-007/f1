"use client";

import { useState } from "react";
import { Loader2, Play, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ENDPOINTS } from "./data";

export function Playground() {
  const [endpointId, setEndpointId] = useState(ENDPOINTS[0].id);
  const ep = ENDPOINTS.find((e) => e.id === endpointId)!;
  const [secret, setSecret] = useState("");
  const [running, setRunning] = useState(false);
  const [response, setResponse] = useState<{ status: number; body: string } | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  async function run() {
    setRunning(true);
    setResponse(null);
    setDuration(null);
    const started = performance.now();
    try {
      const headers: Record<string, string> = {};
      if (ep.auth === "admin" && secret) headers["x-admin-secret"] = secret;
      const res = await fetch(ep.path, { method: ep.method, headers });
      const text = await res.text();
      let pretty = text;
      try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch { /* not json */ }
      setResponse({ status: res.status, body: pretty });
    } catch (err) {
      setResponse({ status: 0, body: (err as Error).message });
    } finally {
      setDuration(Math.round(performance.now() - started));
      setRunning(false);
    }
  }

  return (
    <Card glass carbon className="p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
        <label className="block">
          <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted mb-1">Endpoint</span>
          <select
            value={endpointId}
            onChange={(e) => setEndpointId(e.target.value)}
            className="w-full bg-black/40 border border-border-strong rounded-lg px-3 h-11 text-white text-sm focus:outline-none focus:border-trgt-crimson focus:ring-2 focus:ring-trgt-crimson/30"
          >
            {ENDPOINTS.map((e) => (
              <option key={e.id} value={e.id}>{e.method} {e.path}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted mb-1 inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Pit pass
          </span>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            disabled={ep.auth !== "admin"}
            placeholder={ep.auth === "admin" ? "X-Admin-Secret" : "n/a"}
            className="bg-black/40 border border-border-strong rounded-lg px-3 h-11 text-white text-sm font-mono placeholder:text-text-muted focus:outline-none focus:border-trgt-crimson focus:ring-2 focus:ring-trgt-crimson/30 disabled:opacity-40 w-56"
          />
        </label>
        <button
          onClick={run}
          disabled={running}
          className="btn-angled glass-button h-11 px-6 font-display uppercase tracking-widest text-sm text-white inline-flex items-center justify-center gap-2 self-end disabled:opacity-50"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {running ? "Running" : "Send"}
        </button>
      </div>

      <div className="mt-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
        <span className={`rounded-full px-2 py-0.5 ${methodTone(ep.method)}`}>{ep.method}</span>
        <code className="text-white">{ep.path}</code>
        {duration != null && <span className="ml-auto">{duration}ms · status {response?.status ?? "—"}</span>}
      </div>

      <pre className="mt-3 rounded-lg border border-border-strong/60 bg-black/65 px-4 py-3 text-[12.5px] leading-relaxed font-mono text-text-secondary whitespace-pre overflow-x-auto min-h-[6rem]">
        {response ? response.body : "// hit Send to see the live response"}
      </pre>
    </Card>
  );
}

function methodTone(m: string) {
  if (m === "GET")    return "border border-f1-green/40 bg-f1-green/15 text-f1-green";
  if (m === "POST")   return "border border-f1-purple/40 bg-f1-purple-glow text-f1-purple";
  if (m === "DELETE") return "border border-trgt-crimson/40 bg-trgt-crimson-glow text-white";
  return "border border-border-strong/60 bg-white/5 text-text-secondary";
}
