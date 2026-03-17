"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { TiltCard } from "@/components/ui/TiltCard";
import { Trophy, Shield, ChevronUp, ChevronDown, Minus } from "lucide-react";

type StandingTab = "drivers" | "constructors";

export default function StandingsPage() {
  const [activeTab, setActiveTab] = useState<StandingTab>("drivers");

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
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

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
            <span className="w-2 h-2 rounded-full bg-trgt-crimson animate-pulse" />
            2025 Season Standings // After Round 3
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
         <div className="w-[120px] hidden md:block text-center mr-4">Form</div>
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
            {/* Driver P1 */}
            <motion.div variants={item}>
              <TiltCard intensity={5} glass className="border-t-trgt-crimson border-t-[3px] shadow-[0_10px_40px_rgba(238,63,44,0.15)] bg-gradient-to-r from-surface-deep/80 to-blue-900/10">
                  <div className="flex items-center justify-between py-6 px-8 relative overflow-hidden group">
                     <div className="absolute top-0 bottom-0 left-0 w-[400px] bg-gradient-to-r from-blue-600/10 to-transparent pointer-events-none" />
                     <div className="w-[60px] font-display text-white text-4xl font-black flex items-center gap-2 drop-shadow-md">
                       1 <Minus className="w-5 h-5 text-text-muted opacity-50" />
                     </div>
                     <div className="flex-1 min-w-[120px] flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-full bg-surface-deep border-4 border-blue-600 flex items-center justify-center font-display font-black text-white uppercase text-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">MV</div>
                        <div className="flex flex-col">
                           <span className="font-display font-black text-white text-3xl uppercase tracking-tighter drop-shadow-lg">Max Verstappen</span>
                           <span className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">Red Bull Racing</span>
                        </div>
                     </div>
                     <div className="w-[120px] hidden md:flex items-center justify-center gap-2">
                        <span className="w-8 h-8 rounded bg-f1-green text-black flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(0,255,136,0.3)]">1</span>
                        <span className="w-8 h-8 rounded bg-f1-green text-black flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(0,255,136,0.3)]">1</span>
                        <span className="w-8 h-8 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-xs font-bold">2</span>
                     </div>
                     <div className="w-[80px] text-right font-display text-5xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                        68
                     </div>
                  </div>
              </TiltCard>
            </motion.div>

            {/* Driver P2 */}
            <motion.div variants={item}>
              <Card glass className="flex items-center justify-between py-5 px-8 border-border-strong bg-gradient-to-r from-surface-deep/80 to-red-900/10 hover:bg-surface-hover/60 transition-colors relative overflow-hidden group border-l-4 border-l-red-600">
                  <div className="w-[60px] font-display text-white text-3xl font-black flex items-center gap-2 opacity-80">
                    2 <ChevronUp className="w-5 h-5 text-f1-green" />
                  </div>
                  <div className="flex-1 min-w-[120px] flex items-center gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-surface-deep border-2 border-red-600 flex items-center justify-center font-display font-bold text-white uppercase text-sm group-hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-shadow">CL</div>
                    <div className="flex flex-col">
                        <span className="font-display font-black text-white text-2xl uppercase tracking-tight group-hover:text-red-400 transition-colors">Charles Leclerc</span>
                        <span className="text-[10px] text-text-secondary uppercase tracking-widest mt-0.5">Ferrari</span>
                    </div>
                  </div>
                  <div className="w-[120px] hidden md:flex items-center justify-center gap-1.5 opacity-80">
                    <span className="w-7 h-7 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    <span className="w-7 h-7 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <span className="w-7 h-7 rounded bg-f1-green text-black flex items-center justify-center text-[10px] font-bold">1</span>
                  </div>
                  <div className="w-[80px] text-right font-mono text-3xl font-black text-white tracking-tighter">
                    56
                  </div>
              </Card>
            </motion.div>

            {/* Driver P3 */}
            <motion.div variants={item}>
              <Card glass className="flex items-center justify-between py-5 px-8 border-border-strong bg-gradient-to-r from-surface-deep/80 to-red-900/5 hover:bg-surface-hover/60 transition-colors relative overflow-hidden group border-l-4 border-l-red-500">
                  <div className="w-[60px] font-display text-white text-3xl font-black flex items-center gap-2 opacity-80">
                    3 <ChevronUp className="w-5 h-5 text-f1-green" />
                  </div>
                  <div className="flex-1 min-w-[120px] flex items-center gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-surface-deep border-2 border-red-500 flex items-center justify-center font-display font-bold text-white uppercase text-sm group-hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-shadow">CS</div>
                    <div className="flex flex-col">
                        <span className="font-display font-black text-white text-2xl uppercase tracking-tight group-hover:text-red-400 transition-colors">Carlos Sainz</span>
                        <span className="text-[10px] text-text-secondary uppercase tracking-widest mt-0.5">Ferrari</span>
                    </div>
                  </div>
                  <div className="w-[120px] hidden md:flex items-center justify-center gap-1.5 opacity-80">
                    <span className="w-7 h-7 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    <span className="w-7 h-7 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">4</span>
                    <span className="w-7 h-7 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">3</span>
                  </div>
                  <div className="w-[80px] text-right font-mono text-3xl font-black text-white tracking-tighter">
                    45
                  </div>
              </Card>
            </motion.div>

            {/* Driver P4 */}
            <motion.div variants={item}>
              <Card glass className="flex items-center justify-between py-4 px-8 border-border-strong bg-surface-deep/60 hover:bg-surface-hover/60 transition-colors relative overflow-hidden group border-l-4 border-l-[#FF8700]">
                  <div className="w-[60px] font-display text-white text-2xl font-black flex items-center gap-2 opacity-60">
                    4 <ChevronDown className="w-4 h-4 text-trgt-crimson" />
                  </div>
                  <div className="flex-1 min-w-[120px] flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-surface-hover border border-border-strong flex items-center justify-center font-display font-bold text-white uppercase text-xs">LN</div>
                    <div className="flex flex-col">
                        <span className="font-display font-black text-white text-xl uppercase tracking-tight group-hover:text-[#FF8700] transition-colors">Lando Norris</span>
                        <span className="text-[10px] text-text-secondary uppercase tracking-widest mt-0.5">McLaren</span>
                    </div>
                  </div>
                  <div className="w-[120px] hidden md:flex items-center justify-center gap-1 opacity-60">
                    <span className="w-6 h-6 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">4</span>
                    <span className="w-6 h-6 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    <span className="w-6 h-6 rounded border border-border-strong text-trgt-crimson flex items-center justify-center text-[10px] font-bold">DNF</span>
                  </div>
                  <div className="w-[80px] text-right font-mono text-2xl font-black text-white tracking-tighter opacity-80">
                    27
                  </div>
              </Card>
            </motion.div>

            <motion.div variants={item} className="mt-6 flex justify-center">
              <button className="px-8 py-3 rounded-full border border-border-strong bg-black/40 text-xs font-bold text-white uppercase tracking-widest hover:border-trgt-crimson hover:bg-trgt-crimson/10 hover:text-trgt-crimson transition-all duration-300">
                Load Full Grid
              </button>
            </motion.div>
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
            {/* Constructor P1 */}
            <motion.div variants={item}>
              <TiltCard intensity={8} glass className="border-t-[#EE3F2C] border-t-[4px] shadow-[0_15px_50px_rgba(238,63,44,0.2)] bg-gradient-to-r from-surface-deep/90 to-[#EE3F2C]/10">
                  <div className="flex items-center justify-between py-8 px-10 relative overflow-hidden group">
                     <div className="absolute top-0 bottom-0 left-0 w-[500px] bg-gradient-to-r from-[#EE3F2C]/10 to-transparent pointer-events-none" />
                     <div className="w-[80px] font-display text-white text-5xl font-black flex items-center gap-3 drop-shadow-md">
                       1 <ChevronUp className="w-6 h-6 text-f1-green" />
                     </div>
                     <div className="flex-1 min-w-[120px] flex items-center gap-6 relative z-10 pl-4 border-l border-white/10">
                        <div className="flex flex-col">
                           <span className="font-display font-black text-white text-4xl uppercase tracking-tighter drop-shadow-lg text-[#EE3F2C]">Ferrari</span>
                           <span className="text-xs text-text-secondary font-bold uppercase tracking-widest mt-2">Leclerc, Sainz</span>
                        </div>
                     </div>
                     <div className="w-[120px] hidden md:flex items-center justify-center gap-2">
                        <span className="w-8 h-8 rounded bg-surface-hover border border-border-strong text-white flex items-center justify-center text-xs font-bold">33</span>
                        <span className="w-8 h-8 rounded bg-surface-hover border border-border-strong text-white flex items-center justify-center text-xs font-bold">30</span>
                        <span className="w-8 h-8 rounded bg-surface-hover border border-border-strong text-white flex items-center justify-center text-xs font-bold">40</span>
                     </div>
                     <div className="w-[100px] text-right font-display text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        103
                     </div>
                  </div>
              </TiltCard>
            </motion.div>

            {/* Constructor P2 */}
            <motion.div variants={item}>
              <Card glass className="flex items-center justify-between py-6 px-10 border-border-strong bg-gradient-to-r from-surface-deep/80 to-blue-900/10 hover:bg-surface-hover/60 transition-all duration-300 relative overflow-hidden group border-l-4 border-l-blue-600">
                  <div className="w-[80px] font-display text-white text-4xl font-black flex items-center gap-3 opacity-80">
                    2 <ChevronDown className="w-5 h-5 text-trgt-crimson" />
                  </div>
                  <div className="flex-1 min-w-[120px] flex items-center gap-6 relative z-10 pl-4 border-l border-white/5">
                    <div className="flex flex-col">
                        <span className="font-display font-black text-white text-3xl uppercase tracking-tighter group-hover:text-blue-500 transition-colors">Red Bull Racing</span>
                        <span className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">Verstappen, Perez</span>
                    </div>
                  </div>
                  <div className="w-[120px] hidden md:flex items-center justify-center gap-1.5 opacity-80">
                    <span className="w-7 h-7 rounded bg-surface-hover border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">43</span>
                    <span className="w-7 h-7 rounded bg-surface-hover border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">31</span>
                    <span className="w-7 h-7 rounded bg-surface-hover border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">20</span>
                  </div>
                  <div className="w-[100px] text-right font-mono text-4xl font-black text-white tracking-tighter opacity-90">
                    94
                  </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
