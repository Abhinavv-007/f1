import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, ChevronRight, Clock, Flag, Gauge, Map } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AIInsightCard } from "@/components/ui/AIInsightCard";
import { WeatherWidget } from "@/components/ui/WeatherWidget";
import {
  buildCircuitInsight,
  getCircuitById,
  getRaceByCircuitId,
  getRaceDistanceKm,
  getSeasonRaces,
  getTrackScaleLabel,
} from "@/lib/race";
import { formatCountryFlag } from "@/lib/utils";

export function generateStaticParams() {
  return getSeasonRaces().map((race) => ({
    circuitId: race.circuit,
  }));
}

function renderScale(value: number, colorClass: string) {
  return (
    <div className="w-full flex gap-1 h-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={`flex-1 ${index === 0 ? "rounded-l-full" : ""} ${index === 3 ? "rounded-r-full" : ""} ${
            index < value ? colorClass : "bg-surface-deep blur-[1px]"
          }`}
        />
      ))}
    </div>
  );
}

export default async function CircuitPage({
  params,
}: {
  params: Promise<{ circuitId: string }>;
}) {
  const { circuitId } = await params;
  const circuit = getCircuitById(circuitId);

  if (!circuit) {
    notFound();
  }

  const race = getRaceByCircuitId(circuitId);
  const heroTag = race ? `${circuit.city} // Round ${String(race.round).padStart(2, "0")}` : circuit.city;
  const downforceLabel = circuit.type === "street" ? "High" : "Balanced";
  const brakingLabel = circuit.overtakingRating >= 3 ? "High" : "Balanced";
  const tractionLabel = circuit.type === "street" ? "Critical" : "Strong";

  return (
    <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
      <Link
        href="/stats"
        className="text-xs text-text-secondary hover:text-white uppercase tracking-widest transition-colors font-bold flex items-center gap-2 w-fit mb-6"
      >
        <ChevronRight className="w-3 h-3 rotate-180" /> Back to Calendar
      </Link>

      <section className="w-full mb-10 relative overflow-hidden rounded-3xl group">
        <div className="absolute inset-0 bg-gradient-to-tr from-trgt-crimson/20 via-black/80 to-transparent z-10" />
        <Card glass carbon className="w-full flex justify-between items-end p-8 md:p-12 border-border-strong relative z-20 min-h-[300px] overflow-hidden">
          <div className="flex flex-col max-w-3xl relative z-10">
            <span className="text-trgt-crimson text-sm md:text-base uppercase tracking-widest font-bold mb-2">
              {heroTag}
            </span>
            <h1 className="font-display font-black text-5xl md:text-7xl text-white uppercase tracking-tighter leading-none mb-4 drop-shadow-xl">
              {race?.name ?? circuit.name}
            </h1>
            <p className="text-text-secondary text-base lg:text-lg leading-relaxed mix-blend-screen">
              {buildCircuitInsight(circuit)}
            </p>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-12 z-0 opacity-10 hidden md:block group-hover:opacity-20 transition-opacity duration-1000 group-hover:scale-105">
            <Map className="w-[400px] h-[400px] transform -rotate-12" />
          </div>
        </Card>
      </section>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card glass className="p-6 bg-black/40 border-border-strong flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
              <Flag className="w-5 h-5 text-white" />
              <h2 className="font-display text-xl text-white uppercase tracking-tight font-bold">
                Track Specs
              </h2>
            </div>

            <div className="flex justify-between items-center border-b border-border-subtle/30 pb-3">
              <span className="text-xs uppercase text-text-muted font-bold tracking-widest">
                Country
              </span>
              <span className="font-mono text-white text-lg">
                {formatCountryFlag(circuit.country)} {circuit.country}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-border-subtle/30 pb-3">
              <span className="text-xs uppercase text-text-muted font-bold tracking-widest">
                Circuit Length
              </span>
              <span className="font-mono text-white text-lg">
                {circuit.length.replace("km", "")} <span className="text-[10px] text-text-secondary">KM</span>
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-border-subtle/30 pb-3">
              <span className="text-xs uppercase text-text-muted font-bold tracking-widest">
                Race Distance
              </span>
              <span className="font-mono text-white text-lg">
                {getRaceDistanceKm(circuit)} <span className="text-[10px] text-text-secondary">KM</span>
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-border-subtle/30 pb-3">
              <span className="text-xs uppercase text-text-muted font-bold tracking-widest">
                Turns
              </span>
              <span className="font-mono text-white text-lg">{circuit.turns}</span>
            </div>

            <div className="flex justify-between items-center pb-1">
              <span className="text-xs uppercase text-text-muted font-bold tracking-widest">
                DRS Zones
              </span>
              <span className="font-mono text-f1-green text-lg">{circuit.drsZones}</span>
            </div>
          </Card>

          <Card glass className="p-6 bg-black/40 border-border-strong hover:border-trgt-crimson/50 transition-colors flex flex-col group h-full">
            <div className="flex items-center justify-between mb-4 flex-1">
              <h2 className="font-display text-2xl text-white uppercase tracking-tight font-bold group-hover:text-trgt-crimson transition-colors">
                Strategic Snapshot
              </h2>
              <Activity className="w-6 h-6 text-trgt-crimson opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Overtaking demand is <span className="text-white font-bold">{getTrackScaleLabel(circuit.overtakingRating)}</span>
              {" "}and tire wear trends <span className="text-trgt-crimson font-bold">{getTrackScaleLabel(circuit.tireDegradation)}</span>.
              {" "}That balance usually decides whether clean air or fresh tires wins late.
            </p>
            <button className="w-full btn-angled bg-surface-deep border border-border-strong text-white text-[12px] font-black uppercase tracking-[0.1em] py-4 group-hover:border-trgt-crimson transition-colors">
              Race Notes Locked In
            </button>
          </Card>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card glass className="p-8 bg-black/40 border-border-strong relative overflow-hidden hover:border-f1-purple/50 transition-colors group">
            <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-gradient-to-l from-f1-purple/10 to-transparent pointer-events-none" />

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Clock className="w-5 h-5 text-f1-purple" />
              <h2 className="font-display text-xl text-white uppercase tracking-tight font-bold">
                Official Lap Record
              </h2>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
              <div className="flex flex-col">
                <span className="font-mono text-5xl md:text-6xl text-white font-black tracking-tighter drop-shadow-lg mb-2 group-hover:text-f1-purple transition-colors">
                  {circuit.lapRecord}
                </span>
                <span className="text-sm uppercase tracking-widest text-text-muted font-bold">
                  {circuit.lapRecordHolder} ({circuit.lapRecordYear})
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase text-text-muted tracking-widest mb-1">Type</span>
                  <span className="font-mono text-white text-lg font-bold uppercase">{circuit.type}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase text-text-muted tracking-widest mb-1">City</span>
                  <span className="font-mono text-f1-purple text-lg font-bold">{circuit.city}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase text-text-muted tracking-widest mb-1">Track</span>
                  <span className="font-mono text-white text-lg font-bold">{circuit.circuit}</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-6">
            <WeatherWidget circuitId={circuitId} />
            <AIInsightCard circuitId={circuitId} className="mb-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <Card glass className="p-6 bg-black/40 border-border-strong">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm uppercase text-white font-bold tracking-widest">Downforce</span>
                <span className="font-mono font-bold text-white bg-surface-hover px-2 py-1 rounded">
                  {downforceLabel}
                </span>
              </div>
              {renderScale(circuit.type === "street" ? 4 : 3, "bg-trgt-crimson")}
            </Card>

            <Card glass className="p-6 bg-black/40 border-border-strong">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm uppercase text-white font-bold tracking-widest">
                  Tire Degradation
                </span>
                <span className="font-mono font-bold text-white bg-surface-hover px-2 py-1 rounded text-trgt-crimson">
                  {getTrackScaleLabel(circuit.tireDegradation)}
                </span>
              </div>
              {renderScale(circuit.tireDegradation, "bg-[#EE3F2C]")}
            </Card>

            <Card glass className="p-6 bg-black/40 border-border-strong">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm uppercase text-white font-bold tracking-widest">
                  Braking Severity
                </span>
                <span className="font-mono font-bold text-white bg-surface-hover px-2 py-1 rounded">
                  {brakingLabel}
                </span>
              </div>
              {renderScale(circuit.overtakingRating, "bg-[#EE3F2C]")}
            </Card>

            <Card glass className="p-6 bg-black/40 border-border-strong">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm uppercase text-white font-bold tracking-widest">Traction</span>
                <span className="font-mono font-bold text-white bg-surface-hover px-2 py-1 rounded">
                  {tractionLabel}
                </span>
              </div>
              {renderScale(circuit.type === "street" ? 4 : 3, "bg-trgt-crimson")}
            </Card>

            <Card glass className="p-6 bg-black/40 border-border-strong sm:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm uppercase text-white font-bold tracking-widest">
                  Passing Window
                </span>
                <span className="font-mono font-bold text-white bg-surface-hover px-2 py-1 rounded flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-trgt-crimson" />
                  {getTrackScaleLabel(circuit.overtakingRating)}
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {circuit.circuit} combines {circuit.turns} corners with {circuit.drsZones} DRS zones, so overtakes
                usually hinge on exit speed and battery deployment rather than one isolated braking point.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
