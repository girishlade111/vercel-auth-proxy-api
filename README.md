# PaceBeats — Spotify × Strava Integration

**PaceBeats** ("Run to the Perfect Beat") analyzes your Strava running routes and builds custom Spotify playlists with the perfect BPM to help you hit your target pace — even on hills. Sign in with Spotify and Strava via OAuth, pick a route, and generate a tempo-matched playlist.

This Next.js app also works as an **auth proxy layer**: server-side API routes hold the OAuth client secrets and proxy Spotify/Strava calls so the browser never sees them.

Built by Girish Lade — https://ladestack.in

## What it does

- **Spotify OAuth sign-in** — NextAuth-powered auth flow (`/api/auth/[...nextauth]`), sign-in/error pages included.
- **Strava route import** — fetch your routes (`/strava-routes`, `/api/strava/routes`), inspect a route's detail (`/routes/[id]`).
- **BPM calculator** — `lib/bpm-calculator.ts` derives a target tempo from pace/grade so music matches your stride.
- **Playlist generation** — search Spotify tracks by BPM (`/api/spotify/search-by-bpm`) and create playlists (`/create-playlist`, `/api/spotify/create-playlist`, `/api/spotify/generate-playlist`).
- **Library browsing** — view your Spotify playlists and profile (`/playlists`, `/profile`).
- **Demo mode** — `lib/mock-data.ts` + `demo-mode-indicator.tsx` let you explore the full UI without any API keys.
- **Debug/admin tooling** — `/admin/auth-debug`, `/admin/strava-debug`, `/spotify-proxy-test`, `/api/debug/*` panels for inspecting env config, connection status, and proxy health.
- **Route health check** — `GET /api/health` → `{ status: "ok", timestamp }`.
- **Env validation** — `lib/env-validation.ts` fails fast with clear errors when required variables are missing.
- **Maps proxy** — `/api/maps/static` proxies static-map tiles so API keys stay server-side.
- Dark / light mode (`next-themes`), shadcn/ui + Tailwind, responsive layout.

## Tech stack

- [Next.js](https://nextjs.org/) 15 (App Router, React 19) + [TypeScript](https://www.typescriptlang.org/)
- [NextAuth.js](https://next-auth.js.org/) (Auth.js) — Spotify + Strava OAuth providers
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api) — playlists, profile, search, audio features
- [Strava API v3](https://developers.strava.com/) — routes, athlete tokens
- [lucide-react](https://lucide.dev/) icons, [recharts](https://recharts.org/), [nodemailer](https://nodemailer.com/)
- `middleware.ts` — route protection / auth guard

## Quick start

Requires Node.js 18+ and npm.

```sh
# 1. Clone
git clone https://github.com/girishlade111/vercel-auth-proxy-api.git
cd vercel-auth-proxy-api

# 2. Install
npm install --legacy-peer-deps

# 3. Configure (see "Environment variables" below)
cp .env.example .env.local  # if present, else create .env.local

# 4. Dev server
npm run dev
# → http://localhost:3000
```

Without API keys the app runs in **demo mode** — all pages work against mock data.

## Environment variables

| Variable | Required for | Notes |
|---|---|---|
| `NEXTAUTH_URL` | Full OAuth flow | e.g. `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Session encryption | Random 32+ char string |
| `SPOTIFY_CLIENT_ID` | Spotify OAuth + API | [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) |
| `SPOTIFY_CLIENT_SECRET` | Spotify OAuth + API | Same dashboard |
| `STRAVA_CLIENT_ID` | Strava OAuth + API | Numeric. [Strava API settings](https://www.strava.com/settings/api) |
| `STRAVA_CLIENT_SECRET` | Strava OAuth + API | Same settings page |
| `MAPBOX_TOKEN` / `GOOGLE_MAPS_KEY` | Static-map proxy (`/api/maps/static`) | Only if you use that route |

Redirect URIs to register:
- Spotify: `<NEXTAUTH_URL>/api/auth/callback/spotify`
- Strava: callback domain = your app's domain (no scheme)

## Project structure

```
vercel-auth-proxy-api/
├── app/
│   ├── page.tsx                  # Landing: "Run to the Perfect Beat"
│   ├── dashboard/                # Main app dashboard
│   ├── create-playlist/          # BPM playlist builder
│   ├── playlists/ profile/       # Spotify library + profile
│   ├── routes/ strava-routes/    # Strava route browsing + detail
│   ├── algorithm/                # Explains the BPM algorithm
│   ├── test-runs/                # Example runs (parkrun, fun run)
│   ├── auth/signin/ auth/error/  # NextAuth pages
│   ├── admin/auth-debug/ admin/strava-debug/  # Debug consoles
│   ├── spotify-proxy-test/ spotify-test/ strava-test/
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth handler
│       ├── spotify/*             # Server-side Spotify proxy routes
│       ├── strava/*              # Server-side Strava proxy routes
│       ├── admin/check-strava-env/ admin/test-spotify-connection/
│       ├── maps/static/          # Static-map proxy
│       ├── routes/               # Local route CRUD
│       ├── check-env/ debug/ health/
├── lib/
│   ├── auth.ts auth-utils.ts auth-proxy.ts  # Session + proxy helpers
│   ├── spotify.ts spotify-auth.ts spotify-proxy.ts
│   ├── strava.ts
│   ├── bpm-calculator.ts         # Pace → BPM algorithm
│   ├── env-validation.ts         # Startup env check
│   └── mock-data.ts              # Demo-mode data
├── components/                   # App components (dashboard-client, connect-accounts…)
├── components/ui/                # shadcn/ui primitives
├── middleware.ts                 # Auth middleware
└── next.config.mjs
```

## How it works

1. User signs in with Spotify (NextAuth); optionally connects Strava in `/connect` (`connect-accounts.tsx`).
2. App fetches Strava routes server-side (`/api/strava/routes`) — tokens stay on the server.
3. `bpm-calculator.ts` converts target pace + elevation into a target BPM range.
4. Server searches Spotify for tracks in that BPM window and creates a playlist via `/api/spotify/create-playlist`.
5. Every third-party call goes through a server route, so client secrets are never exposed to the browser — that's the "auth proxy" pattern this repo is named for.

## Deployment notes

- **Needs a Node server (SSR)** — cannot be statically exported: API routes, NextAuth, middleware, and server actions require runtime execution.
- Natural fit: **Vercel** (`vercel deploy`) or any Node host (`npm run build && npm run start`).
- Set all environment variables on the host; never commit `.env*` (it's gitignored).
- Static deploy skipped deliberately — no GitHub Pages/Netlify deploy for this repo (server + OAuth secrets required).

---

Built by Girish Lade — https://ladestack.in
