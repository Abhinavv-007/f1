import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';
import circuits from "@/data/circuits.json";

// Read from environment
const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;

const weatherCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const circuitId = searchParams.get("circuit");

  if (!circuitId) {
    return NextResponse.json({ error: "Missing circuit parameter" }, { status: 400 });
  }

  const circuit = circuits.find((c) => c.id === circuitId);
  if (!circuit) {
    return NextResponse.json({ error: "Circuit not found" }, { status: 404 });
  }

  // Check cache
  const cached = weatherCache.get(circuitId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    if (!OPENWEATHER_KEY) throw new Error("Missing WEATHER API KEY");
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${circuit.lat}&lon=${circuit.lng}&appid=${OPENWEATHER_KEY}&units=metric`
    );

    if (!res.ok) {
      throw new Error("Weather API failed");
    }

    const data = await res.json();

    const result = {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 3.6), // m/s to km/h
      rain: data.rain?.["1h"] || 0,
      desc: data.weather?.[0]?.description || "Unknown",
      circuit: circuitId,
    };

    // Cache result
    weatherCache.set(circuitId, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch {
    // Fallback data if OpenWeather is down
    return NextResponse.json({
      temp: 28,
      feels_like: 30,
      humidity: 45,
      wind: 12,
      rain: 0,
      desc: "Clear sky",
      circuit: circuitId,
    });
  }
}
