import { NextResponse } from "next/server";
import { formatNationalityFlag } from "@/lib/utils";

const standingsCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET() {
  const cached = standingsCache.get("standings");
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    // Fetch directly from Jolpica API (Ergast backward compatible) for 2024 season assuming 2025 isn't fully live
    const [driverRes, constructorRes] = await Promise.all([
      fetch("http://api.jolpi.ca/ergast/f1/current/driverStandings.json", { cache: "no-store" }),
      fetch("http://api.jolpi.ca/ergast/f1/current/constructorStandings.json", { cache: "no-store" })
    ]);

    if (!driverRes.ok || !constructorRes.ok) {
      throw new Error("Failed to fetch from Jolpica API");
    }

    const driverData = await driverRes.json();
    const constructorData = await constructorRes.json();

    const rawDriverStandings = driverData.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
    const rawConstructorStandings = constructorData.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];

    // Transform Jolpica/Ergast format into our App's format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const driverStandings = rawDriverStandings.map((ds: any) => ({
      position: parseInt(ds.position, 10),
      code: ds.Driver.code || ds.Driver.familyName.substring(0, 3).toUpperCase(),
      firstName: ds.Driver.givenName,
      lastName: ds.Driver.familyName,
      team: ds.Constructors[0]?.name || "Unknown",
      teamColor: getConstructorColor(ds.Constructors[0]?.constructorId),
      nationality: formatNationalityFlag(ds.Driver.nationality),
      points: parseFloat(ds.points),
      wins: parseInt(ds.wins, 10),
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const constructorStandings = rawConstructorStandings.map((cs: any) => ({
      position: parseInt(cs.position, 10),
      id: cs.Constructor.constructorId,
      name: cs.Constructor.name,
      color: getConstructorColor(cs.Constructor.constructorId),
      points: parseFloat(cs.points),
      wins: parseInt(cs.wins, 10),
    }));

    const result = { drivers: driverStandings, constructors: constructorStandings };
    standingsCache.set("standings", { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Standings API Error:", error);
    // If external fetch fails, return an empty structured response to prevent 500 crashes
    return NextResponse.json({ drivers: [], constructors: [] }, { status: 502 });
  }
}

// Helper to map Ergast constructor IDs to custom team colors
function getConstructorColor(id: string): string {
  const colors: Record<string, string> = {
    red_bull: "#3671C6",
    mercedes: "#27F4D2",
    ferrari: "#E8002D",
    mclaren: "#FF8000",
    aston_martin: "#229971",
    alpine: "#FF87BC",
    williams: "#64C4FF",
    rb: "#6692FF",
    sauber: "#52E252",
    haas: "#B6BABD",
  };
  return colors[id] || "#ffffff";
}
