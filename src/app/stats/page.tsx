"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Map, Gauge, ArrowRight } from "lucide-react";

export default function StatsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
      {/* Top Banner */}
      <section className="w-full mb-10">
        <h1 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none mb-2">
          Circuit Data
        </h1>
        <p className="text-text-secondary text-sm uppercase tracking-widest max-w-xl">
          Track histories, corner analytics, telemetry benchmarks, and sector dominanace logs across the official FIA calendar.
        </p>
      </section>

      {/* Main Grid: Track List */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Track Card 1 */}
        <Card glass className="flex flex-col bg-black/40 border-border-strong overflow-hidden group cursor-pointer hover:border-trgt-crimson transition-colors relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-trgt-crimson/5 rounded-full blur-2xl group-hover:bg-trgt-crimson/20 transition-colors pointer-events-none" />
           <div className="p-6 border-b border-border-subtle/50 relative z-10 flex justify-between items-start">
              <div>
                 <span className="text-[10px] uppercase font-bold tracking-widest text-trgt-crimson block mb-1">Round 01</span>
                 <h2 className="font-display font-black text-white text-2xl uppercase tracking-tight leading-none mb-1 group-hover:text-trgt-crimson transition-colors">Bahrain</h2>
                 <span className="text-xs uppercase text-text-muted tracking-widest">Sakhir</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-border-strong flex items-center justify-center bg-surface-deep text-white group-hover:bg-trgt-crimson group-hover:border-trgt-crimson transition-colors">
                 <ArrowRight className="w-4 h-4" />
              </div>
           </div>
           
           {/* Mock Data Block */}
           <div className="p-6 flex flex-col gap-4 relative z-10">
              <div className="flex justify-between items-end border-b border-border-subtle/30 pb-2">
                 <span className="text-xs uppercase text-text-muted font-bold tracking-widest">Length</span>
                 <span className="font-mono text-white">5.412 <span className="text-[10px] text-text-secondary">KM</span></span>
              </div>
              <div className="flex justify-between items-end border-b border-border-subtle/30 pb-2">
                 <span className="text-xs uppercase text-text-muted font-bold tracking-widest">Laps</span>
                 <span className="font-mono text-white">57</span>
              </div>
              <div className="flex justify-between items-end pb-2">
                 <span className="text-xs uppercase text-text-muted font-bold tracking-widest">Lap Record</span>
                 <div className="text-right">
                    <span className="font-mono text-white block">1:31.447</span>
                    <span className="text-[10px] text-text-secondary uppercase">De la Rosa, '05</span>
                 </div>
              </div>
           </div>

           {/* Track Map Placeholder Overlay */}
           <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 blur-[1px] group-hover:opacity-20 transition-opacity">
              <Map className="w-48 h-48 transform -rotate-12" />
           </div>
        </Card>

        {/* Track Card 2 */}
        <Card glass className="flex flex-col bg-black/40 border-border-strong overflow-hidden group cursor-pointer hover:border-trgt-crimson transition-colors relative">
           <div className="p-6 border-b border-border-subtle/50 relative z-10 flex justify-between items-start">
              <div>
                 <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted block mb-1">Round 02</span>
                 <h2 className="font-display font-black text-white text-2xl uppercase tracking-tight leading-none mb-1 group-hover:text-trgt-crimson transition-colors">Saudi Arabia</h2>
                 <span className="text-xs uppercase text-text-muted tracking-widest">Jeddah</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-border-strong flex items-center justify-center bg-surface-deep text-white group-hover:bg-trgt-crimson group-hover:border-trgt-crimson transition-colors">
                 <ArrowRight className="w-4 h-4" />
              </div>
           </div>
           
           <div className="p-6 flex flex-col gap-4 relative z-10">
              <div className="flex justify-between items-end border-b border-border-subtle/30 pb-2">
                 <span className="text-xs uppercase text-text-muted font-bold tracking-widest">Length</span>
                 <span className="font-mono text-white">6.174 <span className="text-[10px] text-text-secondary">KM</span></span>
              </div>
              <div className="flex justify-between items-end border-b border-border-subtle/30 pb-2">
                 <span className="text-xs uppercase text-text-muted font-bold tracking-widest">Laps</span>
                 <span className="font-mono text-white">50</span>
              </div>
              <div className="flex justify-between items-end pb-2">
                 <span className="text-xs uppercase text-text-muted font-bold tracking-widest">Top Speed</span>
                 <div className="text-right flex items-center gap-2">
                    <Gauge className="w-3 h-3 text-trgt-crimson" />
                    <span className="font-mono text-white">338 <span className="text-[10px] text-text-secondary">KM/H</span></span>
                 </div>
              </div>
           </div>
           <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none blur-[1px]">
              <Map className="w-48 h-48 transform rotate-12" />
           </div>
        </Card>

        {/* Track Card 3 */}
        <Card glass className="flex flex-col bg-black/40 border-border-strong overflow-hidden group cursor-pointer hover:border-trgt-crimson transition-colors relative">
           <div className="p-6 border-b border-border-subtle/50 relative z-10 flex justify-between items-start">
              <div>
                 <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted block mb-1">Round 03</span>
                 <h2 className="font-display font-black text-white text-2xl uppercase tracking-tight leading-none mb-1 group-hover:text-trgt-crimson transition-colors">Australia</h2>
                 <span className="text-xs uppercase text-text-muted tracking-widest">Melbourne</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-border-strong flex items-center justify-center bg-surface-deep text-white group-hover:bg-trgt-crimson group-hover:border-trgt-crimson transition-colors">
                 <ArrowRight className="w-4 h-4" />
              </div>
           </div>
           
           <div className="p-6 flex flex-col gap-4 relative z-10">
              <div className="flex justify-between items-end border-b border-border-subtle/30 pb-2">
                 <span className="text-xs uppercase text-text-muted font-bold tracking-widest">Length</span>
                 <span className="font-mono text-white">5.278 <span className="text-[10px] text-text-secondary">KM</span></span>
              </div>
              <div className="flex justify-between items-end border-b border-border-subtle/30 pb-2">
                 <span className="text-xs uppercase text-text-muted font-bold tracking-widest">Laps</span>
                 <span className="font-mono text-white">58</span>
              </div>
              <div className="flex justify-between items-end pb-2">
                 <span className="text-xs uppercase text-text-muted font-bold tracking-widest">Lap Record</span>
                 <div className="text-right flex flex-col">
                    <span className="font-mono text-white">1:19.813</span>
                    <span className="text-[10px] text-text-secondary uppercase mt-0.5">Leclerc, '24</span>
                 </div>
              </div>
           </div>
           <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none blur-[1px]">
              <Map className="w-48 h-48 transform -rotate-45" />
           </div>
        </Card>

      </div>
    </div>
  );
}
