<!-- =====================================================================
     TRGT — Target Every Lap
     An elite Formula 1 fan platform.
     ===================================================================== -->

<div align="center">

<img src="public/og-image.png" alt="TRGT — Target Every Lap" width="100%" />

# 🏁 TRGT &nbsp;·&nbsp; **Target Every Lap**

### A cinematic Formula 1 fan platform — live standings, race predictions, circuit telemetry, weather, and lap-by-lap intelligence.

<a href="https://trgt.in"><img src="https://img.shields.io/badge/Live-trgt.in-EE3F2C?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=000000" alt="Live" /></a>
<a href="https://trgt.in/standings"><img src="https://img.shields.io/badge/Standings-Live-FFFFFF?style=for-the-badge&labelColor=000000" alt="Standings" /></a>
<a href="https://trgt.in/predict"><img src="https://img.shields.io/badge/Predict-the%20Race-EE3F2C?style=for-the-badge&labelColor=000000" alt="Predict" /></a>
<a href="https://trgt.in/leaderboard"><img src="https://img.shields.io/badge/Leaderboard-Compete-FFFFFF?style=for-the-badge&labelColor=000000" alt="Leaderboard" /></a>

<br />

<a href="https://github.com/Abhinavv-007/f1/stargazers"><img src="https://img.shields.io/github/stars/Abhinavv-007/f1?style=flat-square&logo=github&color=EE3F2C&labelColor=000000" alt="Stars" /></a>
<a href="https://github.com/Abhinavv-007/f1/commits/main"><img src="https://img.shields.io/github/last-commit/Abhinavv-007/f1?style=flat-square&logo=git&color=EE3F2C&labelColor=000000" alt="Last commit" /></a>
<a href="https://github.com/Abhinavv-007/f1/pulse"><img src="https://img.shields.io/github/commit-activity/m/Abhinavv-007/f1?style=flat-square&logo=github&color=EE3F2C&labelColor=000000" alt="Commit activity" /></a>
<img src="https://img.shields.io/github/repo-size/Abhinavv-007/f1?style=flat-square&logo=files&color=EE3F2C&labelColor=000000" alt="Repo size" />
<img src="https://img.shields.io/github/languages/top/Abhinavv-007/f1?style=flat-square&logo=typescript&color=EE3F2C&labelColor=000000" alt="Top language" />
<img src="https://img.shields.io/github/contributors/Abhinavv-007/f1?style=flat-square&logo=github&color=EE3F2C&labelColor=000000" alt="Contributors" />

<br />

<sub><b>Lights out. Five red lights. <i>Go.</i></b></sub>

</div>

<br />

---

## ✦ What is TRGT?

> **TRGT** (read: <i>"target"</i>) is an elite Formula 1 fan platform built around three obsessions: <b>live race intelligence, predictive scoring, and a cinematic UI</b>. It surfaces the season schedule, an animated countdown to lights-out, a permanent driver and constructor leaderboard, circuit-by-circuit telemetry, weather, and a per-race prediction game with badges, points, and a global ranking.

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>📡 Live Race Session</h3>
      <p>An always-on countdown to the next session. Free Practice 1/2/3, Qualifying, Sprint, and Race timestamps for every Grand Prix on the 2026 calendar — auto-rolling forward as sessions complete.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🎯 Predict The Race</h3>
      <p>Lock in your podium, fastest lap, pole, and sprint picks before each round goes locked. Earn points based on accuracy. Climb the global leaderboard.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🏆 Standings & Leaderboards</h3>
      <p>Drivers' championship, constructors' championship, and a live <i>fan</i> leaderboard tracking prediction accuracy across the season. Every screen is a glassmorphic, motion-driven board.</p>
    </td>
    <td width="50%" valign="top">
      <h3>🛣 Circuit Intelligence</h3>
      <p>Per-circuit deep dives: weather (live OpenWeather), AI-generated circuit insight, lap distance, total race distance, and historical context. Built on edge runtime for low latency.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>👤 Profile & Badges</h3>
      <p>Sign in with Google (Firebase Auth). Earn collectible badges as you predict, share screenshots of your race tickets to socials, and track your historical accuracy.</p>
    </td>
    <td width="50%" valign="top">
      <h3>⚡ Edge-First, Cinematic</h3>
      <p>Next.js 16 + React 19 + Framer Motion + Tailwind 4 deployed to Cloudflare Pages with a Cloudflare D1 database adapter. Every API route runs at the edge.</p>
    </td>
  </tr>
</table>

---

## ✦ Architecture

```mermaid
flowchart LR
    subgraph Edge[🌐 Cloudflare Edge]
        UI[Next.js 16 App<br/>React 19 + Framer Motion]
        SES[/api/session<br/>edge runtime, 5 min cache/]
        STD[/api/standings<br/>edge, fallback JSON/]
        FCT[/api/facts<br/>edge, 10 min cache/]
        WTR[/api/weather<br/>edge, OpenWeather/]
    end
    UI --> SES
    UI --> STD
    UI --> FCT
    UI --> WTR
    UI --> Auth[Firebase Auth<br/>Google sign-in]
    UI --> D1[(Cloudflare D1<br/>via Prisma adapter)]
    Auth --> Profile[Predictions, Badges,<br/>Leaderboard history]
    D1 --> Profile
    WTR -.live.-> OpenWeather[OpenWeather API]
    SES -.optional.-> Remote[Remote schedule feed]
```

---

## ✦ Surfaces

| Route | Purpose |
| --- | --- |
| `/` | Hero, session countdown, headline standings, circuit teaser |
| `/standings` | Drivers + constructors championship boards |
| `/predict` | Lock in podium / pole / fastest-lap picks before lockout |
| `/leaderboard` | Global fan leaderboard ranked by prediction points |
| `/live` | Live race overlay with weather, countdown, circuit context |
| `/stats` | Season stats hub |
| `/stats/[circuitId]` | Per-circuit deep dive |
| `/profile` | Badges, history, your accuracy |
| `/login` | Google sign-in via Firebase |
| `/privacy` · `/terms` | Legal |

---

## ✦ API

All routes run on the **edge runtime** for sub-100ms response times.

| Method | Endpoint | Description | Cache |
| --- | --- | --- | --- |
| `GET` | `/api/session` | Current/next session snapshot from the 2026 calendar | 5 min |
| `GET` | `/api/standings` | Drivers + constructors championship | n/a |
| `GET` | `/api/facts?circuit=<id>&lap=<n>` | AI-generated circuit insight | 10 min |
| `GET` | `/api/weather?circuit=<id>` | Live weather at the circuit | 10 min |

Example:

```bash
curl https://trgt.in/api/session
curl "https://trgt.in/api/weather?circuit=monaco"
curl "https://trgt.in/api/facts?circuit=silverstone&lap=42"
```

---

## ✦ Tech Stack

<p>
  <img src="https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind%204-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
  <br />
  <img src="https://img.shields.io/badge/Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudflare%20D1-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" />
  <img src="https://img.shields.io/badge/Wrangler-F38020?style=for-the-badge&logo=cloudflareworkers&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma%207-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <br />
  <img src="https://img.shields.io/badge/Firebase%20Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenWeather-EB6E4B?style=for-the-badge&logo=openweather&logoColor=white" />
  <img src="https://img.shields.io/badge/Lucide-000000?style=for-the-badge&logo=lucide&logoColor=white" />
</p>

---

## ✦ Local Dev

```bash
git clone https://github.com/Abhinavv-007/f1.git
cd f1
npm install

# Generate the Prisma client first
npx prisma generate

# Run the dev server
npm run dev
# → http://localhost:3000
```

> Add a `.env.local` for the optional secrets:
> - `OPENWEATHER_KEY` — for `/api/weather`
> - `GEMINI_API_KEY` — if you wire `@google/generative-ai` into custom facts
> - `NEXT_PUBLIC_FIREBASE_*` — for Firebase auth

---

## ✦ Build & Deploy

```bash
# Standard Next build (webpack)
npm run build

# Cloudflare Pages build
npm run pages:build
npx wrangler pages deploy .vercel/output/static --project-name=f1
```

`wrangler.toml` is pre-configured to mount the static output as a Cloudflare Worker site.

---

## ✦ Project Layout

```text
f1/
├── prisma/
│   ├── schema.prisma         # User, Prediction, Badge, LeaderboardSnapshot
│   └── migration.sql
├── migrations/0001_init.sql  # D1 migration
├── src/
│   ├── app/
│   │   ├── (page.tsx, layout.tsx, globals.css)
│   │   ├── api/{session,standings,facts,weather}/route.ts  # edge routes
│   │   ├── standings/  predict/  leaderboard/  live/  stats/[circuitId]/
│   │   ├── profile/    login/    privacy/      terms/    actions/
│   ├── components/{auth, layout, legal, ui}
│   ├── data/           # calendar.json, circuits.json, drivers.json, teams.json, standings.json
│   ├── hooks/          # useRaceSession, etc.
│   └── lib/            # race.ts, badges.ts, prisma.ts, firebase.ts, http.ts
├── public/             # bg.mp4, og-image.png, brand assets
├── wrangler.toml
└── next.config.ts
```

---

## ✦ Roadmap (highlights)

- [x] 2026 calendar + session countdown
- [x] Drivers + constructors standings boards
- [x] Per-circuit weather + AI insight (Gemini)
- [x] Predict the race + global leaderboard
- [x] Firebase Google sign-in
- [x] Cloudflare D1 via Prisma adapter
- [ ] Live timing overlay (delta-to-leader)
- [ ] Sprint-only lockout flow
- [ ] Pro tier with private leagues

---

## ✦ Star History

<a href="https://star-history.com/#Abhinavv-007/f1&Date">
  <img src="https://api.star-history.com/svg?repos=Abhinavv-007/f1&type=Date" alt="Star history" width="100%" />
</a>

---

<div align="center">
  <sub>🏎 Built and engineered by <a href="https://abhnv.in"><b>Abhinav Raj</b></a> · ship every Sunday — race day.</sub>
  <br/>
  <a href="https://abhnv.in">Portfolio</a> · <a href="https://www.linkedin.com/in/abhnv07/">LinkedIn</a> · <a href="https://x.com/Abhnv8">X</a> · <a href="https://www.instagram.com/abhinavv.007/">Instagram</a>
  <br/><br/>
  <sub>📅 <i>Last impression </i><img src="https://img.shields.io/github/last-commit/Abhinavv-007/f1?style=flat-square&label=&color=EE3F2C&labelColor=000000" valign="middle" /> · <i>Total commits </i><img src="https://img.shields.io/github/commit-activity/t/Abhinavv-007/f1?style=flat-square&label=&color=EE3F2C&labelColor=000000" valign="middle" /></sub>
</div>
