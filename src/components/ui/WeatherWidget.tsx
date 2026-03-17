"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Cloud, Droplets, Wind, Thermometer, Loader2 } from "lucide-react";

interface WeatherWidgetProps {
  circuitId: string;
}

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind: number;
  rain: number;
  desc: string;
}

export function WeatherWidget({ circuitId }: WeatherWidgetProps) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/weather?circuit=${circuitId}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load weather", err);
        setLoading(false);
      });
  }, [circuitId]);

  if (loading) {
    return (
      <Card glass className="p-6 bg-black/40 border-border-strong flex items-center justify-center min-h-[120px]">
        <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card glass className="p-6 bg-black/40 border-border-strong relative overflow-hidden group hover:border-blue-500/50 transition-colors">
      <div className="absolute right-0 top-0 bottom-0 w-[40%] bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
         <Cloud className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
         <h2 className="font-display text-xl text-white uppercase tracking-tight font-bold">Live Track Weather</h2>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
         <div className="flex flex-col">
            <div className="flex items-start">
               <span className="font-mono text-5xl font-black text-white tracking-tighter drop-shadow-lg leading-none">
                  {data.temp}
               </span>
               <span className="text-xl font-bold text-text-secondary mt-1 ml-1">°C</span>
            </div>
            <span className="text-xs uppercase tracking-widest text-text-muted mt-2 capitalize font-bold">
               {data.desc}
            </span>
         </div>
         
         <div className="flex gap-6">
            <div className="flex flex-col gap-1 items-end">
               <div className="flex items-center gap-1.5 text-text-muted text-[10px] uppercase font-bold tracking-widest">
                  <Thermometer className="w-3 h-3 text-red-400" /> Feels Like
               </div>
               <span className="font-mono text-white text-lg font-bold">{data.feels_like}°C</span>
            </div>
            
            <div className="flex flex-col gap-1 items-end">
               <div className="flex items-center gap-1.5 text-text-muted text-[10px] uppercase font-bold tracking-widest">
                  <Wind className="w-3 h-3 text-gray-300" /> Wind
               </div>
               <span className="font-mono text-white text-lg font-bold">{data.wind} <span className="text-xs text-text-secondary">km/h</span></span>
            </div>
            
            <div className="flex flex-col gap-1 items-end">
               <div className="flex items-center gap-1.5 text-text-muted text-[10px] uppercase font-bold tracking-widest">
                  <Droplets className="w-3 h-3 text-blue-400" /> Humidity
               </div>
               <span className="font-mono text-white text-lg font-bold">{data.humidity}%</span>
            </div>
         </div>
      </div>
    </Card>
  );
}
