import { NextResponse } from "next/server";
import fallbackStandings from "@/data/standings.json";
import { formatNationalityFlag } from "@/lib/utils";

export const runtime = "edge";

interface DriverStanding {
  position: number;
  code: string;
  firstName: string;
  lastName: string;
  team: string;
  teamColor: string;
  nationality: string;
  points: number;
  wins: number;
}

interface ConstructorStanding {
  position: number;
  id: string;
  name: string;
  color: string;
  points: number;
  wins: number;
}

interface StandingsPayload {
  season: number;
  round: number;
  drivers: DriverStanding[];
  constructors: ConstructorStanding[];
  source: "live" | "cache" | "snapshot";
  updatedAt: string;
  stale?: boolean;
  error?: string;
}

const standingsCache = new Map<string, { data: StandingsPayload; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getSnapshotPayload(): StandingsPayload {
  return {
    ...fallbackStandings,
    drivers: fallbackStandings.drivers.map((driver) => ({
      ...driver,
      nationality: formatNationalityFlag(driver.nationality),
    })),
    source: "snapshot",
    stale: true,
    updatedAt: new Date().toISOString(),
  };
}

export async function GET() {
  const cached = standingsCache.get("standings");
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...cached.data, source: "cache", stale: true });
  }

  try {
    const [driverRes, constructorRes] = await Promise.all([
      fetch("https://api.jolpi.ca/ergast/f1/current/driverStandings.json", {
        cache: "no-store",
        headers: { accept: "application/json" },
      }),
      fetch("https://api.jolpi.ca/ergast/f1/current/constructorStandings.json", {
        cache: "no-store",
        headers: { accept: "application/json" },
      }),
    ]);

    if (!driverRes.ok || !constructorRes.ok) {
      throw new Error("Failed to fetch from Jolpica API");
    }

    const driverData = await driverRes.json();
    const constructorData = await constructorRes.json();

    const rawDriverStandings = driverData.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
    const rawConstructorStandings = constructorData.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];

    if (rawDriverStandings.length === 0 || rawConstructorStandings.length === 0) {
      throw new Error("Jolpica returned empty standings payloads");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const driverStandings: DriverStanding[] = rawDriverStandings.map((ds: any) => ({
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
    const constructorStandings: ConstructorStanding[] = rawConstructorStandings.map((cs: any) => ({
      position: parseInt(cs.position, 10),
      id: cs.Constructor.constructorId,
      name: cs.Constructor.name,
      color: getConstructorColor(cs.Constructor.constructorId),
      points: parseFloat(cs.points),
      wins: parseInt(cs.wins, 10),
    }));

    const season =
      Number.parseInt(driverData.MRData?.StandingsTable?.season ?? "", 10) ||
      Number.parseInt(constructorData.MRData?.StandingsTable?.season ?? "", 10) ||
      new Date().getUTCFullYear();
    const round =
      Number.parseInt(driverData.MRData?.StandingsTable?.round ?? "", 10) ||
      Number.parseInt(constructorData.MRData?.StandingsTable?.round ?? "", 10) ||
      0;

    const result: StandingsPayload = {
      season,
      round,
      drivers: driverStandings,
      constructors: constructorStandings,
      source: "live",
      updatedAt: new Date().toISOString(),
    };
    standingsCache.set("standings", { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Standings API Error:", error);

    if (cached) {
      return NextResponse.json({
        ...cached.data,
        source: "cache",
        stale: true,
        error: "Live Jolpica fetch failed. Showing the last cached standings.",
      });
    }

    return NextResponse.json({
      ...getSnapshotPayload(),
      error: "Live Jolpica fetch failed. Showing the last bundled standings snapshot.",
    });
  }
}

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
    racing_bulls: "#6692FF",
    audi: "#1BD35A",
    cadillac: "#246BFF",
    sauber: "#52E252",
    haas: "#B6BABD",
  };
  return colors[id] || "#ffffff";
}
