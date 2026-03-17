"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { TiltCard } from "@/components/ui/TiltCard";
import { Globe, Crosshair, Award } from "lucide-react";

export default function LeaderboardPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const floatAnimation = {
    y: [-5, 5],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };

  const podiumAnimation = {
    hidden: { height: 0, opacity: 0 },
    show: (height: number) => ({
      height,
      opacity: 1,
      transition: { duration: 1, type: "spring", bounce: 0.3 }
    })
  };

  return (
    <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto overflow-hidden">
      {/* Top Header */}
      <section className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="flex items-center gap-4 font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            GLOBAL LEADERBOARD <Globe className="w-8 h-8 text-trgt-crimson animate-[pulse_4s_ease-in-out_infinite]" />
          </h1>
          <p className="text-text-secondary text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-f1-green animate-pulse" />
            Live Global Grid Rankings
          </p>
        </motion.div>
        
        {/* User Quick Rank */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TiltCard intensity={10} className="w-auto">
            <Card className="px-8 py-5 flex items-center gap-8 bg-surface-deep/80 border-border-strong shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-trgt-crimson/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex flex-col relative z-10">
                <span className="text-xs uppercase text-text-muted tracking-widest font-bold mb-1 group-hover:text-white transition-colors">Your Rank</span>
                <div className="font-display text-4xl font-black text-f1-yellow tracking-tighter drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                  #4,281
                </div>
              </div>
              <div className="w-16 h-16 rounded-xl bg-surface-hover border border-border-strong flex items-center justify-center text-text-muted relative z-10 group-hover:border-trgt-crimson/50 group-hover:text-trgt-crimson transition-all duration-300">
                 <Crosshair className="w-8 h-8" />
              </div>
            </Card>
          </TiltCard>
        </motion.div>
      </section>

      {/* Main Grid: Podium Sidebar + Table */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Global Podium (Left 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 perspective-[1000px]">
           {/* Top 3 Visual Podium */}
           <motion.div
              initial={{ rotateX: 20, opacity: 0, scale: 0.8 }}
              animate={{ rotateX: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              style={{ transformStyle: "preserve-3d" }}
           >
             <Card glass carbon className="p-8 bg-black/60 flex flex-col items-center justify-end min-h-[450px] relative border-border-strong overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-gradient-to-t from-trgt-crimson/20 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="flex items-end justify-center w-full gap-3 mt-auto relative z-10 h-full pb-0">
                   {/* P2 */}
                   <div className="flex flex-col items-center flex-1 h-full justify-end group/p2">
                      <motion.div animate={floatAnimation} style={{ animationDelay: "1s" }} className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full border-2 border-border-strong bg-surface-deep flex items-center justify-center font-display font-black text-white text-lg mb-4 shadow-lg group-hover/p2:border-white transition-colors">JT</div>
                        <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1 text-center w-full truncate px-2 group-hover/p2:text-white transition-colors">JamesT</span>
                        <span className="font-mono text-white text-sm font-bold mb-6">412 PT</span>
                      </motion.div>
                      <motion.div 
                        custom={140}
                        variants={podiumAnimation}
                        initial="hidden"
                        animate="show"
                        className="w-full bg-surface-deep border-t border-l border-border-strong rounded-t-xl flex justify-center pt-4 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] transform perspective-[500px] rotateX-12 origin-bottom brightness-75 group-hover/p2:brightness-100 transition-all"
                      >
                         <span className="font-display font-black text-4xl text-white/20">2</span>
                      </motion.div>
                   </div>

                   {/* P1 */}
                   <div className="flex flex-col items-center flex-[1.2] z-20 -mx-4 h-full justify-end group/p1">
                      <motion.div animate={floatAnimation} className="flex flex-col items-center">
                        <Award className="w-8 h-8 text-f1-yellow absolute -top-10 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]" />
                        <div className="w-20 h-20 rounded-full border-4 border-trgt-crimson bg-surface-deep flex items-center justify-center font-display font-black text-white text-2xl mb-4 shadow-[0_0_30px_rgba(238,63,44,0.5)] relative z-20 group-hover/p1:scale-110 transition-transform duration-300">AF</div>
                        <span className="text-[12px] uppercase tracking-widest text-trgt-crimson font-black mb-1 text-center w-full truncate px-2 drop-shadow-md">Alex Fan</span>
                        <span className="font-mono text-white text-lg font-bold mb-6 drop-shadow-md">489 PT</span>
                      </motion.div>
                      <motion.div 
                        custom={200}
                        variants={podiumAnimation}
                        initial="hidden"
                        animate="show"
                        className="w-full bg-gradient-to-t from-trgt-crimson/20 to-trgt-crimson/50 border-t-2 border-l-2 border-trgt-crimson/80 rounded-t-xl flex justify-center pt-4 relative overflow-hidden shadow-[0_-10px_30px_rgba(238,63,44,0.3)] transform perspective-[500px] rotateX-12 origin-bottom z-10"
                      >
                         <div className="absolute inset-0 carbon-texture opacity-30 mix-blend-overlay" />
                         <div className="absolute top-0 inset-x-0 h-1 bg-white/50 blur-sm" />
                         <span className="font-display font-black text-6xl text-white/50 relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">1</span>
                      </motion.div>
                   </div>

                   {/* P3 */}
                   <div className="flex flex-col items-center flex-1 h-full justify-end group/p3">
                      <motion.div animate={floatAnimation} style={{ animationDelay: "0.5s" }} className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full border-2 border-border-strong bg-surface-deep flex items-center justify-center font-display font-black text-white text-lg mb-4 shadow-lg group-hover/p3:border-white transition-colors">RS</div>
                        <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1 text-center w-full truncate px-2 group-hover/p3:text-white transition-colors">Riccardo</span>
                        <span className="font-mono text-white text-sm font-bold mb-6">395 PT</span>
                      </motion.div>
                      <motion.div 
                        custom={100}
                        variants={podiumAnimation}
                        initial="hidden"
                        animate="show"
                        className="w-full bg-surface-deep border-t border-r border-border-strong rounded-t-xl flex justify-center pt-4 shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] transform perspective-[500px] rotateX-12 origin-bottom brightness-50 group-hover/p3:brightness-100 transition-all"
                      >
                         <span className="font-display font-black text-4xl text-white/20">3</span>
                      </motion.div>
                   </div>
                </div>
             </Card>
           </motion.div>
        </div>

        {/* Full Table (Right 8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <Card glass carbon className="flex flex-col bg-black/60 border-border-strong overflow-hidden rounded-xl w-full shadow-[0_0_40px_rgba(0,0,0,0.8)]">
               
            {/* Table Header */}
            <div className="flex items-center justify-between py-6 px-8 border-b border-border-strong text-xs uppercase font-bold text-text-muted tracking-widest bg-surface-deep/80 backdrop-blur z-20 sticky top-0">
               <div className="w-[60px]">Rank</div>
               <div className="flex-1 min-w-[120px]">Predictor</div>
               <div className="w-[100px] text-right hidden lg:block">Accuracy</div>
               <div className="w-[80px] text-right text-trgt-crimson drop-shadow-[0_0_5px_rgba(238,63,44,0.5)]">Points</div>
            </div>

            {/* List Array */}
            <motion.div 
              variants={container} 
              initial="hidden" 
              animate="show"
              className="flex flex-col"
            >
              {[
                 { rank: 4, name: "MaxFan_99", acc: "84%", pts: 382, pro: false },
                 { rank: 5, name: "V10_Engine", acc: "81%", pts: 375, pro: true },
                 { rank: 6, name: "Downforce", acc: "79%", pts: 360, pro: false },
                 { rank: 7, name: "Sector_Purple", acc: "78%", pts: 351, pro: true },
                 { rank: 8, name: "BrakeMagic", acc: "75%", pts: 340, pro: false },
                 { rank: 9, name: "BoxBoxBox", acc: "74%", pts: 335, pro: false },
                 { rank: 10, name: "Undercut_King", acc: "71%", pts: 322, pro: true }
              ].map((p, i) => (
                 <motion.div key={i} variants={item} className="w-full">
                    <div className="flex items-center justify-between py-5 px-8 outline outline-transparent hover:outline-trgt-crimson/50 hover:bg-surface-hover/80 transition-all duration-300 cursor-pointer group relative overflow-hidden bg-black/20">
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border-subtle/30 to-transparent" />
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-trgt-crimson to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="w-[60px] font-mono text-xl font-bold text-text-muted group-hover:text-white group-hover:scale-110 transition-all">{p.rank}</div>
                      <div className="flex-1 flex items-center gap-4">
                         <span className="font-display font-black text-white text-2xl tracking-tight group-hover:text-trgt-crimson transition-colors drop-shadow-md">{p.name}</span>
                         {p.pro && <span className="px-2 py-1 rounded-sm text-[10px] uppercase font-black tracking-widest bg-f1-purple/10 text-f1-purple border border-f1-purple/30 mt-1 shadow-[0_0_10px_rgba(191,95,255,0.2)]">PRO</span>}
                      </div>
                      <div className="w-[100px] text-right font-mono text-base font-bold text-text-secondary hidden lg:block group-hover:text-white transition-colors">{p.acc}</div>
                      <div className="w-[80px] text-right font-mono text-3xl font-black text-white tracking-tighter group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-all">{p.pts}</div>
                    </div>
                 </motion.div>
              ))}
            </motion.div>

            {/* Pagination / Load More */}
            <div className="py-8 flex justify-center items-center gap-6 bg-surface-deep/40 mt-auto border-t border-border-strong/50">
               <button className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-white transition-colors bg-surface-hover px-6 py-2 rounded">Prev</button>
               <span className="font-mono text-sm text-text-secondary tracking-widest">PAGE 1 OF 420</span>
               <button className="text-xs font-bold uppercase tracking-widest text-white hover:text-black hover:bg-white transition-colors bg-surface-hover px-6 py-2 rounded shadow-lg">Next</button>
            </div>

          </Card>
        </div>

      </div>
    </div>
  );
}
