export type SectionKey = "public" | "admin";

export interface EndpointParam {
  name: string;
  in: "query" | "header" | "path" | "body";
  required?: boolean;
  description: string;
  example?: string;
}

export interface Endpoint {
  id: string;
  section: SectionKey;
  method: "GET" | "POST" | "DELETE" | "PATCH";
  path: string;
  title: string;
  description: string;
  auth: "none" | "admin";
  params?: EndpointParam[];
  example: string;
}

export const SECTIONS: Record<SectionKey, { id: SectionKey; label: string; caption: string }> = {
  public: { id: "public", label: "Public endpoints", caption: "Open paddock" },
  admin:  { id: "admin",  label: "Admin endpoints",  caption: "Pit wall only" },
};

export const ENDPOINTS: Endpoint[] = [
  {
    id: "health",
    section: "public",
    method: "GET",
    path: "/api/health",
    title: "Health probe",
    description: "Cacheable liveness check returning service id, build, and uptime. Safe to monitor on a 30s cron.",
    auth: "none",
    example: `{
  "ok": true,
  "service": "trgt",
  "uptime_ms": 184320
}`,
  },
  {
    id: "public-summary",
    section: "public",
    method: "GET",
    path: "/api/public",
    title: "Public summary",
    description: "Aggregated public stats — current season, next race, podium leaders. Powers the homepage hero strip.",
    auth: "none",
    example: `{
  "season": 2025,
  "next_race": { "round": 7, "name": "Imola GP" },
  "leaders": [ { "code": "VER" }, { "code": "NOR" } ]
}`,
  },
  {
    id: "standings",
    section: "public",
    method: "GET",
    path: "/api/standings",
    title: "Standings",
    description: "Driver and constructor championship standings for the current or specified season.",
    auth: "none",
    params: [
      { name: "season", in: "query", description: "Year, e.g. 2025. Defaults to live season.", example: "2025" },
    ],
    example: `[
  { "code": "VER", "team": "Red Bull", "points": 312 },
  { "code": "NOR", "team": "McLaren",  "points": 298 }
]`,
  },
  {
    id: "weather",
    section: "public",
    method: "GET",
    path: "/api/weather",
    title: "Race weather",
    description: "Track-side weather for the upcoming round (temperature, rain probability, wind).",
    auth: "none",
    params: [
      { name: "round", in: "query", description: "Round number (1-24). Defaults to next round.", example: "7" },
    ],
    example: `{
  "round": 7,
  "track": "Imola",
  "temp_c": 22,
  "rain_pct": 18,
  "wind_kph": 9
}`,
  },
  {
    id: "facts",
    section: "public",
    method: "GET",
    path: "/api/facts",
    title: "Race facts",
    description: "Curated trivia + AI-generated 'did you know' lines. Used by the Stats page and weekly digest.",
    auth: "none",
    example: `{ "facts": ["Imola has hosted 30 GPs since 1980 …"] }`,
  },
  {
    id: "session",
    section: "public",
    method: "POST",
    path: "/api/session",
    title: "Session exchange",
    description: "Exchanges a Firebase ID token for a server cookie. Called by the auth flow on the client.",
    auth: "none",
    params: [
      { name: "idToken", in: "body", required: true, description: "Firebase ID token from getIdToken()." },
    ],
    example: `// request body
{ "idToken": "eyJhbGciOi…" }
// response
{ "ok": true }`,
  },
  {
    id: "admin-health",
    section: "admin",
    method: "GET",
    path: "/api/admin/health",
    title: "Admin health",
    description: "Extended health: per-instance metrics, env config, runtime, and DB readiness.",
    auth: "admin",
    example: `{
  "ok": true,
  "service": "trgt",
  "uptime_ms": 184320,
  "config": { "firebase_configured": true, "gemini_configured": true }
}`,
  },
  {
    id: "admin-summary",
    section: "admin",
    method: "GET",
    path: "/api/admin/summary",
    title: "Admin summary",
    description: "Single-shot read powering the /admin Pit Wall tab. Boot info, env, request metrics, and per-route stats.",
    auth: "admin",
    example: `{
  "service": "trgt",
  "process": { "uptime_ms": 184320, "runtime": "edge" },
  "metrics": { "total_requests": 4283 }
}`,
  },
  {
    id: "admin-usage",
    section: "admin",
    method: "GET",
    path: "/api/admin/usage",
    title: "Admin usage",
    description: "Lighter sibling of /summary — only the in-memory counters block. Use for high-frequency polling.",
    auth: "admin",
    example: `{
  "service": "trgt",
  "total_requests": 4283,
  "per_route": [ { "route": "/api/health", "total": 1832 } ]
}`,
  },
  {
    id: "admin-audit",
    section: "admin",
    method: "GET",
    path: "/api/admin/audit",
    title: "Admin audit",
    description: "Recent admin / lifecycle events. Used by the Audit tab.",
    auth: "admin",
    example: `{ "ok": true, "events": [ { "ts": 1700000000, "route": "/api/admin/health", "status": 200 } ] }`,
  },
  {
    id: "admin-drivers",
    section: "admin",
    method: "GET",
    path: "/api/admin/drivers",
    title: "Driver roster",
    description: "Paginated list of users (drivers) with search. Backed by Prisma + D1.",
    auth: "admin",
    params: [
      { name: "q",     in: "query", description: "Substring match on email/username/name.", example: "max" },
      { name: "limit", in: "query", description: "Page size (max 100, default 25).",         example: "50" },
    ],
    example: `{
  "ok": true,
  "total": 1284,
  "drivers": [ { "email": "max@trgt.in", "totalPoints": 412, "isPro": true } ]
}`,
  },
  {
    id: "admin-races",
    section: "admin",
    method: "GET",
    path: "/api/admin/races",
    title: "Race schedule",
    description: "Race rounds for the season(s). Powers the Race Control tab.",
    auth: "admin",
    params: [
      { name: "season", in: "query", description: "Filter by season year.", example: "2025" },
    ],
    example: `{
  "ok": true,
  "races": [ { "round": 7, "name": "Imola GP", "status": "scheduled" } ]
}`,
  },
  {
    id: "admin-cloudflare",
    section: "admin",
    method: "GET",
    path: "/api/admin/cloudflare",
    title: "Cloudflare vault",
    description: "Server-side proxy of the Cloudflare REST API. Returns connected token, account, D1 dbs, KV, Workers.",
    auth: "admin",
    example: `{
  "ok": true,
  "account": { "id": "…", "name": "TRGT" },
  "d1": [ { "name": "trgt-prod" } ],
  "kv": [],
  "workers": [ { "id": "f1" } ]
}`,
  },
];
