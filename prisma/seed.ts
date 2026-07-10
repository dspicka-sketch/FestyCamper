import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.bookingRequest.deleteMany();
  await prisma.vanPhoto.deleteMany();
  await prisma.vanFestival.deleteMany();
  await prisma.bundle.deleteMany();
  await prisma.van.deleteMany();
  await prisma.owner.deleteMany();
  await prisma.festival.deleteMany();

  const festivals = await Promise.all([
    prisma.festival.create({ data: {
      name: 'Coachella Weekend 1', slug: 'coachella-weekend-1', city: 'Indio', state: 'CA',
      startsAt: new Date('2027-04-09'), endsAt: new Date('2027-04-12'),
      description: 'Desert festival camping with premium van packages and delivery options.',
      campNotes: 'Best for renters who want shade, solar, bedding, and turnkey setup.'
    }}),
    prisma.festival.create({ data: {
      name: 'Lightning in a Bottle', slug: 'lightning-in-a-bottle', city: 'Buena Vista Lake', state: 'CA',
      startsAt: new Date('2027-05-19'), endsAt: new Date('2027-05-24'),
      description: 'Festival-friendly vans for long weekend camping and group setups.',
      campNotes: 'Recommend solar, dust mats, shade canopy, and extra water package.'
    }})
  ]);

  const owner = await prisma.owner.create({ data: { name: 'Pilot Fleet Owner', email: 'owner@example.com', phone: '555-555-1212' }});

  const vans = await Promise.all([
    prisma.van.create({ data: {
      ownerId: owner.id, name: 'Desert Rambler', location: 'Los Angeles, CA', sleeps: 2,
      nightlyRateCents: 24500, cleaningFeeCents: 12500, securityDepositCents: 150000,
      status: 'PUBLISHED',
      description: 'Compact festival-ready RV with queen bed, fridge, solar, and outdoor kitchen.',
      amenities: 'Queen bed, fridge, solar, camp stove, bedding, USB power, privacy shades',
      rules: 'Festival use approved. No smoking inside. Dust cleaning fee may apply.'
    }}),
    prisma.van.create({ data: {
      ownerId: owner.id, name: 'Bass Camp Sprinter', location: 'San Francisco, CA', sleeps: 3,
      nightlyRateCents: 32500, cleaningFeeCents: 17500, securityDepositCents: 200000,
      status: 'PUBLISHED',
      description: 'Premium Sprinter build for festival camping with solar, awning, and indoor lounge.',
      amenities: 'Solar, awning, kitchenette, bedding, folding table, camp chairs, power station',
      rules: 'Festival use approved with inspection. No roof access. No off-road driving.'
    }})
  ]);

  for (const festival of festivals) for (const van of vans) {
    await prisma.vanFestival.create({ data: { festivalId: festival.id, vanId: van.id }});
  }

  await prisma.bundle.createMany({ data: [
    { name: 'Base Camp', slug: 'base-camp', priceCents: 9900, description: 'The essentials for sleeping comfortably at the festival.', includes: 'Fresh bedding, camp chairs, lantern, basic kitchen kit' },
    { name: 'Comfort Camp', slug: 'comfort-camp', priceCents: 24900, description: 'More shade, power, and comfort for a full festival weekend.', includes: 'Base Camp plus shade canopy, power station, rug, cooler, extra towels' },
    { name: 'VIP Drop-Off', slug: 'vip-drop-off', priceCents: 59900, description: 'Turnkey handoff near the festival with setup support.', includes: 'Comfort Camp plus delivery coordination, water pack, ice pack, pre-trip walkthrough' }
  ]});
}

main().finally(() => prisma.$disconnect());
