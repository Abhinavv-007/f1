"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { TiltCard } from "@/components/ui/TiltCard";
import { Clock, Lock, Target, TrendingUp, AlertTriangle, Loader2, Award } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/auth/AuthProvider";
import driversData from "@/data/drivers.json";
import { submitPrediction } from "@/app/actions/predict";
import { useRouter } from "next/navigation";
import { useRaceSession } from "@/hooks/useRaceSession";

export default function PredictPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { session, countdown, error: sessionError, isLoading: sessionLoading, isLocked: sessionLocked } =
    useRaceSession();

  const isLocked = hasSubmitted || sessionLocked;
  const timeLeft = sessionLoading ? "00:00:00:00" : countdown.compact;
  const sessionName = session
    ? `Round ${session.round} // ${session.sessionName}`
    : sessionError
      ? "Connection Error"
      : "Loading...";

  const [form, setForm] = useState({
    p1: "",
    p2: "",
    p3: "",
    fastestLap: "",
    firstRetirement: "",
    safetyCar: "true",
    winningMargin: "0-3s",
  });

  const handleSelect = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!user) return;
    setErrorMsg("");
    
    if (!form.p1 || !form.p2 || !form.p3) {
      setErrorMsg("Please select all three podium positions.");
      return;
    }

    if (new Set([form.p1, form.p2, form.p3]).size !== 3) {
      setErrorMsg("Podium picks must be three different drivers.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("userId", user.uid);
      formData.append("userEmail", user.email || "");
      formData.append("userName", user.displayName || "");
      formData.append("userImage", user.photoURL || "");
      formData.append("p1", form.p1);
      formData.append("p2", form.p2);
      formData.append("p3", form.p3);
      formData.append("fastestLap", form.fastestLap);
      formData.append("firstRetirement", form.firstRetirement);
      formData.append("safetyCar", form.safetyCar);
      formData.append("winningMargin", form.winningMargin);

      const res = await submitPrediction(formData);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        setHasSubmitted(true);
        router.push("/profile");
      }
    });
  };

  // Stagger wrapper for form groups
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto overflow-hidden">
        {/* Top Header / Countdown */}
      <section className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 mt-4">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="font-display font-black text-5xl md:text-6xl text-white uppercase tracking-tighter leading-none mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            RACE <span className="text-trgt-crimson">PREDICTIONS</span>
          </h1>
          <p className="text-text-secondary text-base uppercase tracking-widest font-bold">
            {sessionName}
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TiltCard intensity={5} className="w-auto">
            <Card className="px-8 py-5 flex items-center gap-6 bg-trgt-crimson/10 border-trgt-crimson/30 shadow-[0_0_40px_rgba(238,63,44,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-l from-trgt-crimson/20 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col relative z-10">
                <span className="text-[10px] uppercase text-trgt-crimson tracking-widest font-black mb-1 animate-pulse">Lockout Timer</span>
                <div className="font-mono text-3xl md:text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
                  {timeLeft}
                </div>
              </div>
              <div className="w-14 h-14 rounded-full bg-trgt-crimson/20 flex items-center justify-center text-trgt-crimson relative z-10 border border-trgt-crimson/50 group-hover:scale-110 transition-transform">
                 {isLocked ? <Lock className="w-6 h-6" /> : <Clock className="w-6 h-6 animate-[spin_4s_linear_infinite]" />}
              </div>
            </Card>
          </TiltCard>
        </motion.div>
      </section>

      {/* Main Grid: Form + Sidebar */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        
        {/* Prediction Form (Left 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* Section 1: The Podium */}
          <motion.section variants={itemVars}>
            <div className="flex items-center gap-4 mb-5">
              <span className="flex items-center justify-center w-8 h-8 rounded bg-white text-black font-display text-lg font-black shadow-[0_0_15px_rgba(255,255,255,0.3)]">1</span>
              <h2 className="font-display text-3xl text-white uppercase tracking-tighter font-black">The Podium</h2>
            </div>
            
            <TiltCard intensity={8}>
              <Card glass carbon className="p-8 bg-black/60 relative border-border-strong shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-t from-trgt-crimson/5 to-transparent pointer-events-none rounded-xl" />
                 <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end">
                   {/* 2nd Place */}
                   <div className="order-2 flex min-w-0 flex-1 flex-col gap-4 md:order-1 md:pb-10 group">
                     <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-6 py-8 text-center transition-transform md:min-h-[320px] md:group-hover:-translate-y-1">
                       <span className="mb-3 block font-display text-5xl font-black leading-none text-white/20 drop-shadow-md transition-colors group-hover:text-white/40">
                         P2
                       </span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#B0BEC5] transition-colors group-hover:text-white">
                         +5 PTS
                       </span>
                     </div>
                     <select
                       value={form.p2}
                       onChange={(e) => handleSelect("p2", e.target.value)}
                       disabled={isLocked || isPending}
                       className="h-16 rounded-xl border-2 border-border-strong bg-surface-deep text-white font-display font-bold uppercase text-base px-4 focus:border-[#B0BEC5] focus:bg-white/5 focus:outline-none appearance-none cursor-pointer transition-all shadow-inner group-hover:border-[#B0BEC5]/50"
                     >
                       <option value="">Select P2</option>
                       {driversData.map((d) => (
                         <option key={d.code} value={d.code}>
                           {d.firstName} {d.lastName}
                         </option>
                       ))}
                     </select>
                   </div>

                   {/* 1st Place */}
                   <div className="order-1 flex min-w-0 flex-[1.08] flex-col gap-4 md:order-2 group">
                     <div className="rounded-[2rem] border border-trgt-crimson/30 bg-[linear-gradient(180deg,rgba(238,63,44,0.14),rgba(255,255,255,0.02)_28%,rgba(0,0,0,0.48)_100%)] px-6 py-8 text-center shadow-[0_0_50px_rgba(238,63,44,0.12)] transition-transform md:min-h-[376px] md:group-hover:-translate-y-2">
                       <Award className="mx-auto mb-3 h-10 w-10 text-trgt-crimson opacity-70 transition-all group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_rgba(238,63,44,0.8)]" />
                       <span className="mb-3 block font-display text-7xl font-black leading-none text-trgt-crimson drop-shadow-[0_0_20px_rgba(238,63,44,0.3)]">
                         P1
                       </span>
                       <span className="text-xs font-black uppercase tracking-widest text-trgt-crimson">
                         +10 PTS
                       </span>
                     </div>
                     <select
                       value={form.p1}
                       onChange={(e) => handleSelect("p1", e.target.value)}
                       disabled={isLocked || isPending}
                       className="h-20 rounded-xl border-4 border-trgt-crimson/50 bg-trgt-crimson/10 text-white font-display uppercase text-xl font-black tracking-tight px-6 focus:border-trgt-crimson focus:bg-trgt-crimson/20 focus:outline-none appearance-none shadow-[0_0_40px_rgba(238,63,44,0.2)] cursor-pointer hover:border-trgt-crimson transition-all"
                     >
                       <option value="">Select Winner</option>
                       {driversData.map((d) => (
                         <option key={d.code} value={d.code}>
                           {d.firstName} {d.lastName}
                         </option>
                       ))}
                     </select>
                   </div>

                   {/* 3rd Place */}
                   <div className="order-3 flex min-w-0 flex-1 flex-col gap-4 md:pb-4 group">
                     <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] px-6 py-8 text-center transition-transform md:min-h-[286px] md:group-hover:-translate-y-1">
                       <span className="mb-3 block font-display text-4xl font-black leading-none text-white/10 transition-colors group-hover:text-white/30">
                         P3
                       </span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#CD7F32] transition-colors group-hover:text-white">
                         +5 PTS
                       </span>
                     </div>
                     <select
                       value={form.p3}
                       onChange={(e) => handleSelect("p3", e.target.value)}
                       disabled={isLocked || isPending}
                       className="h-14 rounded-xl border-2 border-border-strong bg-surface-deep text-white font-display font-bold uppercase text-base px-4 focus:border-[#CD7F32] focus:bg-white/5 focus:outline-none appearance-none cursor-pointer transition-all shadow-inner group-hover:border-[#CD7F32]/50"
                     >
                       <option value="">Select P3</option>
                       {driversData.map((d) => (
                         <option key={d.code} value={d.code}>
                           {d.firstName} {d.lastName}
                         </option>
                       ))}
                     </select>
                   </div>
                 </div>
              </Card>
            </TiltCard>
          </motion.section>

          {/* Section 2: Race Details */}
          <motion.section variants={itemVars}>
            <div className="flex items-center gap-4 mb-5">
              <span className="flex items-center justify-center w-8 h-8 rounded bg-white text-black font-display text-lg font-black shadow-[0_0_15px_rgba(255,255,255,0.3)]">2</span>
              <h2 className="font-display text-3xl text-white uppercase tracking-tighter font-black">Race Incidents & Pace</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Fastest Lap */}
              <TiltCard intensity={3}>
                <Card glass className="p-8 bg-black/40 border-border-strong group hover:border-f1-purple/50 transition-colors shadow-lg">
                   <div className="flex justify-between items-start mb-6">
                     <div className="flex flex-col">
                       <span className="text-white font-black text-xl uppercase tracking-tighter">Fastest Lap</span>
                       <span className="text-f1-purple text-[10px] uppercase font-bold tracking-widest mt-1">+3 PTS</span>
                     </div>
                     <Target className="w-8 h-8 text-f1-purple opacity-30 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-500" />
                   </div>
                   <select 
                     value={form.fastestLap}
                     onChange={(e) => handleSelect("fastestLap", e.target.value)}
                     disabled={isLocked || isPending}
                     className="w-full h-14 rounded-lg bg-surface-deep border-2 border-border-subtle text-white font-bold uppercase px-4 focus:border-f1-purple focus:bg-f1-purple/10 focus:outline-none appearance-none cursor-pointer font-mono group-hover:border-f1-purple/30 transition-colors shadow-inner"
                   >
                     <option value="">Select Driver</option>
                     {driversData.map(d => <option key={d.code} value={d.code}>{d.firstName} {d.lastName}</option>)}
                   </select>
                </Card>
              </TiltCard>

              {/* First Retirement */}
              <TiltCard intensity={3}>
                <Card glass className="p-8 bg-black/40 border-border-strong group hover:border-trgt-crimson/50 transition-colors shadow-lg">
                   <div className="flex justify-between items-start mb-6">
                     <div className="flex flex-col">
                       <span className="text-white font-black text-xl uppercase tracking-tighter">First Retirement</span>
                       <span className="text-trgt-crimson text-[10px] uppercase font-bold tracking-widest mt-1">+5 PTS</span>
                     </div>
                     <AlertTriangle className="w-8 h-8 text-trgt-crimson opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                   </div>
                   <select 
                     value={form.firstRetirement}
                     onChange={(e) => handleSelect("firstRetirement", e.target.value)}
                     disabled={isLocked || isPending}
                     className="w-full h-14 rounded-lg bg-surface-deep border-2 border-border-subtle text-white font-bold uppercase px-4 focus:border-trgt-crimson focus:bg-trgt-crimson/10 focus:outline-none appearance-none cursor-pointer font-mono group-hover:border-trgt-crimson/30 transition-colors shadow-inner"
                   >
                     <option value="none">None (No Retirements)</option>
                     {driversData.map(d => <option key={d.code} value={d.code}>{d.firstName} {d.lastName}</option>)}
                   </select>
                </Card>
              </TiltCard>

              {/* Safety Car */}
              <TiltCard intensity={3}>
                <Card glass className="p-8 bg-black/40 border-border-strong group hover:border-[#FFD700]/50 transition-colors shadow-lg">
                   <div className="flex justify-between items-start mb-6">
                     <div className="flex flex-col">
                       <span className="text-white font-black text-xl uppercase tracking-tighter">Safety Car?</span>
                       <span className="text-[#FFD700] text-[10px] uppercase font-bold tracking-widest mt-1">+2 PTS</span>
                     </div>
                   </div>
                   <div className="flex gap-3">
                     <button 
                       disabled={isLocked || isPending}
                       onClick={() => handleSelect("safetyCar", "true")}
                       className={`flex-1 h-14 rounded-lg border-2 uppercase text-base font-black tracking-widest transition-all ${form.safetyCar === "true" ? "border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.2)]" : "border-border-subtle bg-surface-deep hover:bg-surface-hover text-text-secondary"}`}>Yes</button>
                     <button 
                       disabled={isLocked || isPending}
                       onClick={() => handleSelect("safetyCar", "false")}
                       className={`flex-1 h-14 rounded-lg border-2 uppercase text-base font-black tracking-widest transition-all ${form.safetyCar === "false" ? "border-white bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "border-border-subtle bg-surface-deep hover:bg-surface-hover text-text-secondary"}`}>No</button>
                   </div>
                </Card>
              </TiltCard>

              {/* Winning Margin */}
              <TiltCard intensity={3}>
                <Card glass className="p-8 bg-black/40 border-border-strong group hover:border-white/50 transition-colors shadow-lg">
                   <div className="flex justify-between items-start mb-6">
                     <div className="flex flex-col">
                       <span className="text-white font-black text-xl uppercase tracking-tighter">Winning Margin</span>
                       <span className="text-text-secondary text-[10px] uppercase font-bold tracking-widest mt-1">+3 PTS</span>
                     </div>
                   </div>
                   <select 
                     value={form.winningMargin}
                     onChange={(e) => handleSelect("winningMargin", e.target.value)}
                     disabled={isLocked || isPending}
                     className="w-full h-14 rounded-lg bg-surface-deep border-2 border-border-subtle text-white font-bold uppercase px-4 focus:border-white/50 focus:bg-white/5 focus:outline-none appearance-none cursor-pointer font-mono group-hover:border-white/30 transition-colors shadow-inner"
                   >
                     <option value="0-3s">Under 3 Seconds</option>
                     <option value="3-10s">3 to 10 Seconds</option>
                     <option value="10-20s">10 to 20 Seconds</option>
                     <option value="20s+">Over 20 Seconds</option>
                   </select>
                </Card>
              </TiltCard>
            </div>
          </motion.section>

          {/* Submit Action */}
          <motion.div variants={itemVars} className="mt-8 pt-10 border-t-2 border-border-subtle/30 flex flex-col md:flex-row items-center justify-between gap-8 relative">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-trgt-crimson/50 to-transparent" />
             <div className="flex flex-col md:w-1/2">
                <span className="text-white font-black text-2xl uppercase tracking-tighter mb-2 flex items-center gap-3">
                  Potential Points: <span className="text-trgt-crimson bg-trgt-crimson/10 px-3 py-1 rounded inline-block">38 PTS</span>
                </span>
                <p className="text-sm font-bold text-text-muted leading-relaxed uppercase tracking-wider">Ensure your predictions are final. Once locked, they cannot be changed after the lockout timer expires.</p>
                {errorMsg && <p className="text-sm text-trgt-crimson font-black mt-3 uppercase box-border p-3 border-l-4 border-trgt-crimson bg-trgt-crimson/10">{errorMsg}</p>}
             </div>
             
             <motion.button
               disabled={isLocked || isPending}
               onClick={handleSubmit}
               whileHover={!isLocked && !isPending ? { scale: 1.05 } : {}}
               whileTap={!isLocked && !isPending ? { scale: 0.95 } : {}}
               className="w-full md:w-auto overflow-hidden relative btn-angled bg-trgt-crimson text-white text-[18px] font-black uppercase tracking-[0.1em] px-14 py-6 hover:bg-trgt-crimson-deep transition-all duration-300 shadow-[0_0_40px_rgba(238,63,44,0.4)] hover:shadow-[0_0_60px_rgba(238,63,44,0.8)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
             >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
               {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : isLocked ? "Predictions Locked" : "Lock All Predictions"}
             </motion.button>
          </motion.div>

        </div>

        {/* Right Sidebar Global Trends (Right 4 cols) */}
        <motion.div variants={itemVars} className="lg:col-span-4 flex flex-col gap-6">
          <TiltCard intensity={5} className="h-full">
            <Card glass carbon className="p-8 bg-black/60 h-full flex flex-col border-border-strong shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-b from-border-subtle/20 to-transparent opacity-50 pointer-events-none" />
               <div className="flex items-center gap-3 mb-10 pb-5 border-b border-border-subtle/50 relative z-10">
                 <TrendingUp className="w-6 h-6 text-f1-green animate-[pulse_3s_ease-in-out_infinite]" />
                 <span className="text-base font-black uppercase tracking-widest text-white drop-shadow-md">Grid Consensus</span>
               </div>
               
               <div className="flex-1 flex flex-col justify-center gap-8 opacity-50 text-center py-12 relative z-10 group-hover:opacity-100 transition-opacity duration-500">
                  <motion.div 
                    animate={{ y: [-10, 10], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <TrendingUp className="w-16 h-16 text-border-strong mx-auto mb-4" />
                  </motion.div>
                  <h4 className="text-white font-black font-display text-2xl uppercase tracking-tighter drop-shadow-md">Data Accumulating</h4>
                  <p className="text-sm font-bold text-text-muted max-w-[250px] mx-auto uppercase tracking-wider leading-relaxed">
                    Community prediction trends will reveal themselves once enough players have locked their predictions.
                  </p>
               </div>
            </Card>
          </TiltCard>
        </motion.div>

      </motion.div>
      </div>
    </ProtectedRoute>
  );
}
