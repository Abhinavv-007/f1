import { NextRequest, NextResponse } from "next/server";
import circuits from "@/data/circuits.json";

export const runtime = "edge";

const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;
const weatherCache = new Map<string, { data: WeatherResponse; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000;

interface WeatherResponse {
  temp: number;
  feels_like: number;
  humidity: number;
  wind: number;
  rain: number;
  desc: string;
  circuit: string;
  source: "live" | "cache";
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const circuitId = searchParams.get("circuit");

  if (!circuitId) {
    return NextResponse.json({ error: "Missing circuit parameter" }, { status: 400 });
  }

  const circuit = circuits.find((entry) => entry.id === circuitId);
  if (!circuit) {
    return NextResponse.json({ error: "Circuit not found" }, { status: 404 });
  }

  const cached = weatherCache.get(circuitId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  if (!OPENWEATHER_KEY) {
    return NextResponse.json(
      { error: "Weather API key is not configured for live conditions." },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${circuit.lat}&lon=${circuit.lng}&appid=${OPENWEATHER_KEY}&units=metric`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`OpenWeather returned ${res.status}`);
    }

    const data = (await res.json()) as {
      dt?: number;
      main?: {
        temp?: number;
        feels_like?: number;
        humidity?: number;
      };
      wind?: {
        speed?: number;
      };
      rain?: {
        ["1h"]?: number;
      };
      weather?: Array<{
        description?: string;
      }>;
    };

    const result: WeatherResponse = {
      temp: Math.round(data.main?.temp ?? 0),
      feels_like: Math.round(data.main?.feels_like ?? 0),
      humidity: data.main?.humidity ?? 0,
      wind: Math.round((data.wind?.speed ?? 0) * 3.6),
      rain: data.rain?.["1h"] ?? 0,
      desc: data.weather?.[0]?.description ?? "Unavailable",
      circuit: circuitId,
      source: "live",
      updatedAt: new Date((data.dt ?? Math.floor(Date.now() / 1000)) * 1000).toISOString(),
    };

    weatherCache.set(circuitId, { data: result, timestamp: Date.now() });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Weather API Error:", error);

    if (cached) {
      return NextResponse.json({ ...cached.data, source: "cache" as const });
    }

    return NextResponse.json(
      { error: "Live weather is temporarily unavailable." },
      { status: 502 }
    );
  }
}
