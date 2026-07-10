# SurfScore

Closed-beta Sonoma Coast surf fishing forecast web application.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS v4
- **Prisma** + Supabase Postgres
- **Vercel**-ready deployment
- **Resend** for email (disabled by default via `DISABLE_EMAIL=true`)
- Provider-neutral **AI adapter** (OpenAI, Anthropic, Gemini) — explains scores only, never overrides measurements

## Features

1. Landing page with closed-beta positioning
2. Beta signup form
3. Daily Sonoma Coast fishing forecast
4. Deterministic 1–10 Surf Score
5. Best beach recommendation (8 beta locations; Salmon Creek excluded)
6. Best two-hour fishing window
7. Go / Maybe / No-Go rating
8. Confidence rating
9. Tide, swell, wind, and fish-behavior explanations
10. Recommended bait, lure, and rig
11. Safety warnings
12. Seven-day weekly forecast
13. Post-trip catch report
14. Admin dashboard (beta signups + catch reports)

## Monorepo layout

```
apps/
  web/           ← SurfScore (primary app, port 3000)
  festycamper/   ← preserved FestyCamper MVP (port 3001)
```

## Quick start

```bash
# From repository root
npm install

cd apps/web
cp .env.example .env
# Edit .env with your Supabase DATABASE_URL and DIRECT_URL

npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts (from root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start SurfScore dev server |
| `npm run build` | Production build |
| `npm run test` | Run unit tests (scoring + safety) |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run seed` | Seed beaches + demo data |
| `npm run dev:festycamper` | Run preserved FestyCamper app on :3001 |

## Surf Score architecture

Scores are **100% deterministic TypeScript** in `apps/web/lib/scoring/`. The AI layer (`lib/ai/`) may explain conditions but **cannot create, modify, or override** raw environmental measurements or scores.

Marine data flows through a typed provider interface (`lib/marine/`):

- `mock` — realistic deterministic mock data (default)
- `noaa` — placeholder for future NOAA CO-OPS / NDBC integration

Set `MARINE_DATA_PROVIDER=mock` in `.env`.

## Admin dashboard

Visit `/admin` and enter the `ADMIN_SECRET` from your `.env`.

## Deployment (Vercel)

1. Set root directory to `apps/web`
2. Add environment variables from `.env.example`
3. Run `prisma migrate deploy` in build or as a separate step

## Testing

```bash
npm run test        # from root
cd apps/web && npm run test
```

Tests cover surf score thresholds, factor weighting, best-window selection, and safety rule evaluation.

## Beta beaches

- Doran Beach
- Doran Jetty
- Dillon Beach
- Portuguese Beach
- Wrights Beach
- Shorttail Gulch
- Pinnacle Gulch
- Duncan's Cove

Salmon Creek is intentionally excluded from all recommendations.
