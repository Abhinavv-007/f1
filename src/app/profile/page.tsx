"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { BadgeCase } from "@/components/ui/BadgeCase";
import { ShareCard } from "@/components/ui/ShareCard";
import { Award, Activity, Target, Loader2, Share2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/auth/AuthProvider";
import { getUserProfile } from "@/app/actions/profile";
import { computeBadges } from "@/lib/badges";
import driversData from "@/data/drivers.json";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [showShare, setShowShare] = useState<any>(null);

  useEffect(() => {
    if (user?.uid) {
      getUserProfile(user.uid).then((res) => {
        if (res.success) {
          setProfileData(res);
        }
        setLoading(false);
      });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center w-full min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-trgt-crimson" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
        {/* Top Banner / User Stats */}
      <section className="w-full flex flex-col md:flex-row gap-6 mb-12">
        {/* User Card */}
        <Card glass carbon className="flex-1 p-8 flex items-center gap-6 bg-black/60 border-border-strong relative overflow-hidden group">
          <div className="w-24 h-24 rounded-full border-2 border-trgt-crimson bg-surface-deep flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(238,63,44,0.3)] group-hover:shadow-[0_0_50px_rgba(238,63,44,0.5)] transition-shadow">
             {/* Fallback avatar */}
             <span className="font-display font-black text-3xl text-white">AX</span>
          </div>
          <div className="flex flex-col relative z-10">
             <div className="flex items-center gap-3 mb-1">
               <h1 className="font-display font-black text-4xl text-white uppercase tracking-tighter">{user.displayName || "Driver"}</h1>
               <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-trgt-crimson/20 text-trgt-crimson border border-trgt-crimson/30">PRO</span>
             </div>
             <span className="font-mono text-text-secondary text-sm">{user.email}</span>
             
             <div className="flex gap-4 mt-4">
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Global Rank</span>
                  <span className="font-mono text-f1-yellow font-bold text-xl">{profileData?.stats?.globalRank || "-"}</span>
               </div>
               <div className="w-px bg-border-subtle" />
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1">Season PTS</span>
                  <span className="font-mono text-white font-bold text-xl">{profileData?.stats?.totalPoints || 0}</span>
               </div>
             </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-gradient-to-l from-trgt-crimson/10 to-transparent pointer-events-none opacity-50" />
        </Card>
      </section>

      {/* Main Content Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: History & Breakdown (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          <section>
            <div className="flex items-center justify-between mb-4">
               <h2 className="font-display text-xl text-white uppercase tracking-tight font-bold flex items-center gap-2">
                 <Activity className="w-5 h-5 text-trgt-crimson" />
                 Prediction History
               </h2>
               <span className="text-xs uppercase tracking-widest text-text-muted cursor-pointer hover:text-white transition-colors">View All Seasons</span>
            </div>

            <Card glass className="flex flex-col bg-black/40 border-border-strong overflow-hidden rounded-xl">
               {/* List Header */}
               <div className="flex items-center justify-between py-3 px-6 border-b border-border-subtle/30 text-xs uppercase font-bold text-text-muted tracking-widest bg-surface-deep/50">
                  <div className="w-[80px]">Round</div>
                  <div className="flex-1">Grand Prix</div>
                  <div className="w-[100px] text-right">Accuracy</div>
                  <div className="w-[80px] text-right">Points</div>
               </div>

               {/* Prediction Rows */}
               {profileData?.predictions?.map((pred: any) => (
                 <div key={pred.id} className="flex flex-col py-4 px-6 border-b border-border-subtle/30 bg-surface-hover/20 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                       <div className="w-[80px] font-mono text-white text-sm">R{String(pred.raceRound).padStart(2, '0')}</div>
                       <div className="flex-1 font-display font-black text-white uppercase tracking-tight text-lg">Saudi Arabian GP</div>
                       <div className="w-[80px] text-right text-white font-mono font-bold flex items-center justify-end gap-2 text-trgt-crimson">
                          {pred.pointsEarned ? `+${pred.pointsEarned}` : 'TBD'}
                       </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-xs uppercase text-text-muted mt-2">
                       <div>P1: <span className="text-white">{driversData.find(d => d.id === pred.winner)?.name || "Pending"}</span></div>
                       <div>P2: <span className="text-white">{driversData.find(d => d.id === pred.p2)?.name || "Pending"}</span></div>
                       <div>P3: <span className="text-white">{driversData.find(d => d.id === pred.p3)?.name || "Pending"}</span></div>
                       <div>FL: <span className="text-white">{driversData.find(d => d.id === pred.fastestLap)?.name || "-"}</span></div>
                       <div>SC: <span className="text-white">{pred.safetyCar ? "Yes" : "No"}</span></div>
                    </div>
                 </div>
               ))}
               
               {profileData?.predictions?.length === 0 && (
                 <div className="p-8 text-center text-text-muted text-sm uppercase tracking-widest">
                   No predictions locked yet.
                 </div>
               )}
            </Card>
          </section>

        </div>

        {/* Right Column: Badges & Stats (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Radial Accuracy Chart Placeholder */}
          <section>
             <h2 className="font-display text-xl text-white uppercase tracking-tight font-bold mb-4 flex items-center gap-2">
               <Target className="w-5 h-5 text-white" />
               Strike Rate
             </h2>
             <Card glass className="p-8 bg-black/40 flex flex-col items-center justify-center aspect-square relative border-border-strong group">
                <div className="absolute inset-0 carbon-texture opacity-20 pointer-events-none" />
                <div className="w-48 h-48 rounded-full border-[12px] border-surface-deep relative flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border-t-trgt-crimson border-r-trgt-crimson border-b-trgt-crimson transform group-hover:scale-105 transition-transform duration-500">
                   <div className="flex flex-col items-center">
                      <span className="font-display font-black text-5xl text-white tracking-tighter">72%</span>
                      <span className="text-[10px] uppercase tracking-widest text-text-muted mt-1">Accuracy</span>
                   </div>
                </div>
             </Card>
          </section>

          {/* Badges / Garage */}
          <section>
             <h2 className="font-display text-xl text-white uppercase tracking-tight font-bold mb-4 flex items-center gap-2">
               <Award className="w-5 h-5 text-f1-yellow" />
               Trophy Case
             </h2>
             <Card glass className="p-6 bg-black/40 border-border-strong">
                <BadgeCase earnedBadgeIds={computeBadges(profileData?.predictions || [])} />
             </Card>
          </section>

          {/* Share Latest Prediction */}
          {(profileData?.predictions?.length ?? 0) > 0 && (
            <button
              onClick={() => setShowShare(profileData.predictions[0])}
              className="w-full h-12 rounded border border-border-strong text-white font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:border-trgt-crimson transition-colors mt-2"
            >
              <Share2 className="w-4 h-4" />
              Share Latest Prediction
            </button>
          )}

        </div>
        </div>

      </div>
      {showShare && (
        <ShareCard prediction={showShare} onClose={() => setShowShare(null)} />
      )}
    </ProtectedRoute>
  );
}
