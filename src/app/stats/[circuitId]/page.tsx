"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { AIInsightCard } from "@/components/ui/AIInsightCard";
import Link from "next/link";
import { ChevronRight, Map, Gauge, Flag, Activity, Clock, FileWarning } from "lucide-react";

export default function CircuitPage({ params }: { params: { circuitId: string } }) {
  // In a real app we'd fetch circuit data based on params.circuitId
  
  return (
    <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
      {/* Breadcrumb Navigation */}
      <Link href="/stats" className="text-xs text-text-secondary hover:text-white uppercase tracking-widest transition-colors font-bold flex items-center gap-2 w-fit mb-6">
         <ChevronRight className="w-3 h-3 rotate-180" /> Back to Calendar
      </Link>

      {/* Top Hero Banner */}
      <section className="w-full mb-10 relative overflow-hidden rounded-3xl group">
        <div className="absolute inset-0 bg-gradient-to-tr from-trgt-crimson/20 via-black/80 to-transparent z-10" />
        <Card glass carbon className="w-full flex justify-between items-end p-8 md:p-12 border-border-strong relative z-20 min-h-[300px] overflow-hidden">
           
           <div className="flex flex-col max-w-2xl relative z-10">
              <span className="text-trgt-crimson text-sm md:text-base uppercase tracking-widest font-bold mb-2">Sakhir // Round 01</span>
              <h1 className="font-display font-black text-5xl md:text-7xl text-white uppercase tracking-tighter leading-none mb-4 drop-shadow-xl">
                 Bahrain Grand Prix
              </h1>
              <p className="text-text-secondary text-base lg:text-lg leading-relaxed mix-blend-screen">
                 A twilight desert classic where tire degradation dictates strategy. Home of the longest straight and hardest braking zones on the calendar.
              </p>
           </div>
           
           <div className="absolute top-1/2 -translate-y-1/2 right-12 z-0 opacity-10 hidden md:block group-hover:opacity-20 transition-opacity duration-1000 group-hover:scale-105">
              <Map className="w-[400px] h-[400px] transform -rotate-12" />
           </div>

        </Card>
      </section>

      {/* Main Grid Data System */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Track Specs (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <Card glass className="p-6 bg-black/40 border-border-strong flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                 <Flag className="w-5 h-5 text-white" />
                 <h2 className="font-display text-xl text-white uppercase tracking-tight font-bold">Track Specs</h2>
              </div>

              <div className="flex justify-between items-center border-b border-border-subtle/30 pb-3">
                 <span className="text-xs uppercase text-text-muted font-bold tracking-widest">First Entry</span>
                 <span className="font-mono text-white text-lg">2004</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-border-subtle/30 pb-3">
                 <span className="text-xs uppercase text-text-muted font-bold tracking-widest">Circuit Length</span>
                 <span className="font-mono text-white text-lg">5.412 <span className="text-[10px] text-text-secondary">KM</span></span>
              </div>

              <div className="flex justify-between items-center border-b border-border-subtle/30 pb-3">
                 <span className="text-xs uppercase text-text-muted font-bold tracking-widest">Race Distance</span>
                 <span className="font-mono text-white text-lg">308.238 <span className="text-[10px] text-text-secondary">KM</span></span>
              </div>

              <div className="flex justify-between items-center pb-1">
                 <span className="text-xs uppercase text-text-muted font-bold tracking-widest">DRS Zones</span>
                 <span className="font-mono text-f1-green text-lg">3</span>
              </div>
           </Card>

           <Card glass className="p-6 bg-black/40 border-border-strong hover:border-trgt-crimson/50 transition-colors flex flex-col group h-full">
              <div className="flex items-center justify-between mb-4 flex-1">
                 <h2 className="font-display text-2xl text-white uppercase tracking-tight font-bold group-hover:text-trgt-crimson transition-colors">Historical Predictor</h2>
                 <Activity className="w-6 h-6 text-trgt-crimson opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                 Pole position translates to a win here <span className="text-white font-bold">65%</span> of the time. Average safety car probability is <span className="text-f1-yellow font-bold">40%</span>.
              </p>
              <button className="w-full btn-angled bg-surface-deep border border-border-strong text-white text-[12px] font-black uppercase tracking-[0.1em] py-4 group-hover:border-trgt-crimson transition-colors">
                 View Historical Results
              </button>
           </Card>
        </div>

        {/* Right Column: Telemetry & Records (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           
           {/* Section 1: Lap Record */}
           <Card glass className="p-8 bg-black/40 border-border-strong relative overflow-hidden hover:border-f1-purple/50 transition-colors group">
              <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-gradient-to-l from-f1-purple/10 to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                 <Clock className="w-5 h-5 text-f1-purple" />
                 <h2 className="font-display text-xl text-white uppercase tracking-tight font-bold">Official Lap Record</h2>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                 <div className="flex flex-col">
                    <span className="font-mono text-5xl md:text-6xl text-white font-black tracking-tighter drop-shadow-lg mb-2 group-hover:text-f1-purple transition-colors">
                       1:31.447
                    </span>
                    <span className="text-sm uppercase tracking-widest text-text-muted font-bold">Pedro de la Rosa (2005)</span>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] uppercase text-text-muted tracking-widest mb-1">Sector 1</span>
                       <span className="font-mono text-white text-lg font-bold">29.112</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] uppercase text-text-muted tracking-widest mb-1">Sector 2</span>
                       <span className="font-mono text-f1-purple text-lg font-bold">39.041</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-[10px] uppercase text-text-muted tracking-widest mb-1">Sector 3</span>
                       <span className="font-mono text-white text-lg font-bold">23.294</span>
                    </div>
                 </div>
              </div>
           </Card>

           {/* Section 2: AI Race Intel */}
           <AIInsightCard circuitId={params.circuitId} className="mb-0" />

           {/* Section 3: Circuit Characteristics System */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              
              {/* Downforce */}
              <Card glass className="p-6 bg-black/40 border-border-strong">
                 <div className="flex items-center justify-between mb-6">
                    <span className="text-sm uppercase text-white font-bold tracking-widest">Downforce</span>
                    <span className="font-mono font-bold text-white bg-surface-hover px-2 py-1 rounded">Medium</span>
                 </div>
                 <div className="w-full flex gap-1 h-3">
                    <div className="flex-1 rounded-l-full bg-trgt-crimson" />
                    <div className="flex-1 bg-trgt-crimson" />
                    <div className="flex-1 bg-surface-deep blur-[1px]" />
                    <div className="flex-1 bg-surface-deep blur-[1px]" />
                    <div className="flex-1 rounded-r-full bg-surface-deep blur-[1px]" />
                 </div>
              </Card>

              {/* Tire Wear */}
              <Card glass className="p-6 bg-black/40 border-border-strong">
                 <div className="flex items-center justify-between mb-6">
                    <span className="text-sm uppercase text-white font-bold tracking-widest">Tire Degradation</span>
                    <span className="font-mono font-bold text-white bg-surface-hover px-2 py-1 rounded text-trgt-crimson">Very High</span>
                 </div>
                 <div className="w-full flex gap-1 h-3">
                    <div className="flex-1 rounded-l-full bg-[#EE3F2C]" />
                    <div className="flex-1 bg-[#EE3F2C]" />
                    <div className="flex-1 bg-[#EE3F2C]" />
                    <div className="flex-1 bg-[#EE3F2C]" />
                    <div className="flex-1 rounded-r-full bg-[#EE3F2C]" />
                 </div>
              </Card>

              {/* Braking */}
              <Card glass className="p-6 bg-black/40 border-border-strong">
                 <div className="flex items-center justify-between mb-6">
                    <span className="text-sm uppercase text-white font-bold tracking-widest">Braking Severity</span>
                    <span className="font-mono font-bold text-white bg-surface-hover px-2 py-1 rounded">High</span>
                 </div>
                 <div className="w-full flex gap-1 h-3">
                    <div className="flex-1 rounded-l-full bg-[#EE3F2C]" />
                    <div className="flex-1 bg-[#EE3F2C]" />
                    <div className="flex-1 bg-[#EE3F2C]" />
                    <div className="flex-1 bg-[#EE3F2C]" />
                    <div className="flex-1 rounded-r-full bg-surface-deep blur-[1px]" />
                 </div>
              </Card>
              
              {/* Traction */}
              <Card glass className="p-6 bg-black/40 border-border-strong">
                 <div className="flex items-center justify-between mb-6">
                    <span className="text-sm uppercase text-white font-bold tracking-widest">Traction</span>
                    <span className="font-mono font-bold text-white bg-surface-hover px-2 py-1 rounded">High</span>
                 </div>
                 <div className="w-full flex gap-1 h-3">
                    <div className="flex-1 rounded-l-full bg-trgt-crimson" />
                    <div className="flex-1 bg-trgt-crimson" />
                    <div className="flex-1 bg-trgt-crimson" />
                    <div className="flex-1 bg-surface-deep blur-[1px]" />
                    <div className="flex-1 rounded-r-full bg-surface-deep blur-[1px]" />
                 </div>
              </Card>

           </div>

        </div>

      </div>
    </div>
  );
}
