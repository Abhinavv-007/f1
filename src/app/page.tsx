"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRaceSession } from "@/hooks/useRaceSession";
import { getCircuitById, getRaceDistanceKm } from "@/lib/race";
import { Gauge, MapPinned, RadioTower } from "lucide-react";

export default function Home() {
  const { session, countdown, error } = useRaceSession();
  const circuit = session?.circuitId ? getCircuitById(session.circuitId) : null;
  const seasonLabel = session
    ? `SEASON ${session.season} // ROUND ${String(session.round).padStart(2, "0")}`
    : "SEASON // LOADING";
  const locationLabel = session ? [session.city, session.country].filter(Boolean).join(" • ") : "Location loading";
  const cardLabel = session?.status === "completed" ? "Season Complete" : session?.isLocked ? "Session Locked" : "Next Race";
  const signalLabel = error ? "Snapshot feed" : session?.source === "remote" ? "Live schedule" : "Race cache";
  const featureIndexClassName =
    "pointer-events-none absolute -top-8 -left-4 select-none font-mono text-6xl font-black tracking-[-0.06em] text-[rgba(238,63,44,0.3)] drop-shadow-[0_0_18px_rgba(238,63,44,0.18)] transition-all duration-500 group-hover:scale-110 group-hover:text-[rgba(255,122,96,0.52)] md:-top-10 md:-left-6 md:text-8xl";

  return (
    <div className="relative w-full overflow-hidden">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-20">
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-start justify-between gap-12">
          
          {/* Left Hero Content */}
          <div className="flex-1 max-w-2xl text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-trgt-crimson opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-trgt-crimson" />
              </span>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-white/70">
                {seasonLabel}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[64px] sm:text-[88px] md:text-[110px] font-black uppercase leading-[0.85] tracking-tight mb-6 text-white drop-shadow-2xl"
            >
              TARGET
              <br />
              <span className="text-trgt-crimson">EVERY</span>
              <br />
              LAP
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-text-secondary text-lg md:text-xl max-w-md mb-10 font-light leading-relaxed"
            >
              Live telemetry. Brutal AI-powered insights. Race predictions. Built for the obsessed Formula 1 fan.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <Link
                href="/live"
                className="btn-angled bg-trgt-crimson text-white text-[14px] font-black uppercase tracking-[0.06em] px-10 py-4 hover:bg-trgt-crimson-deep transition-all duration-300 shadow-[0_0_30px_rgba(238,63,44,0.3)] hover:shadow-[0_0_50px_rgba(238,63,44,0.6)] flex items-center gap-2 group"
              >
                Watch Live
                <span className="text-white/70 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-8 grid w-full max-w-2xl gap-4 sm:grid-cols-3"
            >
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-trgt-crimson">
                  <MapPinned className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                    Venue
                  </span>
                </div>
                <span className="mt-3 block font-display text-xl font-black uppercase tracking-tight text-white">
                  {session?.sessionName ?? "Loading"}
                </span>
                <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-text-secondary">
                  {locationLabel}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-f1-yellow">
                  <Gauge className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                    Race Deck
                  </span>
                </div>
                <span className="mt-3 block font-display text-xl font-black uppercase tracking-tight text-white">
                  {circuit ? `${getRaceDistanceKm(circuit)} km` : "TBC"}
                </span>
                <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-text-secondary">
                  {circuit ? `${circuit.turns} turns // ${circuit.drsZones} DRS` : "Circuit map loading"}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-white/80">
                  <RadioTower className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                    Signal
                  </span>
                </div>
                <span className="mt-3 block font-display text-xl font-black uppercase tracking-tight text-white">
                  {signalLabel}
                </span>
                <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-text-secondary">
                  {cardLabel}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Floating Countdown */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="w-full lg:w-auto lg:mt-32"
          >
            <div className="glass p-8 md:p-10 rounded-2xl max-w-md w-full relative group border-t-0 border-x-0 border-b-2 border-b-trgt-crimson/50 bg-[#111111]/80 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-trgt-crimson/5 to-transparent rounded-2xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />
              <div className="relative z-10 flex flex-col">
                <span className="text-white/40 text-[11px] uppercase tracking-[0.2em] mb-2 font-medium">{cardLabel}</span>
                <h3 className="text-white font-bold font-display text-2xl uppercase tracking-tight mb-1">
                  {session?.sessionName || (error ? "Schedule Offline" : "Loading Race")}
                </h3>
                <span className="text-white/40 text-sm font-sans mb-8">
                  {session?.circuit || "Circuit TBD"}
                </span>
                
                <div className="flex items-center justify-between gap-2 font-mono text-5xl font-normal tracking-tight">
                  <div className="flex flex-col items-center">
                    <span className="text-white drop-shadow-md">{countdown.days}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-sans mt-3">Days</span>
                  </div>
                  <span className="text-trgt-crimson mb-8 text-2xl font-black">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-white drop-shadow-md">{countdown.hours}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-sans mt-3">Hrs</span>
                  </div>
                  <span className="text-trgt-crimson mb-8 text-2xl font-black">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-white drop-shadow-md">{countdown.minutes}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-sans mt-3">Min</span>
                  </div>
                  <span className="text-trgt-crimson mb-8 text-2xl font-black">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-white drop-shadow-md">{countdown.seconds}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-sans mt-3">Sec</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border-subtle/30 flex items-center justify-between">
                   <Link
                    href="/predict"
                    className="btn-angled bg-trgt-crimson text-white text-[12px] font-bold uppercase tracking-[0.06em] px-6 py-2.5 hover:bg-trgt-crimson-deep transition-all duration-300"
                   >
                    {session?.isLocked ? "View Predictions" : "Lock Prediction"}
                   </Link>
                   <span className="text-white/30 text-[12px] font-light">{locationLabel}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES ROW ═══ */}
      <section className="relative z-20 w-full bg-black/40 border-y border-border-subtle/50 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
          
          <div className="mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none text-white">
              BUILT FOR
              <br />
              <span className="text-white/30">SPEED OBSESSION.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="relative group">
              <span className={featureIndexClassName}>
                01
              </span>
              <div className="relative pt-8">
                <h3 className="text-2xl font-black font-display uppercase tracking-tight text-white mb-4 flex items-center gap-3">
                  Live Telemetry
                </h3>
                <p className="text-text-secondary text-[15px] leading-relaxed font-light">
                  20-driver timing towers, tire strategies, gap charts, and live physical circuit mapping straight from the paddock.
                </p>
              </div>
            </div>

            <div className="relative group">
              <span className={featureIndexClassName}>
                02
              </span>
              <div className="relative pt-8">
                <h3 className="text-2xl font-black font-display uppercase tracking-tight text-white mb-4 flex items-center gap-3">
                  AI Race Intel
                </h3>
                <p className="text-text-secondary text-[15px] leading-relaxed font-light">
                  Surgical, aggressively factual race insights. Real-time pit window predictions and head-to-head strategy logic.
                </p>
              </div>
            </div>

            <div className="relative group">
              <span className={featureIndexClassName}>
                03
              </span>
              <div className="relative pt-8">
                <h3 className="text-2xl font-black font-display uppercase tracking-tight text-white mb-4 flex items-center gap-3">
                  Global Predicts
                </h3>
                <p className="text-text-secondary text-[15px] leading-relaxed font-light">
                  Lock in your podiums. Outsmart the grid. Track your global standing across the entire 24-race calendar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LIVE PREVIEW TEASER ═══ */}
      <section className="relative w-full py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center">
          <span className="text-trgt-crimson text-xs uppercase tracking-[0.2em] font-bold mb-4 block">Command Center</span>
          <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-8">
            ENTER THE PIT WALL
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Experience the race like an engineer. Monitor every split, every tire change, and every battle. No fluff, just raw data.
          </p>
          
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-trgt-crimson to-f1-purple blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
            <Link
              href="/live"
              className="relative btn-angled bg-surface-deep text-white text-[14px] font-black uppercase tracking-[0.1em] px-12 py-5 border border-border-strong hover:border-trgt-crimson transition-colors"
            >
              Access Telemetry
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
