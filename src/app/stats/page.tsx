import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getSeasonRaces } from "@/lib/race";

export default function StatsPage() {
  const races = getSeasonRaces();

  return (
    <div className="flex flex-col w-full min-h-screen pt-4 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
      <section className="w-full mb-10">
        <h1 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none mb-2">
          Circuit Data
        </h1>
        <p className="text-text-secondary text-sm uppercase tracking-widest max-w-2xl">
          Track histories, lap records, weather context, and race-weekend notes across the full 2026 calendar.
        </p>
      </section>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {races.map((race) => {
          const circuit = race.circuitData;
          if (!circuit) {
            return null;
          }

          return (
            <Link key={race.circuit} href={`/stats/${race.circuit}`}>
              <Card
                glass
                className="flex flex-col bg-black/40 border-border-strong overflow-hidden group cursor-pointer hover:border-trgt-crimson transition-colors relative h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-trgt-crimson/5 rounded-full blur-2xl group-hover:bg-trgt-crimson/20 transition-colors pointer-events-none" />

                <div className="p-6 border-b border-border-subtle/50 relative z-10 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-trgt-crimson block mb-1">
                      Round {String(race.round).padStart(2, "0")}
                    </span>
                    <h2 className="font-display font-black text-white text-2xl uppercase tracking-tight leading-none mb-1 group-hover:text-trgt-crimson transition-colors">
                      {race.name.replace(" Grand Prix", "")}
                    </h2>
                    <span className="text-xs uppercase text-text-muted tracking-widest">
                      {circuit.city}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-border-strong flex items-center justify-center bg-surface-deep text-white group-hover:bg-trgt-crimson group-hover:border-trgt-crimson transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4 relative z-10">
                  <div className="flex justify-between items-end border-b border-border-subtle/30 pb-2">
                    <span className="text-xs uppercase text-text-muted font-bold tracking-widest">
                      Length
                    </span>
                    <span className="font-mono text-white">
                      {circuit.length.replace("km", "")}{" "}
                      <span className="text-[10px] text-text-secondary">KM</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-border-subtle/30 pb-2">
                    <span className="text-xs uppercase text-text-muted font-bold tracking-widest">
                      Laps
                    </span>
                    <span className="font-mono text-white">{circuit.laps}</span>
                  </div>
                  <div className="flex justify-between items-end pb-2">
                    <span className="text-xs uppercase text-text-muted font-bold tracking-widest">
                      Lap Record
                    </span>
                    <div className="text-right">
                      <span className="font-mono text-white block">{circuit.lapRecord}</span>
                      <span className="text-[10px] text-text-secondary uppercase">
                        {circuit.lapRecordHolder}, {String(circuit.lapRecordYear).slice(-2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 blur-[1px] group-hover:opacity-20 transition-opacity">
                  <Map className="w-48 h-48 transform -rotate-12" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
