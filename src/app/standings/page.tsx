"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { TiltCard } from "@/components/ui/TiltCard";
import { Trophy, Shield, ChevronUp, ChevronDown, Minus, Loader2 } from "lucide-react";

type StandingTab = "drivers" | "constructors";

interface DriverStanding {
  position: number;
  code: string;
  firstName: string;
  lastName: string;
  team: string;
  teamColor: string;
  nationality: string;
  points: number;
  wins: number;
}

interface ConstructorStanding {
  position: number;
  id: string;
  name: string;
  color: string;
  points: number;
  wins: number;
}

export default function StandingsPage() {
  const [activeTab, setActiveTab] = useState<StandingTab>("drivers");
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<DriverStanding[]>([]);
  const [constructors, setConstructors] = useState<ConstructorStanding[]>([]);

  useEffect(() => {
    fetch("/api/standings")
      .then(res => res.json())
      .then(data => {
        if (data && data.drivers) {
          setDrivers(data.drivers);
          setConstructors(data.constructors);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load standings", err);
        setLoading(false);
      });
  }, []);

  // Animation variants for staggering children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  if (loading) {
     return (
       <div className="flex items-center justify-center min-h-[60vh]">
         <Loader2 className="w-12 h-12 animate-spin text-trgt-crimson drop-shadow-[0_0_15px_rgba(238,63,44,0.5)]" />
       </div>
     );
  }

  return (
    <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto overflow-hidden">
      {/* Top Banner and Tabs */}
      <section className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            World Championship
          </h1>
          <p className="text-text-secondary text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-f1-green animate-pulse" />
            Live Global Standings
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex p-1.5 bg-black/40 backdrop-blur rounded-xl border border-border-strong w-full md:w-auto shadow-2xl relative z-20"
        >
           <button
             onClick={() => setActiveTab("drivers")}
             className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-lg uppercase text-xs font-bold tracking-widest transition-all duration-300 relative ${
               activeTab === "drivers" 
                 ? "text-black shadow-lg" 
                 : "text-text-secondary hover:text-white hover:bg-surface-hover"
             }`}
           >
             {activeTab === "drivers" && (
               <motion.div layoutId="activeTab" className="absolute inset-0 bg-white rounded-lg -z-10" />
             )}
             <Trophy className="w-4 h-4" />
             Drivers
           </button>
           <button
             onClick={() => setActiveTab("constructors")}
             className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-lg uppercase text-xs font-bold tracking-widest transition-all duration-300 relative ${
               activeTab === "constructors" 
                 ? "text-black shadow-lg" 
                 : "text-text-secondary hover:text-white hover:bg-surface-hover"
             }`}
           >
             {activeTab === "constructors" && (
               <motion.div layoutId="activeTab" className="absolute inset-0 bg-white rounded-lg -z-10" />
             )}
             <Shield className="w-4 h-4" />
             Constructors
           </button>
        </motion.div>
      </section>

      {/* Main Table Headers (Floating above cards) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between py-3 px-8 text-[10px] uppercase font-bold text-text-muted tracking-widest mb-4 mx-2"
      >
         <div className="w-[60px]">POS</div>
         <div className="flex-1 min-w-[120px]">
           {activeTab === "drivers" ? "Driver" : "Constructor"}
         </div>
         <div className="w-[120px] hidden md:block text-center mr-4">Wins</div>
         <div className="w-[80px] text-right">Points</div>
      </motion.div>

      {/* Main List */}
      <AnimatePresence mode="wait">
        {activeTab === "drivers" && (
          <motion.div
            key="drivers"
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col gap-4"
          >
            {drivers.map((d, index) => {
              const isP1 = index === 0;
              
              if (isP1) {
                return (
                  <motion.div key={d.code} variants={item}>
                    <TiltCard intensity={5} glass className="shadow-[0_10px_40px_rgba(255,255,255,0.05)] bg-gradient-to-r from-surface-deep/80 to-surface-hover border-t border-t-[3px]" style={{ borderTopColor: d.teamColor }}>
                        <div className="flex items-center justify-between py-6 px-8 relative overflow-hidden group">
                           <div className="absolute top-0 bottom-0 left-0 w-[400px] pointer-events-none opacity-20" style={{ background: `linear-gradient(to right, ${d.teamColor}, transparent)` }} />
                           <div className="w-[60px] font-display text-white text-4xl font-black flex items-center gap-2 drop-shadow-md">
                             1 <Minus className="w-5 h-5 text-text-muted opacity-50" />
                           </div>
                           <div className="flex-1 min-w-[120px] flex items-center gap-6 relative z-10">
                              <div className="w-16 h-16 rounded-full bg-surface-deep border-4 flex items-center justify-center font-display font-black text-white uppercase text-xl shadow-lg" style={{ borderColor: d.teamColor }}>
                                {d.code}
                              </div>
                              <div className="flex flex-col">
                                 <span className="font-display font-black text-white text-3xl uppercase tracking-tighter drop-shadow-lg">{d.firstName} {d.lastName}</span>
                                 <span className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: d.teamColor }}>{d.team} <span className="text-white ml-2">{d.nationality}</span></span>
                              </div>
                           </div>
                           <div className="w-[120px] hidden md:flex items-center justify-center gap-2">
                              <span className="font-mono text-xl text-text-muted">{d.wins}</span>
                           </div>
                           <div className="w-[80px] text-right font-display text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                              {d.points}
                           </div>
                        </div>
                    </TiltCard>
                  </motion.div>
                );
              }

              return (
                <motion.div key={d.code} variants={item}>
                  <Card glass className="flex items-center justify-between py-5 px-8 border-border-strong bg-surface-deep/60 hover:bg-surface-hover/60 transition-colors relative overflow-hidden group border-l-4" style={{ borderLeftColor: d.teamColor }}>
                      <div className="w-[60px] font-display text-white text-3xl font-black flex items-center gap-2 opacity-80">
                        {d.position} 
                      </div>
                      <div className="flex-1 min-w-[120px] flex items-center gap-5 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-surface-deep border-2 flex items-center justify-center font-display font-bold text-white uppercase text-sm transition-shadow" style={{ borderColor: d.teamColor }}>
                          {d.code}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display font-black text-white text-2xl uppercase tracking-tight transition-colors">{d.firstName} {d.lastName}</span>
                            <span className="text-[10px] text-text-secondary uppercase tracking-widest mt-0.5">{d.team} {d.nationality}</span>
                        </div>
                      </div>
                      <div className="w-[120px] hidden md:flex items-center justify-center gap-1.5 opacity-80">
                         <span className="font-mono text-sm text-text-muted">{d.wins}</span>
                      </div>
                      <div className="w-[80px] text-right font-mono text-3xl font-black text-white tracking-tighter">
                        {d.points}
                      </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab === "constructors" && (
          <motion.div
            key="constructors"
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex flex-col gap-5"
          >
            {constructors.map((c, index) => {
              const isP1 = index === 0;

              if (isP1) {
                return (
                  <motion.div key={c.id} variants={item}>
                    <TiltCard intensity={8} glass className="shadow-[0_15px_50px_rgba(255,255,255,0.1)] bg-gradient-to-r from-surface-deep/90 to-surface-hover border-t-[4px]" style={{ borderTopColor: c.color }}>
                        <div className="flex items-center justify-between py-8 px-10 relative overflow-hidden group">
                           <div className="absolute top-0 bottom-0 left-0 w-[500px] pointer-events-none opacity-20" style={{ background: `linear-gradient(to right, ${c.color}, transparent)` }} />
                           <div className="w-[80px] font-display text-white text-5xl font-black flex items-center gap-3 drop-shadow-md">
                             1 <ChevronUp className="w-6 h-6 text-f1-green" />
                           </div>
                           <div className="flex-1 min-w-[120px] flex items-center gap-6 relative z-10 pl-4 border-l border-white/10">
                              <div className="flex flex-col">
                                 <span className="font-display font-black text-4xl uppercase tracking-tighter drop-shadow-lg" style={{ color: c.color }}>{c.name}</span>
                              </div>
                           </div>
                           <div className="w-[120px] hidden md:flex items-center justify-center gap-2">
                             <span className="font-mono text-xl text-text-muted">{c.wins}</span>
                           </div>
                           <div className="w-[100px] text-right font-display text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                              {c.points}
                           </div>
                        </div>
                    </TiltCard>
                  </motion.div>
                );
              }

              return (
                <motion.div key={c.id} variants={item}>
                  <Card glass className="flex items-center justify-between py-6 px-10 border-border-strong bg-surface-deep/60 hover:bg-surface-hover/60 transition-all duration-300 relative overflow-hidden group border-l-4" style={{ borderLeftColor: c.color }}>
                      <div className="w-[80px] font-display text-white text-4xl font-black flex items-center gap-3 opacity-80">
                        {c.position}
                      </div>
                      <div className="flex-1 min-w-[120px] flex items-center gap-6 relative z-10 pl-4 border-l border-white/5">
                        <div className="flex flex-col">
                            <span className="font-display font-black text-white text-3xl uppercase tracking-tighter transition-colors">{c.name}</span>
                        </div>
                      </div>
                      <div className="w-[120px] hidden md:flex items-center justify-center gap-1.5 opacity-80">
                        <span className="font-mono text-sm text-text-muted">{c.wins}</span>
                      </div>
                      <div className="w-[100px] text-right font-mono text-4xl font-black text-white tracking-tighter opacity-90">
                        {c.points}
                      </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
