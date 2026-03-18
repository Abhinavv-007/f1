import calendar from "@/data/calendar.json";
import circuits from "@/data/circuits.json";

export type CircuitData = (typeof circuits)[number];
export type CalendarRace = (typeof calendar)[number];
export type SessionStatus = "upcoming" | "active" | "completed" | "post-season";

export interface SessionSnapshot {
  season: number;
  round: number;
  sessionName: string;
  circuit: string;
  circuitId: string | null;
  city: string | null;
  country: string | null;
  date: string | null;
  time: string | null;
  startsAt: string | null;
  isActive: boolean;
  isLocked: boolean;
  status: SessionStatus;
  source: "remote" | "local";
  updatedAt: string;
}

interface JolpicaRace {
  round: string;
  raceName: string;
  date: string;
  time?: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location?: {
      locality?: string;
      country?: string;
    };
  };
}

interface JolpicaScheduleResponse {
  MRData?: {
    RaceTable?: {
      season?: string;
      Races?: JolpicaRace[];
    };
  };
}

const ACTIVE_WINDOW_HOURS = 72;
const LIVE_WINDOW_HOURS = 6;

const circuitAliases: Record<string, string> = {
  albert_park: "australia",
  americas: "united_states",
  baku: "azerbaijan",
  catalunya: "spain",
  hungaroring: "hungary",
  imola: "emilia_romagna",
  interlagos: "brazil",
  jeddah: "saudi_arabia",
  losail: "qatar",
  marina_bay: "singapore",
  monza: "italy",
  red_bull_ring: "austria",
  rodriguez: "mexico",
  silverstone: "great_britain",
  spa: "belgium",
  suzuka: "japan",
  vegas: "las_vegas",
  villeneuve: "canada",
  yas_marina: "abu_dhabi",
  zandvoort: "netherlands",
};

export function getCircuitById(circuitId: string): CircuitData | null {
  return circuits.find((circuit) => circuit.id === circuitId) ?? null;
}

export function getRaceByCircuitId(circuitId: string): CalendarRace | null {
  return calendar.find((race) => race.circuit === circuitId) ?? null;
}

export function getRaceByRound(round: number): CalendarRace | null {
  return calendar.find((race) => race.round === round) ?? null;
}

export function getSeasonRaces() {
  return calendar
    .map((race) => ({
      ...race,
      circuitData: getCircuitById(race.circuit),
    }))
    .filter((race) => race.circuitData);
}

export function resolveCircuitId(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  if (getCircuitById(value)) {
    return value;
  }

  return circuitAliases[value] ?? null;
}

export function getRaceDistanceKm(circuit: CircuitData): string {
  const lengthKm = Number.parseFloat(circuit.length);

  if (Number.isNaN(lengthKm)) {
    return "--";
  }

  return (lengthKm * circuit.laps).toFixed(3);
}

export function getTrackScaleLabel(value: number): string {
  if (value <= 0) return "TBD";
  if (value <= 1) return "Low";
  if (value === 2) return "Balanced";
  if (value === 3) return "High";
  return "Very High";
}

export function buildCircuitInsight(circuit: CircuitData, lap?: number): string {
  if (circuit.overtakingRating <= 0 || circuit.tireDegradation <= 0) {
    return `${circuit.circuit} is making its full-season debut in 2026, so benchmark strategy data is still being built. The current reference points are ${circuit.length}, ${circuit.turns} corners, and ${circuit.laps} race laps around ${circuit.city}.`;
  }

  const overtakingLabel = getTrackScaleLabel(circuit.overtakingRating).toLowerCase();
  const degradationLabel = getTrackScaleLabel(circuit.tireDegradation).toLowerCase();

  if (typeof lap === "number" && Number.isFinite(lap)) {
    const midRaceLap = Math.max(1, Math.floor(circuit.laps * 0.5));
    const lateRaceLap = Math.max(1, Math.floor(circuit.laps * 0.75));
    const phase =
      lap < midRaceLap
        ? `track position will still be fluid because ${circuit.drsZones} DRS zones keep overtaking ${overtakingLabel}`
        : lap < lateRaceLap
          ? `strategy windows start to converge because tire wear trends ${degradationLabel}`
          : `late-race management matters most because traction zones punish worn tires on this ${circuit.type} layout`;

    return `${circuit.circuit} runs ${circuit.length} with ${circuit.turns} corners, so lap ${lap} is where ${phase}. The official lap record is ${circuit.lapRecord} by ${circuit.lapRecordHolder} (${circuit.lapRecordYear}), which is the benchmark for outright pace here.`;
  }

  return `${circuit.circuit} is a ${circuit.type} venue with ${circuit.turns} turns and ${circuit.drsZones} DRS zones, so overtaking rates trend ${overtakingLabel}. Tire degradation is typically ${degradationLabel}, and the standing lap record is ${circuit.lapRecord} by ${circuit.lapRecordHolder} (${circuit.lapRecordYear}).`;
}

function parseIsoDate(value?: string | null): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseRaceStart(date?: string | null, time?: string | null): Date | null {
  if (!date) {
    return null;
  }

  const parsed = new Date(`${date}T${time && time.length > 0 ? time : "00:00:00Z"}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function resolveSessionStatus(startsAt: Date | null, now: Date): SessionStatus {
  if (!startsAt) {
    return "post-season";
  }

  const diffMs = startsAt.getTime() - now.getTime();
  const activeWindowMs = ACTIVE_WINDOW_HOURS * 60 * 60 * 1000;
  const liveWindowMs = LIVE_WINDOW_HOURS * 60 * 60 * 1000;

  if (diffMs >= 0) {
    return diffMs <= activeWindowMs ? "active" : "upcoming";
  }

  if (Math.abs(diffMs) <= liveWindowMs) {
    return "active";
  }

  return "completed";
}

function buildSessionSnapshot(args: {
  season: number;
  round: number;
  sessionName: string;
  circuit: string;
  circuitId: string | null;
  city: string | null;
  country: string | null;
  date: string | null;
  time: string | null;
  startsAt: Date | null;
  source: "remote" | "local";
  now: Date;
}): SessionSnapshot {
  const status = resolveSessionStatus(args.startsAt, args.now);
  const startsAtIso = args.startsAt?.toISOString() ?? null;

  return {
    season: args.season,
    round: args.round,
    sessionName: args.sessionName,
    circuit: args.circuit,
    circuitId: args.circuitId,
    city: args.city,
    country: args.country,
    date: args.date,
    time: args.time,
    startsAt: startsAtIso,
    isActive: status === "active",
    isLocked: args.startsAt ? args.now >= args.startsAt : status === "completed",
    status,
    source: args.source,
    updatedAt: args.now.toISOString(),
  };
}

export function getLocalSessionSnapshot(now = new Date()): SessionSnapshot {
  const season = parseIsoDate(calendar[0]?.race)?.getUTCFullYear() ?? now.getUTCFullYear();

  const findRace = (matcher: (startsAt: Date | null) => boolean) =>
    calendar.find((race) => matcher(parseIsoDate(race.race)));

  const activeRace =
    findRace((startsAt) => resolveSessionStatus(startsAt, now) === "active") ??
    findRace((startsAt) => startsAt !== null && startsAt >= now) ??
    calendar.at(-1);

  if (!activeRace) {
    return {
      season,
      round: 0,
      sessionName: "Post-Season",
      circuit: "N/A",
      circuitId: null,
      city: null,
      country: null,
      date: null,
      time: null,
      startsAt: null,
      isActive: false,
      isLocked: true,
      status: "post-season",
      source: "local",
      updatedAt: now.toISOString(),
    };
  }

  const circuit = getCircuitById(activeRace.circuit);
  const startsAt = parseIsoDate(activeRace.race);
  const date = startsAt ? startsAt.toISOString().slice(0, 10) : null;
  const time = startsAt ? startsAt.toISOString().slice(11, 19) + "Z" : null;

  return buildSessionSnapshot({
    season,
    round: activeRace.round,
    sessionName: activeRace.name,
    circuit: circuit?.circuit ?? activeRace.name,
    circuitId: circuit?.id ?? activeRace.circuit,
    city: circuit?.city ?? null,
    country: circuit?.country ?? null,
    date,
    time,
    startsAt,
    source: "local",
    now,
  });
}

function buildRemoteSnapshot(race: JolpicaRace, season: number, now: Date): SessionSnapshot {
  const round = Number.parseInt(race.round, 10);
  const localRace = Number.isNaN(round) ? null : getRaceByRound(round);
  const localCircuitId = localRace?.circuit ?? resolveCircuitId(race.Circuit.circuitId);
  const localCircuit = localCircuitId ? getCircuitById(localCircuitId) : null;

  return buildSessionSnapshot({
    season,
    round: Number.isNaN(round) ? 0 : round,
    sessionName: race.raceName,
    circuit: race.Circuit.circuitName,
    circuitId: localCircuitId,
    city: race.Circuit.Location?.locality ?? localCircuit?.city ?? null,
    country: race.Circuit.Location?.country ?? localCircuit?.country ?? null,
    date: race.date ?? null,
    time: race.time ?? null,
    startsAt: parseRaceStart(race.date, race.time),
    source: "remote",
    now,
  });
}

export async function fetchSessionSnapshot(now = new Date()): Promise<SessionSnapshot> {
  try {
    const res = await fetch("https://api.jolpi.ca/ergast/f1/current.json", {
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Jolpica schedule request failed with status ${res.status}`);
    }

    const data = (await res.json()) as JolpicaScheduleResponse;
    const season = Number.parseInt(data.MRData?.RaceTable?.season ?? "", 10) || now.getUTCFullYear();
    const races = data.MRData?.RaceTable?.Races ?? [];

    if (races.length === 0) {
      return getLocalSessionSnapshot(now);
    }

    const activeRace =
      races.find((race) => resolveSessionStatus(parseRaceStart(race.date, race.time), now) === "active") ??
      races.find((race) => {
        const startsAt = parseRaceStart(race.date, race.time);
        return startsAt !== null && startsAt >= now;
      }) ??
      races.at(-1);

    return activeRace ? buildRemoteSnapshot(activeRace, season, now) : getLocalSessionSnapshot(now);
  } catch {
    return getLocalSessionSnapshot(now);
  }
}
