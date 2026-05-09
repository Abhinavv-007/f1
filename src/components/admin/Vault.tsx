"use client";

import { useEffect, useState } from "react";
import { Cloud, Database, Hash, KeyRound, Loader2, Workflow } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { adminFetch, relTime } from "./lib";

interface VaultData {
  ok: boolean;
  error?: string;
  token: { id: string; status: string };
  account: { id: string; name: string; type?: string | null } | null;
  accountId: string;
  accounts: Array<{ id: string; name: string; type: string | null }>;
  d1: Array<{ uuid: string; name: string; created_at?: string; version?: string }>;
  kv: Array<{ id: string; title: string }>;
  workers: Array<{ id: string; modified_on: string | null }>;
}

export function Vault() {
  const [data, setData] = useState<VaultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminFetch<VaultData>("/api/admin/cloudflare")
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError((e as Error).message));
    return () => { cancelled = true; };
  }, []);

  if (!data && !error) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-trgt-crimson" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <Card glass carbon className="p-6">
        <div className="flex items-center gap-2 text-trgt-crimson font-mono text-sm">
          <Cloud className="h-4 w-4" />
          {error ?? "Cloudflare proxy unreachable"}
        </div>
        <Setup />
      </Card>
    );
  }
  if (!data.ok) {
    return (
      <Card glass carbon className="p-6">
        <div className="flex items-center gap-2 text-f1-yellow font-mono text-sm">
          <Cloud className="h-4 w-4" />
          {data.error ?? "Cloudflare token not configured"}
        </div>
        <Setup />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ConnectionCard data={data} />
      <div className="grid gap-6 lg:grid-cols-3">
        <ResourceCard
          icon={Database} title="D1 databases" tone="crimson"
          empty="No D1 databases on this account yet."
          items={data.d1.map((d) => ({ key: d.uuid, primary: d.name, secondary: d.uuid }))}
        />
        <ResourceCard
          icon={KeyRound} title="KV namespaces" tone="purple"
          empty="No KV namespaces yet."
          items={data.kv.map((k) => ({ key: k.id, primary: k.title, secondary: k.id }))}
        />
        <ResourceCard
          icon={Workflow} title="Workers" tone="green"
          empty="No deployed worker scripts."
          items={data.workers.map((w) => ({
            key: w.id,
            primary: w.id,
            secondary: w.modified_on ? `updated ${relTime(Math.floor(new Date(w.modified_on).getTime() / 1000))}` : "—",
          }))}
        />
      </div>
    </div>
  );
}

function ConnectionCard({ data }: { data: VaultData }) {
  return (
    <Card glass carbon className="p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display font-black text-xl uppercase tracking-tighter text-white">
            Cloudflare <span className="text-trgt-crimson">vault</span>
          </h2>
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-text-muted mt-1 inline-flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-f1-green opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-f1-green" />
            </span>
            token · {data.token.status}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Account" value={data.account?.name ?? "—"} />
          <Stat label="Account ID" value={(data.accountId || "").slice(0, 8) + "…"} mono />
        </div>
      </div>
    </Card>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-border-strong/60 bg-black/30 px-3 py-2">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">{label}</div>
      <div className={mono ? "font-mono text-white" : "text-white"}>{value}</div>
    </div>
  );
}

const TONE = {
  crimson: { text: "text-trgt-crimson" },
  purple:  { text: "text-f1-purple" },
  green:   { text: "text-f1-green" },
} as const;
type Tone = keyof typeof TONE;

function ResourceCard({ icon: Icon, title, items, empty, tone }: {
  icon: React.ElementType; title: string;
  items: Array<{ key: string; primary: string; secondary: string }>;
  empty: string; tone: Tone;
}) {
  return (
    <Card glass carbon className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-4 w-4 ${TONE[tone].text}`} />
        <h3 className="font-display text-sm uppercase tracking-[0.16em] text-white">{title}</h3>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <div className="text-xs font-mono text-text-muted py-4">{empty}</div>
      ) : (
        <ul className="space-y-2">
          {items.map((i) => (
            <li key={i.key} className="rounded-md border border-border-strong/40 bg-black/30 px-3 py-2">
              <div className="text-sm text-white truncate flex items-center gap-2">
                <Hash className="h-3 w-3 text-text-muted" />
                {i.primary}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted truncate">{i.secondary}</div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Setup() {
  return (
    <pre className="mt-4 rounded-md border border-border-strong/60 bg-black/40 px-4 py-3 text-xs font-mono text-text-secondary whitespace-pre-wrap">
{`# Set the token via Wrangler:
wrangler secret put CLOUDFLARE_API_TOKEN

# Or for local dev, edit .dev.vars and add:
CLOUDFLARE_API_TOKEN=your-token

# Token needs the scopes: Account.Read, D1.Read, KV.Read, Workers.Read`}
    </pre>
  );
}
