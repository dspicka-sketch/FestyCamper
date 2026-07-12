import { PrismaClient } from '@prisma/client';
import { FESTIVAL_CATALOG, LEGACY_FESTIVAL_SLUGS } from '@/lib/festivals/catalog';

const prisma = new PrismaClient();

async function upsertFestivals() {
  for (const [legacySlug, canonicalSlug] of Object.entries(LEGACY_FESTIVAL_SLUGS)) {
    const legacy = await prisma.festival.findUnique({ where: { slug: legacySlug } });
    const canonical = await prisma.festival.findUnique({ where: { slug: canonicalSlug } });

    if (legacy && !canonical) {
      await prisma.festival.update({
        where: { id: legacy.id },
        data: { slug: canonicalSlug },
      });
    }
  }

  for (const festival of FESTIVAL_CATALOG) {
    await prisma.festival.upsert({
      where: { slug: festival.slug },
      create: {
        name: festival.name,
        slug: festival.slug,
        city: festival.city,
        state: festival.state,
        startsAt: festival.startsAt,
        endsAt: festival.endsAt,
        description: festival.description,
        campNotes: festival.campNotes,
      },
      update: {
        name: festival.name,
        city: festival.city,
        state: festival.state,
        startsAt: festival.startsAt,
        endsAt: festival.endsAt,
        description: festival.description,
        campNotes: festival.campNotes,
      },
    });
  }
}

async function seedDemoFleetIfEmpty() {
  const vanCount = await prisma.van.count();
  if (vanCount > 0) return;

  const festivals = await prisma.festival.findMany({
    where: { slug: { in: ['coachella', 'lightning-in-a-bottle'] } },
  });

  const owner = await prisma.owner.upsert({
    where: { email: 'owner@example.com' },
    create: { name: 'Pilot Fleet Owner', email: 'owner@example.com', phone: '555-555-1212' },
    update: {},
  });

  const vans = await Promise.all([
    prisma.van.create({
      data: {
        ownerId: owner.id,
        name: '2022 Mercedes-Benz Sprinter',
        location: 'Los Angeles, CA',
        year: 2022,
        make: 'Mercedes-Benz',
        model: 'Sprinter',
        sleeps: 2,
        nightlyRateCents: 24500,
        cleaningFeeCents: 12500,
        securityDepositCents: 150000,
        status: 'ACTIVE',
        transmission: 'Automatic',
        fuelType: 'Diesel',
        description: 'Compact festival-ready RV with queen bed, fridge, solar, and outdoor kitchen.',
        amenities: 'Kitchen, Solar, Bedding, Pet Friendly',
        rules: 'Festival use approved. No smoking inside. Dust cleaning fee may apply.',
        availableFestivals: 'coachella,lightning-in-a-bottle',
      },
    }),
    prisma.van.create({
      data: {
        ownerId: owner.id,
        name: '2021 Ford Transit',
        location: 'San Francisco, CA',
        year: 2021,
        make: 'Ford',
        model: 'Transit',
        sleeps: 3,
        nightlyRateCents: 32500,
        cleaningFeeCents: 17500,
        securityDepositCents: 200000,
        status: 'ACTIVE',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        description: 'Premium build for festival camping with solar, awning, and indoor lounge.',
        amenities: 'Solar, Awning, Kitchen, Air Conditioning, Starlink',
        rules: 'Festival use approved with inspection. No roof access. No off-road driving.',
        availableFestivals: 'coachella,lightning-in-a-bottle,outside-lands',
      },
    }),
  ]);

  for (const festival of festivals) {
    for (const van of vans) {
      await prisma.vanFestival.upsert({
        where: { vanId_festivalId: { vanId: van.id, festivalId: festival.id } },
        create: { festivalId: festival.id, vanId: van.id },
        update: {},
      });
    }
  }

  const bundleCount = await prisma.bundle.count();
  if (bundleCount === 0) {
    await prisma.bundle.createMany({
      data: [
        {
          name: 'Base Camp',
          slug: 'base-camp',
          priceCents: 9900,
          description: 'The essentials for sleeping comfortably at the festival.',
          includes: 'Fresh bedding, camp chairs, lantern, basic kitchen kit',
        },
        {
          name: 'Comfort Camp',
          slug: 'comfort-camp',
          priceCents: 24900,
          description: 'More shade, power, and comfort for a full festival weekend.',
          includes: 'Base Camp plus shade canopy, power station, rug, cooler, extra towels',
        },
        {
          name: 'VIP Drop-Off',
          slug: 'vip-drop-off',
          priceCents: 59900,
          description: 'Turnkey handoff near the festival with setup support.',
          includes: 'Comfort Camp plus delivery coordination, water pack, ice pack, pre-trip walkthrough',
        },
      ],
    });
  }
}

async function main() {
  await upsertFestivals();
  await seedDemoFleetIfEmpty();
}

main().finally(() => prisma.$disconnect());
