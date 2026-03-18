"use client";

import { Card } from "@/components/ui/Card";
import { useRaceSession } from "@/hooks/useRaceSession";
import { buildCircuitInsight, getCircuitById } from "@/lib/race";
import { Brain, Flag, MapPinned, Route, Zap } from "lucide-react";

function formatCoordinate(value: number, positiveLabel: string, negativeLabel: string) {
  const hemisphere = value >= 0 ? positiveLabel : negativeLabel;
  return `${Math.abs(value).toFixed(4)}° ${hemisphere}`;
}

export default function LiveDashboard() {
  const { session, error, isLoading } = useRaceSession();
  const circuit = session?.circuitId ? getCircuitById(session.circuitId) : null;
  const location = [circuit?.city ?? session?.city, circuit?.country ?? session?.country]
    .filter(Boolean)
    .join(", ");
  const liveStatusLabel = error
    ? "Feed Offline"
    : isLoading
      ? "Loading Session"
      : session?.isActive
        ? "Live Session"
        : session?.status === "completed"
          ? "Weekend Complete"
          : "Session Monitor";
  const trackStatusLabel = error
    ? "Data Offline"
    : isLoading
      ? "Syncing"
      : session?.isActive
        ? "Green Flag"
        : session?.isLocked
          ? "Parc Ferme"
          : "Awaiting Start";
  const trackStatusTone = error
    ? "text-trgt-crimson"
    : session?.isActive
      ? "text-f1-green"
      : "text-text-secondary";
  const coordinateLabel = circuit
    ? `${formatCoordinate(circuit.lat, "N", "S")} // ${formatCoordinate(circuit.lng, "E", "W")}`
    : "Coordinate sync pending";
  const telemetryLabel = circuit ? "Circuit geometry locked" : "Waiting for circuit data";
  const lapSummary = circuit ? `Lap 0 / ${circuit.laps}` : "Lap count syncing";
  const insight = circuit ? buildCircuitInsight(circuit) : "Circuit telemetry will appear once the current session feed resolves.";

  return (
    <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12">
      {/* Top Event Banner */}
      <section className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white uppercase tracking-tighter">
            {session?.sessionName ?? "Current Grand Prix"} <span className="text-text-muted font-normal">| {liveStatusLabel}</span>
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-trgt-crimson opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-trgt-crimson" />
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-trgt-crimson">{liveStatusLabel}</span>
            </div>
            <span className="text-border-subtle">|</span>
            <span className="font-mono text-sm text-text-secondary">{lapSummary}</span>
          </div>
        </div>

        {/* Global Track Status */}
        <div className="flex items-center gap-3">
          <Card className="px-4 py-2 flex items-center gap-3 bg-black/60 border-border-strong">
             <Flag className={`w-5 h-5 ${trackStatusTone}`} />
             <div className="flex flex-col">
               <span className="text-[10px] uppercase text-text-muted tracking-widest font-bold">Track Status</span>
               <span className={`text-sm font-mono uppercase ${trackStatusTone}`}>{trackStatusLabel}</span>
             </div>
          </Card>
        </div>
      </section>

      {/* Main Grid: Timing Tower + Insights */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Timing Tower (Left 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle/50 px-2 text-xs uppercase font-bold text-text-muted tracking-widest">
            <div className="flex items-center gap-6 w-[40px]">POS</div>
            <div className="flex-1 min-w-[120px]">Driver</div>
            <div className="w-[80px] text-right">Interval</div>
            <div className="w-[100px] text-right hidden md:block">Last Lap</div>
            <div className="w-[60px] text-right">Tires</div>
            <div className="w-[60px] text-right hidden sm:block">Pits</div>
          </div>
          
          {/* Active Timing Tower */}
          <Card glass className="flex flex-col overflow-hidden bg-black/60 border-border-strong rounded-xl">
             {/* Example Driver Row 1 */}
             <div className="flex items-center justify-between py-3 px-4 border-b border-border-subtle/30 bg-surface-hover/20 hover:bg-surface-hover/50 transition-colors group">
               <div className="flex items-center gap-4 w-[40px] font-mono text-lg font-bold text-white">1</div>
               <div className="flex-1 min-w-[120px] flex items-center gap-3">
                 <div className="w-1 h-8 bg-blue-600 rounded-full" /> {/* Team Color */}
                 <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                     <span className="font-display font-black text-white text-lg tracking-tight uppercase">VER</span>
                     <span className="font-mono text-xs text-text-muted">1</span>
                   </div>
                   <span className="text-[10px] text-text-secondary uppercase tracking-widest hidden sm:block">Red Bull Racing</span>
                 </div>
               </div>
               <div className="w-[80px] text-right font-mono text-sm font-bold text-white">Leader</div>
               <div className="w-[100px] text-right font-mono text-sm text-text-secondary hidden md:block group-hover:text-white transition-colors">1:34.218</div>
               <div className="w-[60px] text-right flex justify-end">
                 <div className="w-6 h-6 rounded-full border-2 border-[#FFD700] text-[#FFD700] flex items-center justify-center font-bold text-[10px]">M</div>
               </div>
               <div className="w-[60px] text-right font-mono text-sm text-text-muted hidden sm:block">1</div>
             </div>

             {/* Example Driver Row 2 */}
             <div className="flex items-center justify-between py-3 px-4 border-b border-border-subtle/30 hover:bg-surface-hover/50 transition-colors group">
               <div className="flex items-center gap-4 w-[40px] font-mono text-lg font-bold text-white">2</div>
               <div className="flex-1 min-w-[120px] flex items-center gap-3">
                 <div className="w-1 h-8 bg-trgt-crimson rounded-full" />
                 <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                     <span className="font-display font-black text-white text-lg tracking-tight uppercase">LEC</span>
                     <span className="font-mono text-xs text-text-muted">16</span>
                   </div>
                   <span className="text-[10px] text-text-secondary uppercase tracking-widest hidden sm:block">Ferrari</span>
                 </div>
               </div>
               <div className="w-[80px] text-right font-mono text-sm text-text-secondary">+1.245</div>
               <div className="w-[100px] text-right font-mono text-sm text-text-secondary hidden md:block group-hover:text-white transition-colors">1:34.402</div>
               <div className="w-[60px] text-right flex justify-end">
                 <div className="w-6 h-6 rounded-full border-2 border-[#EE3F2C] text-[#EE3F2C] flex items-center justify-center font-bold text-[10px]">S</div>
               </div>
               <div className="w-[60px] text-right font-mono text-sm text-text-muted hidden sm:block">1</div>
             </div>

             {/* Example Driver Row 3 */}
             <div className="flex items-center justify-between py-3 px-4 border-b border-border-subtle/30 hover:bg-surface-hover/50 transition-colors group">
               <div className="flex items-center gap-4 w-[40px] font-mono text-lg font-bold text-white">3</div>
               <div className="flex-1 min-w-[120px] flex items-center gap-3">
                 <div className="w-1 h-8 bg-[#FF8700] rounded-full" />
                 <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                     <span className="font-display font-black text-white text-lg tracking-tight uppercase">NOR</span>
                     <span className="font-mono text-xs text-text-muted">4</span>
                   </div>
                   <span className="text-[10px] text-text-secondary uppercase tracking-widest hidden sm:block">McLaren</span>
                 </div>
               </div>
               <div className="w-[80px] text-right font-mono text-sm text-text-secondary">+2.890</div>
               <div className="w-[100px] text-right font-mono text-sm text-f1-purple hidden md:block font-bold">1:34.110</div>
               <div className="w-[60px] text-right flex justify-end">
                 <div className="w-6 h-6 rounded-full border-2 border-[#FFD700] text-[#FFD700] flex items-center justify-center font-bold text-[10px]">M</div>
               </div>
               <div className="w-[60px] text-right font-mono text-sm text-text-muted hidden sm:block">1</div>
             </div>
             
             {/* Example Driver Row 4 */}
             <div className="flex items-center justify-between py-3 px-4 border-b border-border-subtle/30 hover:bg-surface-hover/50 transition-colors group">
               <div className="flex items-center gap-4 w-[40px] font-mono text-lg font-bold text-white">4</div>
               <div className="flex-1 min-w-[120px] flex items-center gap-3">
                 <div className="w-1 h-8 bg-[#00A19B] rounded-full" />
                 <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                     <span className="font-display font-black text-white text-lg tracking-tight uppercase">HAM</span>
                     <span className="font-mono text-xs text-text-muted">44</span>
                   </div>
                   <span className="text-[10px] text-text-secondary uppercase tracking-widest hidden sm:block">Mercedes</span>
                 </div>
               </div>
               <div className="w-[80px] text-right font-mono text-sm text-text-secondary">+5.412</div>
               <div className="w-[100px] text-right font-mono text-sm text-text-secondary hidden md:block group-hover:text-white transition-colors">1:34.882</div>
               <div className="w-[60px] text-right flex justify-end">
                 <div className="w-6 h-6 rounded-full border-2 border-[#FFFFFF] text-[#FFFFFF] flex items-center justify-center font-bold text-[10px]">H</div>
               </div>
               <div className="w-[60px] text-right font-mono text-sm text-text-muted hidden sm:block">2</div>
             </div>
             
             {/* Example Driver Row 5 */}
             <div className="flex items-center justify-between py-3 px-4 hover:bg-surface-hover/50 transition-colors group">
               <div className="flex items-center gap-4 w-[40px] font-mono text-lg font-bold text-white">5</div>
               <div className="flex-1 min-w-[120px] flex items-center gap-3">
                 <div className="w-1 h-8 bg-[#005AFF] rounded-full" />
                 <div className="flex flex-col">
                   <div className="flex items-center gap-2">
                     <span className="font-display font-black text-white text-lg tracking-tight uppercase">ALO</span>
                     <span className="font-mono text-xs text-text-muted">14</span>
                   </div>
                   <span className="text-[10px] text-text-secondary uppercase tracking-widest hidden sm:block">Aston Martin</span>
                 </div>
               </div>
               <div className="w-[80px] text-right font-mono text-sm text-text-secondary">+8.001</div>
               <div className="w-[100px] text-right font-mono text-sm text-text-secondary hidden md:block group-hover:text-white transition-colors">1:35.011</div>
               <div className="w-[60px] text-right flex justify-end">
                 <div className="w-6 h-6 rounded-full border-2 border-[#FFFFFF] text-[#FFFFFF] flex items-center justify-center font-bold text-[10px]">H</div>
               </div>
               <div className="w-[60px] text-right font-mono text-sm text-text-muted hidden sm:block">1</div>
             </div>
          </Card>
        </div>

        {/* Right Sidebar Insights (Right 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Fastest Lap Card */}
          <Card glass carbon className="p-6 border-f1-purple/30 group bg-black/40">
             <div className="flex items-center gap-2 mb-4 text-f1-purple">
               <Zap className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Lap Record</span>
             </div>
             
             <div className="flex items-end justify-between">
                <div>
                   <h4 className="text-2xl font-bold font-display text-white italic tracking-tighter uppercase">
                     {circuit?.lapRecordHolder ?? "TBD"}
                   </h4>
                   <span className="text-xs text-text-secondary uppercase tracking-widest">
                     {circuit?.circuit ?? "Reference pace"}
                   </span>
                </div>
                <div className="text-right">
                   <div className="font-mono text-2xl font-light text-white tracking-tighter">{circuit?.lapRecord ?? "--:--.---"}</div>
                   <span className="text-xs text-f1-purple font-mono">{circuit ? String(circuit.lapRecordYear) : "Season feed"}</span>
                </div>
             </div>
          </Card>

          {/* AI Insights Stream */}
          <Card glass className="p-0 flex flex-col overflow-hidden bg-black/40">
            <div className="p-4 border-b border-border-subtle bg-surface-hover/30 flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-white tracking-widest flex items-center gap-2">
                <Brain className="w-4 h-4 text-trgt-crimson" />
                Race Intel
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-text-secondary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-text-secondary" />
              </span>
            </div>
            <div className="p-6 flex flex-col gap-4">
               <p className="text-sm text-text-secondary leading-relaxed border-l-2 border-border-strong pl-3">
                 <strong className="text-white font-normal block mb-1 font-mono text-xs">
                   {session?.round ? `ROUND ${String(session.round).padStart(2, "0")}` : "SESSION"}
                 </strong>
                 {insight}
               </p>
               <p className="text-sm text-text-secondary leading-relaxed border-l-2 border-border-strong pl-3">
                 <strong className="text-white font-normal block mb-1 font-mono text-xs">TRACK NOTE</strong>
                 {circuit
                   ? `${circuit.circuit} runs ${circuit.length} with ${circuit.turns} turns and ${circuit.drsZones} DRS zones. ${location || "Location data pending."}`
                   : "Track metrics will populate when the circuit feed resolves."}
               </p>
            </div>
          </Card>
          
          <Card glass className="aspect-square p-8 bg-black/40 border-border-subtle/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(238,63,44,0.16),transparent_32%),radial-gradient(circle_at_78%_72%,rgba(255,255,255,0.08),transparent_26%)]" />
            <div className="absolute inset-[10%] rounded-[2rem] border border-border-subtle/30" />
            <div className="absolute inset-[16%] rounded-[2rem] border border-white/10 opacity-70" />
            <div className="absolute left-[26%] top-[34%] h-3 w-3 rounded-full bg-trgt-crimson shadow-[0_0_18px_rgba(238,63,44,0.7)]" />
            <div className="absolute right-[24%] bottom-[28%] h-2.5 w-2.5 rounded-full bg-white/70 shadow-[0_0_14px_rgba(255,255,255,0.35)]" />
            <div className="absolute left-[27%] top-[35%] h-px w-[44%] bg-gradient-to-r from-trgt-crimson via-white/40 to-transparent opacity-70" />
            <div className="absolute inset-x-[18%] top-[52%] h-px bg-white/10" />

            <div className="relative z-20 flex h-full flex-col justify-between">
              <div>
                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-text-muted">Circuit Tracker</span>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-black uppercase tracking-tight text-white">
                      {circuit?.circuit ?? session?.circuit ?? "Circuit feed pending"}
                    </h3>
                    <p className="mt-2 text-sm uppercase tracking-[0.18em] text-text-secondary">
                      {location || "Location feed syncing"}
                    </p>
                  </div>
                  <MapPinned className="h-5 w-5 text-trgt-crimson" />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-sm">
                <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-text-muted">
                  Geo Lock
                </span>
                <span className="mt-2 block font-mono text-sm uppercase text-border-strong">
                  {coordinateLabel}
                </span>
                <span className="mt-2 block text-[11px] uppercase tracking-[0.18em] text-trgt-crimson/90">
                  {telemetryLabel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Length</span>
                  <span className="mt-2 block font-mono text-lg text-white">{circuit?.length ?? "--"}</span>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Turns</span>
                  <span className="mt-2 flex items-center gap-2 font-mono text-lg text-white">
                    <Route className="h-4 w-4 text-trgt-crimson" />
                    {circuit?.turns ?? "--"}
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">DRS</span>
                  <span className="mt-2 block font-mono text-lg text-white">{circuit?.drsZones ?? "--"}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
