import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { getOwnerForUser, getVanForOwner } from '@/lib/owner/auth';
import { AMENITY_OPTIONS, FESTIVAL_OPTIONS } from '@/lib/owner/onboarding-constants';
import { dollarsToCents } from '@/lib/owner/earnings-estimate';

const updateSchema = z.object({
  year: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  trim: z.string(),
  sleeps: z.string(),
  seatbelts: z.string(),
  transmission: z.string(),
  fuelType: z.string(),
  location: z.string().min(1),
  amenities: z.array(z.string()).min(1),
  festivals: z.array(z.string()).min(1),
  nightlyRate: z.string(),
  cleaningFee: z.string(),
  securityDeposit: z.string(),
  minNights: z.string(),
  weekendPricing: z.boolean(),
  weekendPremium: z.string(),
});

function amenityLabel(id: string) {
  return AMENITY_OPTIONS.find((a) => a.id === id)?.label ?? id;
}

async function authorizeVan(vanId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const owner = await getOwnerForUser(user.id);
  if (!owner) return null;

  const van = await getVanForOwner(vanId, owner.id);
  if (!van) return null;

  return { owner, van };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authorizeVan(id);
  if (!auth) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid listing data' }, { status: 400 });
  }

  const data = parsed.data;
  const year = parseInt(data.year, 10);
  const sleeps = parseInt(data.sleeps, 10);
  const seatbelts = parseInt(data.seatbelts, 10);
  const minNights = parseInt(data.minNights, 10);

  if ([year, sleeps, seatbelts, minNights].some((n) => Number.isNaN(n))) {
    return NextResponse.json({ error: 'Invalid numeric fields' }, { status: 400 });
  }

  const name = [data.year, data.make, data.model].join(' ').trim();
  const amenitiesText = data.amenities.map(amenityLabel).join(', ');
  const festivalNames = data.festivals
    .map((festivalId) => FESTIVAL_OPTIONS.find((f) => f.id === festivalId)?.name ?? festivalId)
    .join(', ');

  const description = [
    data.trim ? `${data.trim} trim.` : null,
    `${data.transmission} transmission, ${data.fuelType} fuel.`,
    `Available for: ${festivalNames}.`,
  ]
    .filter(Boolean)
    .join(' ');

  const dbSlugs = data.festivals
    .map((festivalId) => FESTIVAL_OPTIONS.find((f) => f.id === festivalId)?.dbSlug ?? null)
    .filter((slug): slug is NonNullable<typeof slug> => slug !== null);

  const dbFestivals =
    dbSlugs.length > 0
      ? await prisma.festival.findMany({ where: { slug: { in: dbSlugs } } })
      : [];

  await prisma.$transaction(async (tx) => {
    await tx.van.update({
      where: { id: auth.van.id },
      data: {
        name,
        location: data.location,
        year,
        make: data.make,
        model: data.model,
        trim: data.trim || null,
        sleeps,
        seatbelts,
        transmission: data.transmission,
        fuelType: data.fuelType,
        minNights,
        weekendRateCents: data.weekendPricing ? dollarsToCents(data.weekendPremium) : null,
        nightlyRateCents: dollarsToCents(data.nightlyRate),
        cleaningFeeCents: dollarsToCents(data.cleaningFee),
        securityDepositCents: dollarsToCents(data.securityDeposit),
        description,
        amenities: amenitiesText,
        availableFestivals: data.festivals.join(','),
      },
    });

    await tx.vanFestival.deleteMany({ where: { vanId: auth.van.id } });

    if (dbFestivals.length > 0) {
      await tx.vanFestival.createMany({
        data: dbFestivals.map((festival) => ({
          vanId: auth.van.id,
          festivalId: festival.id,
        })),
        skipDuplicates: true,
      });
    }
  });

  return NextResponse.json({ ok: true });
}
