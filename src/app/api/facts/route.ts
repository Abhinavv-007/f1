import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Simple in-memory cache: circuitId -> { text, timestamp }
const cache = new Map<string, { text: string; ts: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const circuit = searchParams.get("circuit") || "bahrain";
  const lap = searchParams.get("lap");

  const cacheKey = `${circuit}-${lap || "general"}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json({ fact: cached.text });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = lap
      ? `You are a surgical, data-first Formula 1 analyst for TRGT, an elite F1 fan platform. In exactly 2 sentences (no more), give an aggressive, specific race insight about lap ${lap} of the ${circuit} Grand Prix. Lead with a number or statistic. No fluff.`
      : `You are a surgical, data-first Formula 1 analyst for TRGT. In exactly 2 sentences (no more), give a brutal, specific insight about the ${circuit} Grand Prix circuit — focus on tire strategy, track characteristics, or a historical record. Lead with a number or stat. No fluff.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    cache.set(cacheKey, { text, ts: Date.now() });

    return NextResponse.json({ fact: text });
  } catch (err: any) {
    console.error("Gemini error:", err);
    return NextResponse.json(
      { fact: "Circuit data uplink temporarily unavailable. Telemetry buffering..." },
      { status: 200 }
    );
  }
}
