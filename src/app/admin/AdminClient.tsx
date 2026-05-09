"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Cloud, Gauge, KeyRound, Loader2, LogOut,
  RadioTower, ScrollText, ShieldCheck, Trophy, Users, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import {
  getStoredSecret, setStoredSecret, adminFetch,
} from "@/components/admin/lib";
import { Overview } from "@/components/admin/Overview";
import { Telemetry } from "@/components/admin/Telemetry";
import { Drivers } from "@/components/admin/Drivers";
import { RaceControl } from "@/components/admin/RaceControl";
import { Vault } from "@/components/admin/Vault";
import { Audit } from "@/components/admin/Audit";

const TABS = [
  { id: "overview"  as const, label: "Pit Wall",  caption: "Live ops",    icon: Gauge },
  { id: "telemetry" as const, label: "Telemetry", caption: "API metrics", icon: Activity },
  { id: "drivers"   as const, label: "Drivers",   caption: "User roster", icon: Users },
  { id: "races"     as const, label: "Race Ctrl", caption: "Schedule",    icon: Trophy },
  { id: "vault"     as const, label: "Vault",     caption: "Cloudflare",  icon: Cloud },
  { id: "audit"     as const, label: "Audit",     caption: "History",     icon: ScrollText },
];
type TabId = (typeof TABS)[number]["id"];

export function AdminClient() {
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<TabId>("overview");

  useEffect(() => {
    const stored = getStoredSecret();
    if (!stored) { setHydrated(true); return; }
    adminFetch("/api/admin/health")
      .then(() => setAuthed(true))
      .catch(() => setStoredSecret(""))
      .finally(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-trgt-crimson" />
      </div>
    );
  }
  if (!authed) return <PitPassGate onSuccess={() => setAuthed(true)} />;

  return (
    <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
      <Header onLogout={() => { setStoredSecret(""); setAuthed(false); }} />
      <Tabs active={tab} onChange={setTab} />
      <div className="mt-6 lg:mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {tab === "overview"  && <Overview />}
            {tab === "telemetry" && <Telemetry />}
            {tab === "drivers"   && <Drivers />}
            {tab === "races"     && <RaceControl />}
            {tab === "vault"     && <Vault />}
            {tab === "audit"     && <Audit />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function PitPassGate({ onSuccess }: { onSuccess: () => void }) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true); setError(null);
    try {
      const res = await fetch("/api/admin/health", { headers: { "x-admin-secret": secret } });
      if (!res.ok) { setError("Wrong pit pass — verify TRGT_ADMIN_SECRET."); return; }
      setStoredSecret(secret);
      onSuccess();
    } catch {
      setError("Telemetry link broke. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card glass carbon className="p-8 md:p-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-trgt-crimson opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-trgt-crimson" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-muted">
              CHECKERED · OPS
            </span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tighter text-white">
            Pit Pass <span className="text-trgt-crimson">Required</span>
          </h1>
          <p className="mt-3 text-sm text-text-secondary leading-relaxed">
            Enter the master admin secret to access TRGT telemetry, the driver roster, race control, and the Cloudflare vault.
          </p>
          <form onSubmit={submit} className="mt-7 space-y-3">
            <label className="block">
              <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-text-muted mb-2">
                X-Admin-Secret
              </span>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  required autoFocus spellCheck={false}
                  placeholder="trgt-…"
                  className="w-full bg-black/40 border border-border-strong rounded-lg pl-10 pr-4 h-12 text-white font-mono text-sm placeholder:text-text-muted focus:outline-none focus:border-trgt-crimson focus:ring-2 focus:ring-trgt-crimson/30 transition-colors"
                />
              </div>
            </label>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-md border border-trgt-crimson/40 bg-trgt-crimson-glow px-3 py-2 text-xs text-white font-mono"
              >
                {error}
              </motion.div>
            )}
            <button
              type="submit"
              disabled={pending || !secret}
              className="btn-angled glass-button w-full h-12 font-display uppercase tracking-widest text-sm text-white disabled:opacity-50 disabled:pointer-events-none"
            >
              {pending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Locking on…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Engage
                </span>
              )}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-white/10 text-[11px] uppercase tracking-[0.24em] text-text-muted font-mono flex items-center justify-between">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" /> constant-time check
            </span>
            <span>edge runtime</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function Header({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="relative">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-f1-green opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-f1-green" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-f1-green">
              ARMED · MONITORING
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-muted">·</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-muted">
              SESSION <span className="text-white">{new Date().toISOString().slice(0,10)}</span>
            </span>
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tighter text-white">
            Race <span className="text-trgt-crimson">Ops</span>
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            The TRGT pit wall — telemetry, driver roster, race control, vault, audit.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => location.reload()}
            className="glass-button topbar-button inline-flex h-10 items-center justify-center rounded-full border border-border-strong px-4 text-[11px] font-display uppercase tracking-[0.18em] text-text-secondary hover:text-white"
          >
            <RadioTower className="h-3.5 w-3.5 mr-2" /> Refresh
          </button>
          <button
            onClick={onLogout}
            className="glass-button topbar-button inline-flex h-10 items-center justify-center rounded-full border border-border-strong px-4 text-[11px] font-display uppercase tracking-[0.18em] text-text-secondary hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5 mr-2" /> Box-box
          </button>
        </div>
      </div>
      <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </header>
  );
}

function Tabs({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  return (
    <nav className="mt-6 -mx-2 overflow-x-auto">
      <div className="flex items-center gap-2 px-2 min-w-max">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={cn(
                "glass-button topbar-button group inline-flex items-center gap-3 rounded-full border px-4 py-2.5 text-left transition-colors min-h-[3rem]",
                isActive ? "topbar-button-active" : "border-border-strong/70 text-text-secondary hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-text-secondary group-hover:text-white")} />
              <span className="flex flex-col leading-tight">
                <span className="font-display text-xs uppercase tracking-[0.16em] text-white">{t.label}</span>
                <span className="hidden sm:inline-block font-mono text-[9px] uppercase tracking-[0.22em] text-text-muted">{t.caption}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
