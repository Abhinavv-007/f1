"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { TiltCard } from "@/components/ui/TiltCard";
import { BadgeCase } from "@/components/ui/BadgeCase";
import { ShareCard } from "@/components/ui/ShareCard";
import { Award, Activity, Target, Loader2, Share2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getUserProfile,
  type ProfileActionResult,
  type ProfilePrediction,
} from "@/app/actions/profile";
import { getRaceByRound } from "@/lib/race";
import driversData from "@/data/drivers.json";

type LoadedProfile = Extract<ProfileActionResult, { success: true }>;

const driverNameByCode = new Map(
  driversData.map((driver) => [driver.code, `${driver.firstName} ${driver.lastName}`])
);

function getDriverName(code?: string | null) {
  if (!code) {
    return "Pending";
  }

  return driverNameByCode.get(code) ?? code;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<LoadedProfile | null>(null);
  const [showShare, setShowShare] = useState<ProfilePrediction | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (user?.uid) {
      getUserProfile({
        id: user.uid,
        email: user.email,
        name: user.displayName,
        image: user.photoURL,
      })
        .then((res) => {
          if (cancelled) {
            return;
          }

          if (res.success) {
            setProfileData(res);
            setLoadError(null);
          } else {
            setLoadError(res.error);
          }

          setLoading(false);
        })
        .catch(() => {
          if (!cancelled) {
            setLoadError("Failed to load profile data.");
            setLoading(false);
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [user]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  if (loading || !user) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center w-full min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-trgt-crimson drop-shadow-[0_0_15px_rgba(238,63,44,0.5)]" />
        </div>
      </ProtectedRoute>
    );
  }

  const userInitials = (user.displayName || "Driver")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
  const accuracyValue = profileData?.stats?.accuracy ?? 0;

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto overflow-hidden">
        {/* Top Banner / User Stats */}
      <motion.section 
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full flex flex-col md:flex-row gap-6 mb-12 relative z-20"
      >
        <TiltCard intensity={8} className="w-full">
          {/* User Card */}
          <Card glass carbon className="w-full p-8 flex items-center gap-8 bg-black/60 border-border-strong relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-trgt-crimson/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            
            <motion.div 
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-28 h-28 rounded-full border-4 border-trgt-crimson bg-surface-deep flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(238,63,44,0.4)] group-hover:shadow-[0_0_60px_rgba(238,63,44,0.6)] transition-shadow [transform-style:preserve-3d]"
            >
               {/* Fallback avatar */}
               <span className="font-display font-black text-4xl text-white [transform:translateZ(20px)]">{userInitials}</span>
            </motion.div>

            <div className="flex flex-col relative z-10">
               <div className="flex items-center gap-4 mb-2">
                 <h1 className="font-display font-black text-5xl text-white uppercase tracking-tighter drop-shadow-md">{user.displayName || "Driver"}</h1>
                 <span className="px-3 py-1 rounded-sm text-[10px] uppercase font-black tracking-widest bg-trgt-crimson/20 text-trgt-crimson border border-trgt-crimson/30 shadow-[0_0_10px_rgba(238,63,44,0.3)]">PRO</span>
               </div>
               <span className="font-mono text-text-secondary text-base font-bold tracking-widest uppercase">{user.email}</span>
               
               <div className="flex gap-8 mt-6 bg-surface-deep/50 p-4 rounded-lg border border-border-subtle/30 backdrop-blur w-fit">
                 <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1 font-bold">Global Rank</span>
                    <span className="font-mono text-f1-yellow font-black text-2xl drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">
                      {profileData?.stats?.globalRank ? `#${profileData.stats.globalRank}` : "-"}
                    </span>
                 </div>
                 <div className="w-px bg-border-strong" />
                 <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1 font-bold">Season PTS</span>
                    <span className="font-mono text-white font-black text-2xl drop-shadow-md">{profileData?.stats?.totalPoints || 0}</span>
                 </div>
               </div>
            </div>
            
            {/* Ambient right glow */}
            <div className="absolute right-0 top-0 bottom-0 w-[50%] bg-gradient-to-l from-trgt-crimson/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-1000" />
            <div className="absolute right-[-100px] top-[-100px] w-[300px] h-[300px] bg-trgt-crimson/20 blur-[100px] rounded-full pointer-events-none" />
          </Card>
        </TiltCard>
      </motion.section>

      {/* Main Content Grid */}
      {loadError && (
        <div className="mb-8 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {loadError}
        </div>
      )}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        
        {/* Left Column: History & Breakdown (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          <motion.section variants={item}>
            <div className="flex items-center justify-between mb-5">
               <h2 className="font-display text-2xl text-white uppercase tracking-tighter font-black flex items-center gap-3 drop-shadow-sm">
                 <Activity className="w-6 h-6 text-trgt-crimson animate-pulse" />
                 Prediction History
               </h2>
               <span className="text-xs uppercase tracking-widest text-text-muted cursor-pointer hover:text-white transition-colors font-bold flex items-center gap-1 group">
                 View All Seasons 
                 <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
               </span>
            </div>

            <Card glass className="flex flex-col bg-black/40 border-border-strong overflow-hidden rounded-xl shadow-2xl">
               {/* List Header */}
               <div className="flex items-center justify-between py-4 px-8 border-b border-border-strong text-xs uppercase font-black text-text-muted tracking-widest bg-surface-deep/80 backdrop-blur sticky top-0 z-10">
                  <div className="w-[80px]">Round</div>
                  <div className="flex-1">Grand Prix</div>
                  <div className="w-[100px] text-right">Accuracy</div>
                  <div className="w-[80px] text-right text-trgt-crimson">Points</div>
               </div>

               {/* Prediction Rows */}
               <motion.div variants={container} className="flex flex-col">
                 <AnimatePresence>
                   {profileData?.predictions?.map((pred: ProfilePrediction) => (
                     <motion.div 
                       variants={item}
                       key={pred.id} 
                       className="flex flex-col py-6 px-8 border-b border-border-subtle/30 bg-surface-hover/10 hover:bg-surface-hover/40 transition-colors group relative overflow-hidden outline outline-transparent hover:outline-trgt-crimson/30"
                     >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-trgt-crimson to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-between mb-3">
                           <div className="w-[80px] font-mono text-text-muted font-bold text-sm group-hover:text-white transition-colors">R{String(pred.raceRound).padStart(2, '0')}</div>
                           <div className="flex-1 font-display font-black text-white uppercase tracking-tighter text-2xl group-hover:text-trgt-crimson transition-colors drop-shadow-sm">
                             {getRaceByRound(pred.raceRound)?.name || `Round ${pred.raceRound}`}
                           </div>
                           <div className="w-[100px] text-right text-white font-mono font-black text-lg hidden md:block">
                              {typeof pred.accuracyScore === "number" ? `${Math.round(pred.accuracyScore)}%` : "TBD"}
                           </div>
                           <div className="w-[80px] text-right text-white font-mono font-black flex items-center justify-end gap-2 text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                              {typeof pred.pointsEarned === "number" ? (
                                <span className="text-f1-green drop-shadow-[0_0_8px_rgba(0,255,136,0.3)]">+{pred.pointsEarned}</span>
                              ) : (
                                "TBD"
                              )}
                           </div>
                        </div>
                        <div className="grid grid-cols-5 gap-3 text-xs uppercase text-text-muted mt-2 font-bold tracking-widest pl-[80px]">
                           <div className="bg-surface-deep/50 px-3 py-1.5 rounded border border-border-subtle flex flex-col gap-1">
                             <span className="text-[8px] text-text-secondary">P1</span>
                             <span className="text-white truncate">{getDriverName(pred.winner)}</span>
                           </div>
                           <div className="bg-surface-deep/50 px-3 py-1.5 rounded border border-border-subtle flex flex-col gap-1">
                             <span className="text-[8px] text-text-secondary">P2</span>
                             <span className="text-white truncate">{getDriverName(pred.p2)}</span>
                           </div>
                           <div className="bg-surface-deep/50 px-3 py-1.5 rounded border border-border-subtle flex flex-col gap-1">
                             <span className="text-[8px] text-text-secondary">P3</span>
                             <span className="text-white truncate">{getDriverName(pred.p3)}</span>
                           </div>
                           <div className="bg-surface-deep/50 px-3 py-1.5 rounded border border-border-subtle flex flex-col gap-1">
                             <span className="text-[8px] text-text-secondary text-f1-purple">FL</span>
                             <span className="text-white truncate">{getDriverName(pred.fastestLap)}</span>
                           </div>
                           <div className="bg-surface-deep/50 px-3 py-1.5 rounded border border-border-subtle flex flex-col gap-1">
                             <span className="text-[8px] text-text-secondary text-[#FFD700]">SC</span>
                             <span className="text-white truncate">{pred.safetyCar ? "Yes" : "No"}</span>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </motion.div>
               
               {profileData?.predictions?.length === 0 && (
                 <div className="p-16 text-center text-text-muted text-sm uppercase tracking-widest font-bold">
                   <Activity className="w-12 h-12 text-border-strong mx-auto mb-4" />
                   No predictions locked yet.
                 </div>
               )}
            </Card>
          </motion.section>

        </div>

        {/* Right Column: Badges & Stats (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          
          {/* Radial Accuracy Chart Placeholder */}
          <motion.section variants={item}>
             <h2 className="font-display text-2xl text-white uppercase tracking-tighter font-black mb-5 flex items-center gap-3 drop-shadow-sm">
               <Target className="w-6 h-6 text-white animate-spin-slow" />
               Strike Rate
             </h2>
             <TiltCard intensity={10}>
               <Card glass carbon className="p-10 bg-black/60 flex flex-col items-center justify-center aspect-square relative border-border-strong group shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 carbon-texture opacity-20 pointer-events-none mix-blend-overlay" />
                  <div
                    className="w-56 h-56 rounded-full relative flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] transform group-hover:scale-110 transition-transform duration-700 ease-out group-hover:rotate-90"
                    style={{
                      background: `conic-gradient(#EE3F2C 0deg ${accuracyValue * 3.6}deg, rgba(255,255,255,0.08) ${accuracyValue * 3.6}deg 360deg)`,
                    }}
                  >
                     <div className="absolute inset-[16px] rounded-full bg-surface-deep border border-border-strong" />
                     <div className="relative flex flex-col items-center transform group-hover:-rotate-90 transition-transform duration-700">
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                          className="font-display font-black text-6xl text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                        >
                          {accuracyValue}<span className="text-4xl text-text-muted">%</span>
                        </motion.span>
                        <span className="text-[12px] uppercase tracking-widest text-trgt-crimson font-black mt-2 drop-shadow-sm">Accuracy</span>
                     </div>
                  </div>
                  <div className="absolute right-[-50px] bottom-[-50px] w-[200px] h-[200px] bg-trgt-crimson/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-trgt-crimson/30 transition-colors" />
               </Card>
             </TiltCard>
          </motion.section>

          {/* Badges / Garage */}
          <motion.section variants={item}>
             <h2 className="font-display text-2xl text-white uppercase tracking-tighter font-black mb-5 flex items-center gap-3 drop-shadow-sm">
               <Award className="w-6 h-6 text-f1-yellow drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
               Trophy Case
             </h2>
             <TiltCard intensity={5}>
               <Card glass carbon className="p-8 bg-black/60 border-border-strong shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-f1-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                  <div className="relative z-10">
                    <BadgeCase badges={profileData?.badges || []} />
                  </div>
               </Card>
             </TiltCard>
          </motion.section>

          {/* Share Latest Prediction */}
          {(profileData?.predictions?.length ?? 0) > 0 && (
            <motion.div variants={item} className="mt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const latestPrediction = profileData?.predictions?.[0];
                  if (latestPrediction) {
                    setShowShare(latestPrediction);
                  }
                }}
                className="w-full h-16 rounded-xl border-2 border-border-strong bg-surface-deep/80 backdrop-blur text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:border-[#BF5FFF] hover:bg-[#BF5FFF]/10 hover:shadow-[0_0_30px_rgba(191,95,255,0.3)] transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#BF5FFF]/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <Share2 className="w-5 h-5 group-hover:text-[#BF5FFF] transition-colors" />
                <span className="group-hover:text-[#BF5FFF] transition-colors">Share Latest Prediction</span>
              </motion.button>
            </motion.div>
          )}

        </div>

      </motion.div>
      </div>
      {showShare && (
        <ShareCard prediction={showShare} onClose={() => setShowShare(null)} />
      )}
    </ProtectedRoute>
  );
}
