"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Globe, Crosshair } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
      {/* Top Header */}
      <section className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="flex items-center gap-4 font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none mb-2">
            GLOBAL LEADERBOARD <Globe className="w-8 h-8 text-trgt-crimson" />
          </h1>
          <p className="text-text-secondary text-sm uppercase tracking-widest">
            Measure your accuracy against the global grid.
          </p>
        </div>
        
        {/* User Quick Rank */}
        <Card className="px-6 py-4 flex items-center gap-6 bg-border-strong/50 border-border-strong/50">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-text-muted tracking-widest font-bold mb-1">Your Rank</span>
            <div className="font-mono text-2xl font-bold text-f1-yellow tracking-tighter">
              #4,281
            </div>
          </div>
          <div className="w-12 h-12 rounded bg-surface-hover border border-border-strong flex items-center justify-center text-text-muted">
             <Crosshair className="w-5 h-5 focus:text-white transition-colors" />
          </div>
        </Card>
      </section>

      {/* Main Grid: Podium Sidebar + Table */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Global Podium (Left 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           {/* Top 3 Visual Podium */}
           <Card glass className="p-8 bg-black/40 flex flex-col items-center justify-end min-h-[400px] relative border-border-strong overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-trgt-crimson/5 to-transparent pointer-events-none" />
              
              <div className="flex items-end justify-center w-full gap-2 mt-auto relative z-10">
                 {/* P2 */}
                 <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 rounded-full border border-border-strong bg-surface-deep flex items-center justify-center font-display font-bold text-white mb-3">JT</div>
                    <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1 text-center w-full truncate px-2">JamesT</span>
                    <span className="font-mono text-white text-sm font-bold mb-4">412 PT</span>
                    <div className="w-full h-32 bg-surface-deep border border-border-strong rounded-t-lg flex justify-center pt-2">
                       <span className="font-display font-black text-3xl text-white/20">2</span>
                    </div>
                 </div>

                 {/* P1 */}
                 <div className="flex flex-col items-center flex-1 z-10 -mx-2">
                    <div className="w-16 h-16 rounded-full border-2 border-trgt-crimson bg-surface-deep flex items-center justify-center font-display font-bold text-white mb-3 shadow-[0_0_20px_rgba(238,63,44,0.3)]">AF</div>
                    <span className="text-[10px] uppercase tracking-widest text-trgt-crimson font-bold mb-1 text-center w-full truncate px-2">Alex Fan</span>
                    <span className="font-mono text-white text-base font-bold mb-4">489 PT</span>
                    <div className="w-full h-40 bg-trgt-crimson/10 border border-trgt-crimson/30 rounded-t-lg flex justify-center pt-2 relative overflow-hidden">
                       <div className="absolute inset-0 carbon-texture opacity-20" />
                       <span className="font-display font-black text-5xl text-trgt-crimson/30 relative z-10">1</span>
                    </div>
                 </div>

                 {/* P3 */}
                 <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 rounded-full border border-border-strong bg-surface-deep flex items-center justify-center font-display font-bold text-white mb-3">RS</div>
                    <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1 text-center w-full truncate px-2">Riccardo</span>
                    <span className="font-mono text-white text-sm font-bold mb-4">395 PT</span>
                    <div className="w-full h-24 bg-surface-deep border border-border-strong rounded-t-lg flex justify-center pt-2">
                       <span className="font-display font-black text-3xl text-white/20">3</span>
                    </div>
                 </div>
              </div>
           </Card>
        </div>

        {/* Full Table (Right 8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <Card glass className="flex flex-col bg-black/60 border-border-strong overflow-hidden rounded-xl w-full">
               
            {/* Table Header */}
            <div className="flex items-center justify-between py-4 px-6 border-b border-border-subtle/50 text-xs uppercase font-bold text-text-muted tracking-widest bg-surface-deep">
               <div className="w-[60px]">Rank</div>
               <div className="flex-1 min-w-[120px]">Predictor</div>
               <div className="w-[100px] text-right hidden lg:block">Accuracy</div>
               <div className="w-[80px] text-right text-trgt-crimson">Points</div>
            </div>

            {/* List Array */}
            {[
               { rank: 4, name: "MaxFan_99", acc: "84%", pts: 382, pro: false },
               { rank: 5, name: "V10_Engine", acc: "81%", pts: 375, pro: true },
               { rank: 6, name: "Downforce", acc: "79%", pts: 360, pro: false },
               { rank: 7, name: "Sector_Purple", acc: "78%", pts: 351, pro: true },
               { rank: 8, name: "BrakeMagic", acc: "75%", pts: 340, pro: false },
               { rank: 9, name: "BoxBoxBox", acc: "74%", pts: 335, pro: false },
               { rank: 10, name: "Undercut_King", acc: "71%", pts: 322, pro: true }
            ].map((p, i) => (
               <div key={i} className="flex items-center justify-between py-4 px-6 border-b outline outline-transparent hover:outline-trgt-crimson/50 border-border-subtle/30 bg-surface-hover/10 hover:bg-surface-hover/40 transition-all cursor-pointer group">
                  <div className="w-[60px] font-mono text-text-muted group-hover:text-white transition-colors">{p.rank}</div>
                  <div className="flex-1 flex items-center gap-3">
                     <span className="font-display font-bold text-white text-lg tracking-tight group-hover:text-trgt-crimson transition-colors">{p.name}</span>
                     {p.pro && <span className="px-1.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-widest bg-trgt-crimson/20 text-trgt-crimson border border-trgt-crimson/30 mt-0.5">PRO</span>}
                  </div>
                  <div className="w-[100px] text-right font-mono text-sm text-text-secondary hidden lg:block">{p.acc}</div>
                  <div className="w-[80px] text-right font-mono text-xl font-bold text-white">{p.pts}</div>
               </div>
            ))}

            {/* Pagination / Load More */}
            <div className="py-6 flex justify-center items-center gap-4 bg-surface-deep/20">
               <button className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors">Prev</button>
               <span className="font-mono text-sm text-text-secondary">Page 1 of 420</span>
               <button className="text-xs font-bold uppercase tracking-widest text-white hover:text-trgt-crimson transition-colors">Next</button>
            </div>

          </Card>
        </div>

      </div>
    </div>
  );
}
