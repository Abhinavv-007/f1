import { NextRequest, NextResponse } from "next/server";
import { buildCircuitInsight, getCircuitById } from "@/lib/race";

export const runtime = "edge";

const cache = new Map<string, { text: string; ts: number }>();
const CACHE_TTL = 10 * 60 * 1000;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const circuitId = searchParams.get("circuit") || "bahrain";
  const lapParam = searchParams.get("lap");
  const lap = lapParam ? Number.parseInt(lapParam, 10) : undefined;

  const cacheKey = `${circuitId}-${lap ?? "general"}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json({ fact: cached.text, source: "local-cache" });
  }

  const circuit = getCircuitById(circuitId);
  if (!circuit) {
    return NextResponse.json({ error: "Circuit not found" }, { status: 404 });
  }

  const fact = buildCircuitInsight(circuit, lap);
  cache.set(cacheKey, { text: fact, ts: Date.now() });

  return NextResponse.json({ fact, source: "local-data" });
}
