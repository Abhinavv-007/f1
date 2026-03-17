"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Trophy, Shield, ChevronUp, ChevronDown, Minus } from "lucide-react";

type StandingTab = "drivers" | "constructors";

export default function StandingsPage() {
  const [activeTab, setActiveTab] = useState<StandingTab>("drivers");

  return (
    <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
      {/* Top Banner and Tabs */}
      <section className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none mb-2">
            World Championship
          </h1>
          <p className="text-text-secondary text-sm uppercase tracking-widest">
            2025 Season Standings // After Round 3
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-surface-deep/80 backdrop-blur rounded-lg border border-border-strong w-full md:w-auto">
           <button
             onClick={() => setActiveTab("drivers")}
             className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded uppercase text-xs font-bold tracking-widest transition-all ${
               activeTab === "drivers" 
                 ? "bg-white text-black shadow-lg" 
                 : "text-text-secondary hover:text-white hover:bg-surface-hover"
             }`}
           >
             <Trophy className="w-4 h-4" />
             Drivers
           </button>
           <button
             onClick={() => setActiveTab("constructors")}
             className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded uppercase text-xs font-bold tracking-widest transition-all ${
               activeTab === "constructors" 
                 ? "bg-white text-black shadow-lg" 
                 : "text-text-secondary hover:text-white hover:bg-surface-hover"
             }`}
           >
             <Shield className="w-4 h-4" />
             Constructors
           </button>
        </div>
      </section>

      {/* Main Table Content */}
      <Card glass className="flex flex-col bg-black/60 border-border-strong overflow-hidden rounded-xl">
         
         {/* Table Header */}
         <div className="flex items-center justify-between py-4 px-6 border-b border-border-subtle/50 text-xs uppercase font-bold text-text-muted tracking-widest bg-surface-deep border-t-2 border-t-trgt-crimson">
            <div className="w-[60px]">POS</div>
            <div className="flex-1 min-w-[120px]">
              {activeTab === "drivers" ? "Driver" : "Constructor"}
            </div>
            <div className="w-[120px] hidden md:block">Form</div>
            <div className="w-[80px] text-right">Points</div>
         </div>

         <AnimatePresence mode="wait">
            {activeTab === "drivers" ? (
               <motion.div
                 key="drivers"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
                 className="flex flex-col"
               >
                  {/* Driver Row 1 */}
                  <div className="flex items-center justify-between py-5 px-6 border-b border-border-subtle/30 bg-surface-hover/20 hover:bg-surface-hover/50 transition-colors group relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                     <div className="w-[60px] font-mono text-white text-xl font-bold flex items-center gap-3">
                       1 <Minus className="w-4 h-4 text-text-muted" />
                     </div>
                     <div className="flex-1 min-w-[120px] flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-hover border border-border-strong flex items-center justify-center font-bold text-white uppercase text-xs">MV</div>
                        <div className="flex flex-col">
                           <span className="font-display font-black text-white text-xl uppercase tracking-tight group-hover:text-blue-400 transition-colors">Max Verstappen</span>
                           <span className="text-[10px] text-text-secondary uppercase tracking-widest">Red Bull Racing</span>
                        </div>
                     </div>
                     <div className="w-[120px] hidden md:flex items-center gap-1">
                        <span className="w-6 h-6 rounded bg-f1-green text-black flex items-center justify-center text-[10px] font-bold">1</span>
                        <span className="w-6 h-6 rounded bg-f1-green text-black flex items-center justify-center text-[10px] font-bold">1</span>
                        <span className="w-6 h-6 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">2</span>
                     </div>
                     <div className="w-[80px] text-right font-mono text-2xl font-black text-white tracking-tighter">
                        68
                     </div>
                  </div>

                  {/* Driver Row 2 */}
                  <div className="flex items-center justify-between py-5 px-6 border-b border-border-subtle/30 bg-surface-hover/10 hover:bg-surface-hover/50 transition-colors group relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-trgt-crimson" />
                     <div className="w-[60px] font-mono text-white text-xl font-bold flex items-center gap-3">
                       2 <ChevronUp className="w-4 h-4 text-f1-green" />
                     </div>
                     <div className="flex-1 min-w-[120px] flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-hover border border-border-strong flex items-center justify-center font-bold text-white uppercase text-xs">CL</div>
                        <div className="flex flex-col">
                           <span className="font-display font-black text-white text-xl uppercase tracking-tight group-hover:text-red-400 transition-colors">Charles Leclerc</span>
                           <span className="text-[10px] text-text-secondary uppercase tracking-widest">Ferrari</span>
                        </div>
                     </div>
                     <div className="w-[120px] hidden md:flex items-center gap-1">
                        <span className="w-6 h-6 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">3</span>
                        <span className="w-6 h-6 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">2</span>
                        <span className="w-6 h-6 rounded bg-f1-green text-black flex items-center justify-center text-[10px] font-bold">1</span>
                     </div>
                     <div className="w-[80px] text-right font-mono text-2xl font-black text-white tracking-tighter">
                        56
                     </div>
                  </div>

                  {/* Driver Row 3 */}
                  <div className="flex items-center justify-between py-5 px-6 border-b border-border-subtle/30 bg-surface-hover/5 hover:bg-surface-hover/50 transition-colors group relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#EE3F2C]" />
                     <div className="w-[60px] font-mono text-white text-xl font-bold flex items-center gap-3">
                       3 <ChevronUp className="w-4 h-4 text-f1-green" />
                     </div>
                     <div className="flex-1 min-w-[120px] flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-hover border border-border-strong flex items-center justify-center font-bold text-white uppercase text-xs">CS</div>
                        <div className="flex flex-col">
                           <span className="font-display font-black text-white text-xl uppercase tracking-tight group-hover:text-red-400 transition-colors">Carlos Sainz</span>
                           <span className="text-[10px] text-text-secondary uppercase tracking-widest">Ferrari</span>
                        </div>
                     </div>
                     <div className="w-[120px] hidden md:flex items-center gap-1">
                        <span className="w-6 h-6 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">2</span>
                        <span className="w-6 h-6 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">4</span>
                        <span className="w-6 h-6 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">3</span>
                     </div>
                     <div className="w-[80px] text-right font-mono text-2xl font-black text-white tracking-tighter">
                        45
                     </div>
                  </div>

                  {/* Driver Row 4 */}
                  <div className="flex items-center justify-between py-5 px-6 border-b border-border-subtle/30 bg-surface-hover/5 hover:bg-surface-hover/50 transition-colors group relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF8700]" />
                     <div className="w-[60px] font-mono text-white text-xl font-bold flex items-center gap-3">
                       4 <ChevronDown className="w-4 h-4 text-trgt-crimson" />
                     </div>
                     <div className="flex-1 min-w-[120px] flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-hover border border-border-strong flex items-center justify-center font-bold text-white uppercase text-xs">LN</div>
                        <div className="flex flex-col">
                           <span className="font-display font-black text-white text-xl uppercase tracking-tight group-hover:text-orange-400 transition-colors">Lando Norris</span>
                           <span className="text-[10px] text-text-secondary uppercase tracking-widest">McLaren</span>
                        </div>
                     </div>
                     <div className="w-[120px] hidden md:flex items-center gap-1">
                        <span className="w-6 h-6 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">4</span>
                        <span className="w-6 h-6 rounded bg-surface-deep border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">3</span>
                        <span className="w-6 h-6 rounded border border-border-strong text-white flex items-center justify-center text-[10px] font-bold text-trgt-crimson">DNF</span>
                     </div>
                     <div className="w-[80px] text-right font-mono text-2xl font-black text-white tracking-tighter">
                        27
                     </div>
                  </div>

                  {/* View Full Standings */}
                  <div className="py-6 px-6 text-center">
                     <button className="text-xs uppercase tracking-widest text-text-muted hover:text-white transition-colors font-bold">Show Full Grid</button>
                  </div>
               </motion.div>
            ) : (
               <motion.div
                 key="constructors"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
                 className="flex flex-col"
               >
                  {/* Constructor Row 1 */}
                  <div className="flex items-center justify-between py-6 px-6 border-b border-border-subtle/30 bg-surface-hover/20 hover:bg-surface-hover/50 transition-colors group relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-2 bg-trgt-crimson" />
                     <div className="w-[60px] font-mono text-white text-2xl font-bold flex items-center gap-3">
                       1 <ChevronUp className="w-4 h-4 text-f1-green" />
                     </div>
                     <div className="flex-1 min-w-[120px] flex items-center gap-4 pl-2">
                        <div className="flex flex-col">
                           <span className="font-display font-black text-white text-2xl uppercase tracking-tight group-hover:text-red-400 transition-colors">Ferrari</span>
                           <span className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">Leclerc, Sainz</span>
                        </div>
                     </div>
                     <div className="w-[120px] hidden md:flex items-center gap-1">
                        <span className="w-6 h-6 rounded bg-surface-hover border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">33</span>
                        <span className="w-6 h-6 rounded bg-surface-hover border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">30</span>
                        <span className="w-6 h-6 rounded bg-surface-hover border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">40</span>
                     </div>
                     <div className="w-[80px] text-right font-mono text-3xl font-black text-white tracking-tighter">
                        103
                     </div>
                  </div>

                  {/* Constructor Row 2 */}
                  <div className="flex items-center justify-between py-6 px-6 border-b border-border-subtle/30 bg-surface-hover/10 hover:bg-surface-hover/50 transition-colors group relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600" />
                     <div className="w-[60px] font-mono text-white text-2xl font-bold flex items-center gap-3">
                       2 <ChevronDown className="w-4 h-4 text-trgt-crimson" />
                     </div>
                     <div className="flex-1 min-w-[120px] flex items-center gap-4 pl-2">
                        <div className="flex flex-col">
                           <span className="font-display font-black text-white text-2xl uppercase tracking-tight group-hover:text-blue-400 transition-colors">Red Bull Racing</span>
                           <span className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">Verstappen, Perez</span>
                        </div>
                     </div>
                     <div className="w-[120px] hidden md:flex items-center gap-1">
                        <span className="w-6 h-6 rounded bg-surface-hover border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">43</span>
                        <span className="w-6 h-6 rounded bg-surface-hover border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">31</span>
                        <span className="w-6 h-6 rounded bg-surface-hover border border-border-strong text-white flex items-center justify-center text-[10px] font-bold">20</span>
                     </div>
                     <div className="w-[80px] text-right font-mono text-3xl font-black text-white tracking-tighter">
                        94
                     </div>
                  </div>

                  {/* View Full Standings */}
                  <div className="py-6 px-6 text-center">
                     <button className="text-xs uppercase tracking-widest text-text-muted hover:text-white transition-colors font-bold">Show Full Grid</button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </Card>
    </div>
  );
}
