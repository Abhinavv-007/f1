"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Cpu, Globe, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import {
  ENDPOINTS, SECTIONS,
  type Endpoint, type SectionKey,
} from "@/components/api-docs/data";
import { CodeBlock } from "@/components/api-docs/CodeBlock";
import { Playground } from "@/components/api-docs/Playground";

const NAV = [
  { id: "getting-started", label: "Getting started" },
  { id: "authentication",  label: "Authentication" },
  { id: "public",           label: "Public endpoints" },
  { id: "admin",            label: "Admin endpoints" },
  { id: "playground",       label: "Live playground" },
  { id: "errors",           label: "Errors & limits" },
];

export function ApiDocsClient() {
  const [active, setActive] = useState("getting-started");

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("section[data-doc-id]"));
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top)[0];
        if (visible) setActive(((visible.target as HTMLElement).dataset.docId ?? "") as string);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const grouped = useMemo(() => {
    const out: Record<SectionKey, Endpoint[]> = { public: [], admin: [] };
    for (const e of ENDPOINTS) out[e.section].push(e);
    return out;
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
      <Hero />
      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto pr-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted mb-3">On this page</div>
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className={cn(
                    "block rounded-md border-l-2 pl-3 pr-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                    active === n.id
                      ? "border-trgt-crimson text-white bg-trgt-crimson-glow"
                      : "border-transparent text-text-secondary hover:text-white"
                  )}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted mb-2">Endpoints</div>
          <ul className="space-y-0.5">
            {ENDPOINTS.map((e) => (
              <li key={e.id}>
                <a
                  href={`#${e.id}`}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-mono text-text-secondary hover:text-white hover:bg-white/5"
                >
                  <span className={cn("inline-block w-12 text-[9px] uppercase tracking-[0.18em]", methodTextTone(e.method))}>
                    {e.method}
                  </span>
                  <span className="truncate">{e.path}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <main className="min-w-0 space-y-12">
          <DocSection id="getting-started" title="Getting started" kicker="Start your engine">
            <p className="text-sm text-text-secondary leading-relaxed">
              The <span className="font-mono text-trgt-crimson">TRGT</span> API powers every page on{" "}
              <span className="font-mono text-white">trgt.in</span> — live race state, predictions, leaderboard, weather, telemetry.
              Public routes are open and cacheable. Admin routes are gated by a master secret and never logged.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              <Bullet icon={Globe}        title="Edge runtime"      body="Every endpoint runs on Cloudflare's edge with single-digit-ms responses." />
              <Bullet icon={ShieldCheck}  title="Admin gate"        body="Admin routes require X-Admin-Secret. Constant-time compared, never logged." />
              <Bullet icon={Cloud}        title="Cloudflare native" body="Backed by Workers + D1 + KV. The Vault tab proxies the Cloudflare REST API." />
              <Bullet icon={Cpu}          title="Live playground"   body="Try any endpoint inline — including admin routes after pasting your pit pass." />
            </ul>
          </DocSection>

          <DocSection id="authentication" title="Authentication" kicker="Pit pass">
            <Card glass carbon className="p-5 mt-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-trgt-crimson">Header</span>
                <code className="font-mono text-white text-sm bg-black/40 border border-border-strong rounded px-2 py-0.5">X-Admin-Secret: &lt;TRGT_ADMIN_SECRET&gt;</code>
              </div>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                Set <code className="font-mono text-white">TRGT_ADMIN_SECRET</code> on the worker (via{" "}
                <code className="font-mono text-white">wrangler secret put</code> or the Cloudflare dashboard) and pass the same value in the request header.
                Public endpoints don&apos;t need any header.
              </p>
            </Card>
            <CodeBlock
              filename="auth.sh"
              language="bash"
              className="mt-3"
              code={`# Set on the worker
wrangler secret put TRGT_ADMIN_SECRET

# Use in requests
curl https://trgt.in/api/admin/summary \\
  -H "X-Admin-Secret: $TRGT_ADMIN_SECRET"`}
            />
          </DocSection>

          <DocSection id="public" title="Public endpoints" kicker={SECTIONS.public.caption}>
            <div className="space-y-5">
              {grouped.public.map((e) => <EndpointCard key={e.id} endpoint={e} />)}
            </div>
          </DocSection>

          <DocSection id="admin" title="Admin endpoints" kicker={SECTIONS.admin.caption}>
            <div className="space-y-5">
              {grouped.admin.map((e) => <EndpointCard key={e.id} endpoint={e} />)}
            </div>
          </DocSection>

          <DocSection id="playground" title="Live playground" kicker="Hot lap">
            <Playground />
          </DocSection>

          <DocSection id="errors" title="Errors & rate limits" kicker="Yellow flags">
            <div className="grid gap-3 sm:grid-cols-2">
              <ErrorRow code="401" name="Unauthorized" body="Missing or wrong X-Admin-Secret on a /api/admin/* route." />
              <ErrorRow code="404" name="Not Found"    body="Route doesn't exist or has been retired." />
              <ErrorRow code="500" name="Internal"    body="Worker threw — check the Telemetry tab for the per-route error rate." />
              <ErrorRow code="503" name="Unavailable" body="Cloudflare token not set or upstream binding (D1) not yet provisioned." />
            </div>
          </DocSection>
        </main>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <header>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-trgt-crimson opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-trgt-crimson" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-trgt-crimson">PIT LANE · OPEN</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-muted">·</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-muted">v1 · {ENDPOINTS.length} endpoints</span>
      </div>
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="font-display font-black text-4xl md:text-6xl uppercase tracking-tighter text-white"
      >
        TRGT <span className="text-trgt-crimson">API</span>
      </motion.h1>
      <p className="mt-3 max-w-2xl text-base text-text-secondary leading-relaxed">
        Open paddock for builders — every public route, plus the admin pit-wall API,
        with copy-paste curl, JSON shapes, and a live in-browser playground.
      </p>
    </header>
  );
}

function DocSection({ id, title, kicker, children }: { id: string; title: string; kicker: string; children: React.ReactNode }) {
  return (
    <section id={id} data-doc-id={id} className="scroll-mt-28">
      <div className="mb-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted">{kicker}</div>
        <h2 className="mt-1 font-display font-black text-3xl md:text-4xl uppercase tracking-tighter text-white">
          {title}
        </h2>
        <div className="mt-3 h-px w-16 bg-trgt-crimson" />
      </div>
      {children}
    </section>
  );
}

function Bullet({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-border-strong/60 bg-black/30 p-3">
      <Icon className="h-4 w-4 text-trgt-crimson mt-0.5" />
      <div>
        <div className="text-sm font-display uppercase tracking-[0.16em] text-white">{title}</div>
        <div className="mt-1 text-xs text-text-secondary leading-relaxed">{body}</div>
      </div>
    </li>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  return (
    <Card id={endpoint.id} glass carbon className="p-6 scroll-mt-28">
      <div className="flex flex-wrap items-baseline gap-3 mb-2">
        <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]", methodPillTone(endpoint.method))}>
          {endpoint.method}
        </span>
        <code className="font-mono text-base text-white">{endpoint.path}</code>
        {endpoint.auth === "admin" && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-trgt-crimson/40 bg-trgt-crimson-glow px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white">
            <ShieldCheck className="h-3 w-3" /> admin
          </span>
        )}
      </div>
      <div className="font-display text-lg uppercase tracking-tighter text-white">{endpoint.title}</div>
      <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{endpoint.description}</p>

      {endpoint.params && endpoint.params.length > 0 && (
        <div className="mt-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted mb-2">Parameters</div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/8">
              {endpoint.params.map((p) => (
                <tr key={p.name}>
                  <td className="py-2 pr-3 align-top">
                    <code className="font-mono text-trgt-crimson">{p.name}</code>
                    {p.required && <span className="ml-1 font-mono text-[9px] uppercase text-f1-yellow">required</span>}
                  </td>
                  <td className="py-2 pr-3 align-top font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">{p.in}</td>
                  <td className="py-2 align-top text-text-secondary text-xs">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <CodeBlock filename="curl" code={curlFor(endpoint)} />
        <CodeBlock filename="response.json" language="json" code={endpoint.example} />
      </div>
    </Card>
  );
}

function curlFor(e: Endpoint) {
  const q = e.params?.filter((p) => p.in === "query" && p.example).map((p) => `${p.name}=${p.example}`).join("&");
  const path = q ? `${e.path}?${q}` : e.path;
  const headers = e.auth === "admin" ? ` \\\n  -H "X-Admin-Secret: $TRGT_ADMIN_SECRET"` : "";
  const method = e.method === "GET" ? "" : ` -X ${e.method}`;
  return `curl${method} https://trgt.in${path}${headers}`;
}

function ErrorRow({ code, name, body }: { code: string; name: string; body: string }) {
  return (
    <div className="rounded-lg border border-border-strong/60 bg-black/30 p-3 flex items-start gap-3">
      <span className="font-display text-2xl tracking-tighter text-trgt-crimson w-12">{code}</span>
      <div className="min-w-0">
        <div className="font-display text-sm uppercase tracking-[0.16em] text-white">{name}</div>
        <div className="text-xs text-text-secondary mt-1">{body}</div>
      </div>
    </div>
  );
}

function methodTextTone(m: string) {
  if (m === "GET")    return "text-f1-green";
  if (m === "POST")   return "text-f1-purple";
  if (m === "DELETE") return "text-trgt-crimson";
  return "text-text-secondary";
}

function methodPillTone(m: string) {
  if (m === "GET")    return "border-f1-green/40 bg-f1-green/15 text-f1-green";
  if (m === "POST")   return "border-f1-purple/40 bg-f1-purple-glow text-f1-purple";
  if (m === "DELETE") return "border-trgt-crimson/40 bg-trgt-crimson-glow text-white";
  return "border-border-strong/60 bg-white/5 text-text-secondary";
}
