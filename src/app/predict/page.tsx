"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Clock, Lock, Target, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/auth/AuthProvider";
import driversData from "@/data/drivers.json";
import { submitPrediction } from "@/app/actions/predict";
import { useRouter } from "next/navigation";

export default function PredictPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLocked, setIsLocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

    startTransition(async () => {
      const formData = new FormData();
      formData.append("userId", user.uid);
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
        setIsLocked(true);
        router.push("/profile");
      }
    });
  };

  return (
    <ProtectedRoute>
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
               <div className="flex flex-col gap-4 pt-12 sm:pt-8 order-2 sm:order-1 relative z-20">
                 <div className="text-center">
                   <span className="font-display text-5xl font-black text-white/10 block mb-2 leading-none">P2</span>
                   <span className="text-[10px] uppercase tracking-widest text-text-muted">+5 PTS</span>
                 </div>
                 <select 
                   value={form.p2}
                   onChange={(e) => handleSelect("p2", e.target.value)}
                   disabled={isLocked || isPending}
                   className="h-16 rounded-lg border border-border-strong bg-surface-deep text-white font-mono uppercase text-sm px-4 focus:border-white/50 focus:outline-none appearance-none cursor-pointer"
                 >
                   <option value="">Select P2</option>
                   {driversData.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                 </select>
               </div>

               {/* 1st Place (Winner) */}
               <div className="flex flex-col gap-4 order-1 sm:order-2 relative z-30 -mt-4 sm:-mt-8">
                 <div className="text-center">
                   <span className="font-display text-6xl font-black text-trgt-crimson/20 block mb-2 leading-none drop-shadow-lg">P1</span>
                   <span className="text-[10px] uppercase tracking-widest text-trgt-crimson font-bold">+10 PTS</span>
                 </div>
                 <select 
                   value={form.p1}
                   onChange={(e) => handleSelect("p1", e.target.value)}
                   disabled={isLocked || isPending}
                   className="h-20 rounded-lg border-2 border-trgt-crimson/50 bg-surface-deep text-trgt-crimson font-mono uppercase text-sm font-bold tracking-widest px-4 focus:border-trgt-crimson focus:outline-none appearance-none shadow-[0_0_30px_rgba(238,63,44,0.15)] cursor-pointer"
                 >
                   <option value="">Select Winner</option>
                   {driversData.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                 </select>
               </div>

               {/* 3rd Place */}
               <div className="flex flex-col gap-4 pt-12 sm:pt-16 order-3 sm:order-3 relative z-10">
                 <div className="text-center">
                   <span className="font-display text-4xl font-black text-white/10 block mb-2 leading-none">P3</span>
                   <span className="text-[10px] uppercase tracking-widest text-text-muted">+5 PTS</span>
                 </div>
                 <select 
                   value={form.p3}
                   onChange={(e) => handleSelect("p3", e.target.value)}
                   disabled={isLocked || isPending}
                   className="h-14 rounded-lg border border-border-strong bg-surface-deep text-white font-mono uppercase text-sm px-4 focus:border-white/50 focus:outline-none appearance-none cursor-pointer"
                 >
                   <option value="">Select P3</option>
                   {driversData.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                 </select>
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
              <Card glass className="p-6 bg-black/40 border-border-strong group">
                 <div className="flex justify-between items-start mb-6">
                   <div className="flex flex-col">
                     <span className="text-white font-bold uppercase tracking-tight">Fastest Lap</span>
                     <span className="text-f1-purple text-[10px] uppercase font-bold tracking-wider mt-1">+3 PTS</span>
                   </div>
                   <Target className="w-5 h-5 text-f1-purple opacity-50" />
                 </div>
                 <select 
                   value={form.fastestLap}
                   onChange={(e) => handleSelect("fastestLap", e.target.value)}
                   disabled={isLocked || isPending}
                   className="w-full h-12 rounded bg-surface-deep border border-border-subtle text-white text-sm px-4 focus:border-f1-purple/50 focus:outline-none appearance-none cursor-pointer font-mono"
                 >
                   <option value="">Select Driver</option>
                   {driversData.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                 </select>
              </Card>

              {/* First Retirement */}
              <Card glass className="p-6 bg-black/40 border-border-strong group">
                 <div className="flex justify-between items-start mb-6">
                   <div className="flex flex-col">
                     <span className="text-white font-bold uppercase tracking-tight">First Retirement</span>
                     <span className="text-trgt-crimson text-[10px] uppercase font-bold tracking-wider mt-1">+5 PTS</span>
                   </div>
                   <AlertTriangle className="w-5 h-5 text-trgt-crimson opacity-50" />
                 </div>
                 <select 
                   value={form.firstRetirement}
                   onChange={(e) => handleSelect("firstRetirement", e.target.value)}
                   disabled={isLocked || isPending}
                   className="w-full h-12 rounded bg-surface-deep border border-border-subtle text-white text-sm px-4 focus:border-trgt-crimson/50 focus:outline-none appearance-none cursor-pointer font-mono"
                 >
                   <option value="none">None (No Retirements)</option>
                   {driversData.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                 </select>
              </Card>

              {/* Safety Car */}
              <Card glass className="p-6 bg-black/40 border-border-strong group">
                 <div className="flex justify-between items-start mb-6">
                   <div className="flex flex-col">
                     <span className="text-white font-bold uppercase tracking-tight">Safety Car?</span>
                     <span className="text-[#FFD700] text-[10px] uppercase font-bold tracking-wider mt-1">+2 PTS</span>
                   </div>
                 </div>
                 <div className="flex gap-2">
                   <button 
                     disabled={isLocked || isPending}
                     onClick={() => handleSelect("safetyCar", "true")}
                     className={`flex-1 h-12 rounded border uppercase text-sm font-bold tracking-widest transition-colors ${form.safetyCar === "true" ? "border-[#FFD700] bg-[#FFD700]/20 text-[#FFD700]" : "border-border-subtle bg-surface-deep hover:bg-surface-hover text-text-secondary"}`}>Yes</button>
                   <button 
                     disabled={isLocked || isPending}
                     onClick={() => handleSelect("safetyCar", "false")}
                     className={`flex-1 h-12 rounded border uppercase text-sm font-bold tracking-widest transition-colors ${form.safetyCar === "false" ? "border-white bg-white/20 text-white" : "border-border-subtle bg-surface-deep hover:bg-surface-hover text-text-secondary"}`}>No</button>
                 </div>
              </Card>

              {/* Winning Margin */}
              <Card glass className="p-6 bg-black/40 border-border-strong group">
                 <div className="flex justify-between items-start mb-6">
                   <div className="flex flex-col">
                     <span className="text-white font-bold uppercase tracking-tight">Winning Margin</span>
                     <span className="text-text-secondary text-[10px] uppercase font-bold tracking-wider mt-1">+3 PTS</span>
                   </div>
                 </div>
                 <select 
                   value={form.winningMargin}
                   onChange={(e) => handleSelect("winningMargin", e.target.value)}
                   disabled={isLocked || isPending}
                   className="w-full h-12 rounded bg-surface-deep border border-border-subtle text-white text-sm px-4 focus:border-white/50 focus:outline-none appearance-none cursor-pointer font-mono"
                 >
                   <option value="0-3s">Under 3 Seconds</option>
                   <option value="3-10s">3 to 10 Seconds</option>
                   <option value="10-20s">10 to 20 Seconds</option>
                   <option value="20s+">Over 20 Seconds</option>
                 </select>
              </Card>
            </div>
          </section>

          {/* Submit Action */}
          <div className="mt-8 pt-8 border-t border-border-subtle/50 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex flex-col md:w-1/2">
                <span className="text-white font-bold uppercase tracking-tight mb-2">Total Potential Points: <span className="text-trgt-crimson">38 PTS</span></span>
                <p className="text-xs text-text-muted leading-relaxed">Ensure your predictions are final. Once locked, they cannot be changed after the lockout timer expires (start of qualifying).</p>
                {errorMsg && <p className="text-xs text-trgt-crimson font-bold mt-2 uppercase">{errorMsg}</p>}
             </div>
             <button
               disabled={isLocked || isPending}
               onClick={handleSubmit}
               className="w-full md:w-auto btn-angled bg-trgt-crimson text-white text-[14px] font-black uppercase tracking-[0.1em] px-12 py-5 hover:bg-trgt-crimson-deep transition-all duration-300 shadow-[0_0_30px_rgba(238,63,44,0.3)] hover:shadow-[0_0_50px_rgba(238,63,44,0.6)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
               {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : isLocked ? "Predictions Locked" : "Lock All Predictions"}
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
    </ProtectedRoute>
  );
}
