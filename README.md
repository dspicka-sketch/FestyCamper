# FestyCamper MVP

Festival-focused RV bundled marketplace.

## Features
- Festival landing pages
- Van listings with festival-friendly rules
- Bundled packages: Base Camp, Comfort, VIP Drop-Off
- Booking request flow
- Owner supply intake
- Admin request queue
- Prisma schema with seed data
- Stripe placeholder ready for checkout integration

## Run locally
```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Open http://localhost:3000
