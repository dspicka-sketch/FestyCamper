import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { FESTIVAL_OPTIONS, AMENITY_OPTIONS } from '@/lib/owner/onboarding-constants';
import { dollarsToCents } from '@/lib/owner/earnings-estimate';

const photoSchema = z.object({
  id: z.string(),
  storagePath: z.string(),
  publicUrl: z.string().url(),
  fileName: z.string(),
  progress: z.number(),
  status: z.enum(['pending', 'uploading', 'done', 'error']),
  isCover: z.boolean(),
});

const publishSchema = z.object({
  ownerEmail: z.string().email(),
  vehicle: z.object({
    year: z.string().min(1),
    make: z.string().min(1),
    model: z.string().min(1),
    trim: z.string(),
    sleeps: z.string(),
    seatbelts: z.string(),
    transmission: z.string(),
    fuelType: z.string(),
  }),
  photos: z.array(photoSchema).min(1),
  amenities: z.array(z.string()).min(1),
  festivals: z.array(z.string()).min(1),
  pricing: z.object({
    nightlyRate: z.string(),
    cleaningFee: z.string(),
    securityDeposit: z.string(),
    minNights: z.string(),
    weekendPricing: z.boolean(),
    weekendPremium: z.string(),
  }),
});

function amenityLabel(id: string) {
  return AMENITY_OPTIONS.find((a) => a.id === id)?.label ?? id;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = publishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid listing data' }, { status: 400 });
  }

  const { vehicle, photos, amenities, festivals, pricing, ownerEmail } = parsed.data;

  const donePhotos = photos.filter((p) => p.status === 'done');
  if (donePhotos.length === 0) {
    return NextResponse.json({ error: 'At least one uploaded photo is required' }, { status: 400 });
  }

  const cover = donePhotos.find((p) => p.isCover) ?? donePhotos[0];
  const year = parseInt(vehicle.year, 10);
  const sleeps = parseInt(vehicle.sleeps, 10);
  const seatbelts = parseInt(vehicle.seatbelts, 10);
  const minNights = parseInt(pricing.minNights, 10);

  if ([year, sleeps, seatbelts, minNights].some((n) => Number.isNaN(n))) {
    return NextResponse.json({ error: 'Invalid numeric fields' }, { status: 400 });
  }

  const name = [vehicle.year, vehicle.make, vehicle.model].join(' ').trim();
  const amenitiesText = amenities.map(amenityLabel).join(', ');
  const festivalNames = festivals
    .map((id) => FESTIVAL_OPTIONS.find((f) => f.id === id)?.name ?? id)
    .join(', ');

  const description = [
    vehicle.trim ? `${vehicle.trim} trim.` : null,
    `${vehicle.transmission} transmission, ${vehicle.fuelType} fuel.`,
    `Available for: ${festivalNames}.`,
  ]
    .filter(Boolean)
    .join(' ');

  const owner =
    (await prisma.owner.findUnique({ where: { supabaseUserId: user.id } })) ??
    (await prisma.owner.findUnique({ where: { email: ownerEmail } })) ??
    (await prisma.owner.create({
      data: {
        name: ownerEmail.split('@')[0] || 'Owner',
        email: ownerEmail,
        supabaseUserId: user.id,
      },
    }));

  if (!owner.supabaseUserId) {
    await prisma.owner.update({
      where: { id: owner.id },
      data: { supabaseUserId: user.id },
    });
  }

  const van = await prisma.van.create({
    data: {
      ownerId: owner.id,
      name,
      location: 'California, USA',
      year,
      make: vehicle.make,
      model: vehicle.model,
      trim: vehicle.trim || null,
      sleeps,
      seatbelts,
      transmission: vehicle.transmission,
      fuelType: vehicle.fuelType,
      minNights,
      weekendRateCents: pricing.weekendPricing ? dollarsToCents(pricing.weekendPremium) : null,
      coverPhotoUrl: cover.publicUrl,
      status: 'ACTIVE',
      publishedAt: new Date(),
      nightlyRateCents: dollarsToCents(pricing.nightlyRate),
      cleaningFeeCents: dollarsToCents(pricing.cleaningFee),
      securityDepositCents: dollarsToCents(pricing.securityDeposit),
      festivalFriendly: true,
      description,
      amenities: amenitiesText,
      rules: 'Festival use approved. No smoking inside. Return van in similar condition.',
      availableFestivals: festivals.join(','),
      photos: {
        create: donePhotos.map((photo, index) => ({
          storagePath: photo.storagePath,
          publicUrl: photo.publicUrl,
          sortOrder: index,
          isCover: photo.id === cover.id,
        })),
      },
    },
  });

  const dbSlugs = festivals
    .map((id) => FESTIVAL_OPTIONS.find((f) => f.id === id)?.dbSlug ?? null)
    .filter((slug): slug is NonNullable<typeof slug> => slug !== null);

  if (dbSlugs.length > 0) {
    const dbFestivals = await prisma.festival.findMany({
      where: { slug: { in: dbSlugs } },
    });

    await prisma.vanFestival.createMany({
      data: dbFestivals.map((festival) => ({
        vanId: van.id,
        festivalId: festival.id,
      })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json({ id: van.id });
}
