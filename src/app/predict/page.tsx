"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Clock, Lock, Target, TrendingUp, AlertTriangle } from "lucide-react";

export default function PredictPage() {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
      {/* Top Header / Countdown */}
      <section className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none mb-2">
            RACE PREDICTIONS
          </h1>
          <p className="text-text-secondary text-sm uppercase tracking-widest">
            Round 1 // Saudi Arabian Grand Prix
          </p>
        </div>

        <Card className="px-6 py-4 flex items-center gap-6 bg-trgt-crimson/10 border-trgt-crimson/30">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-trgt-crimson tracking-widest font-bold mb-1">Lockout Timer</span>
            <div className="font-mono text-2xl font-bold text-white tracking-tighter">
              05:01:23:51
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-trgt-crimson/20 flex items-center justify-center text-trgt-crimson">
             {isLocked ? <Lock className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </div>
        </Card>
      </section>

      {/* Main Grid: Form + Sidebar */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Prediction Form (Left 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Section 1: The Podium */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-white text-black font-mono text-xs font-bold">1</span>
              <h2 className="font-display text-xl text-white uppercase tracking-tight font-bold">The Podium</h2>
            </div>
            
            <Card glass className="p-6 bg-black/40 grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
               {/* 2nd Place */}
               <div className="flex flex-col gap-4 pt-12 sm:pt-8 order-2 sm:order-1">
                 <div className="text-center">
                   <span className="font-display text-5xl font-black text-white/10 block mb-2 leading-none">P2</span>
                   <span className="text-[10px] uppercase tracking-widest text-text-muted">+5 PTS</span>
                 </div>
                 <div className="h-16 rounded-lg border border-border-strong bg-surface-deep flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-white/30 transition-colors">
                   <div className="absolute inset-0 carbon-texture opacity-30" />
                   <span className="relative z-10 text-text-muted font-mono uppercase text-sm group-hover:text-white transition-colors">Select Driver</span>
                 </div>
               </div>

               {/* 1st Place (Winner) */}
               <div className="flex flex-col gap-4 order-1 sm:order-2 relative z-10 -mt-4 sm:-mt-8">
                 <div className="text-center">
                   <span className="font-display text-6xl font-black text-trgt-crimson/20 block mb-2 leading-none drop-shadow-lg">P1</span>
                   <span className="text-[10px] uppercase tracking-widest text-trgt-crimson font-bold">+10 PTS</span>
                 </div>
                 <div className="h-20 rounded-lg border-2 border-trgt-crimson/50 bg-surface-deep flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-trgt-crimson transition-colors shadow-[0_0_30px_rgba(238,63,44,0.15)] hover:shadow-[0_0_40px_rgba(238,63,44,0.3)]">
                   <div className="absolute inset-0 carbon-texture opacity-40" />
                   <span className="relative z-10 text-trgt-crimson font-mono uppercase text-sm font-bold tracking-widest">Select Winner</span>
                 </div>
               </div>

               {/* 3rd Place */}
               <div className="flex flex-col gap-4 pt-12 sm:pt-16 order-3 sm:order-3">
                 <div className="text-center">
                   <span className="font-display text-4xl font-black text-white/10 block mb-2 leading-none">P3</span>
                   <span className="text-[10px] uppercase tracking-widest text-text-muted">+5 PTS</span>
                 </div>
                 <div className="h-14 rounded-lg border border-border-strong bg-surface-deep flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-white/30 transition-colors">
                   <div className="absolute inset-0 carbon-texture opacity-30" />
                   <span className="relative z-10 text-text-muted font-mono uppercase text-sm group-hover:text-white transition-colors">Select Driver</span>
                 </div>
               </div>
            </Card>
          </section>

          {/* Section 2: Race Details */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-white text-black font-mono text-xs font-bold">2</span>
              <h2 className="font-display text-xl text-white uppercase tracking-tight font-bold">Race Incidents & Pace</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Fastest Lap */}
              <Card glass className="p-6 bg-black/40 hover:border-f1-purple/50 transition-colors cursor-pointer group">
                 <div className="flex justify-between items-start mb-6">
                   <div className="flex flex-col">
                     <span className="text-white font-bold uppercase tracking-tight">Fastest Lap</span>
                     <span className="text-f1-purple text-[10px] uppercase font-bold tracking-wider mt-1">+3 PTS</span>
                   </div>
                   <Target className="w-5 h-5 text-f1-purple opacity-50 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <div className="h-12 rounded bg-surface-deep border border-border-subtle flex items-center px-4">
                   <span className="text-text-muted text-sm">Select Driver</span>
                 </div>
              </Card>

              {/* First Retirement */}
              <Card glass className="p-6 bg-black/40 hover:border-trgt-crimson/50 transition-colors cursor-pointer group">
                 <div className="flex justify-between items-start mb-6">
                   <div className="flex flex-col">
                     <span className="text-white font-bold uppercase tracking-tight">First Retirement</span>
                     <span className="text-trgt-crimson text-[10px] uppercase font-bold tracking-wider mt-1">+5 PTS</span>
                   </div>
                   <AlertTriangle className="w-5 h-5 text-trgt-crimson opacity-50 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <div className="h-12 rounded bg-surface-deep border border-border-subtle flex items-center px-4">
                   <span className="text-text-muted text-sm">Select Driver or 'None'</span>
                 </div>
              </Card>

              {/* Safety Car */}
              <Card glass className="p-6 bg-black/40 cursor-pointer group hover:border-[#FFD700]/50 transition-colors">
                 <div className="flex justify-between items-start mb-6">
                   <div className="flex flex-col">
                     <span className="text-white font-bold uppercase tracking-tight">Safety Car?</span>
                     <span className="text-[#FFD700] text-[10px] uppercase font-bold tracking-wider mt-1">+2 PTS</span>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button className="flex-1 h-12 rounded border border-border-subtle bg-surface-deep hover:bg-surface-hover text-text-secondary uppercase text-sm font-bold tracking-widest transition-colors">Yes</button>
                   <button className="flex-1 h-12 rounded border border-border-subtle bg-surface-deep hover:bg-surface-hover text-text-secondary uppercase text-sm font-bold tracking-widest transition-colors">No</button>
                 </div>
              </Card>

              {/* Winning Margin */}
              <Card glass className="p-6 bg-black/40 hover:border-white/50 transition-colors cursor-pointer group">
                 <div className="flex justify-between items-start mb-6">
                   <div className="flex flex-col">
                     <span className="text-white font-bold uppercase tracking-tight">Winning Margin</span>
                     <span className="text-text-secondary text-[10px] uppercase font-bold tracking-wider mt-1">+3 PTS</span>
                   </div>
                 </div>
                 <div className="h-12 rounded bg-surface-deep border border-border-subtle flex items-center px-4">
                   <span className="text-text-muted text-sm">Select Time Gap</span>
                 </div>
              </Card>
            </div>
          </section>

          {/* Submit Action */}
          <div className="mt-8 pt-8 border-t border-border-subtle/50 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex flex-col md:w-1/2">
                <span className="text-white font-bold uppercase tracking-tight mb-2">Total Potential Points: <span className="text-trgt-crimson">38 PTS</span></span>
                <p className="text-xs text-text-muted leading-relaxed">Ensure your predictions are final. Once locked, they cannot be changed after the lockout timer expires (start of qualifying).</p>
             </div>
             <button
               disabled={isLocked}
               className="w-full md:w-auto btn-angled bg-trgt-crimson text-white text-[14px] font-black uppercase tracking-[0.1em] px-12 py-5 hover:bg-trgt-crimson-deep transition-all duration-300 shadow-[0_0_30px_rgba(238,63,44,0.3)] hover:shadow-[0_0_50px_rgba(238,63,44,0.6)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
             >
               {isLocked ? "Predictions Locked" : "Lock All Predictions"}
             </button>
          </div>

        </div>

        {/* Right Sidebar Global Trends (Right 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card glass className="p-6 bg-black/40 h-full flex flex-col">
             <div className="flex items-center gap-2 mb-8 pb-4 border-b border-border-subtle">
               <TrendingUp className="w-5 h-5 text-white" />
               <span className="text-sm font-bold uppercase tracking-widest text-white">Grid Consensus</span>
             </div>
             
             <div className="flex-1 flex flex-col justify-center gap-8 opacity-50 text-center py-12">
                <TrendingUp className="w-12 h-12 text-border-strong mx-auto mb-2" />
                <h4 className="text-white font-bold font-display uppercase tracking-tight">Data Accumulating</h4>
                <p className="text-sm text-text-muted max-w-[250px] mx-auto">
                  Community prediction trends will reveal themselves once enough players have locked their predictions.
                </p>
             </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
