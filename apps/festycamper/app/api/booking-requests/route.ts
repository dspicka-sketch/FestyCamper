import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { calculateTotalCents } from '@/lib/pricing';

const schema = z.object({
  festivalId: z.string().min(1),
  vanId: z.string().min(1),
  bundleId: z.string().min(1),
  renterName: z.string().min(2),
  renterEmail: z.string().email(),
  renterPhone: z.string().optional(),
  guests: z.coerce.number().int().min(1).max(8),
  pickupType: z.string().min(1),
  notes: z.string().optional()
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { festivalId, vanId, bundleId, ...data } = parsed.data;
  const [festival, van, bundle, vanFestivalLink] = await Promise.all([
    prisma.festival.findUnique({ where: { id: festivalId } }),
    prisma.van.findUnique({ where: { id: vanId } }),
    prisma.bundle.findUnique({ where: { id: bundleId } }),
    prisma.vanFestival.findUnique({
      where: { vanId_festivalId: { vanId, festivalId } },
    }),
  ]);

  if (!festival || !van || !bundle) {
    return NextResponse.json({ error: 'Invalid festival, van, or bundle.' }, { status: 404 });
  }

  if (van.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'This van is not available for booking.' }, { status: 400 });
  }

  if (!vanFestivalLink) {
    return NextResponse.json({ error: 'This van is not available for the selected festival.' }, { status: 400 });
  }

  const nights = Math.max(1, Math.ceil((festival.endsAt.getTime() - festival.startsAt.getTime()) / 86400000));
  const totalCents = calculateTotalCents({
    nightlyRateCents: van.nightlyRateCents,
    cleaningFeeCents: van.cleaningFeeCents,
    bundlePriceCents: bundle.priceCents,
    nights
  });

  const booking = await prisma.bookingRequest.create({
    data: { festivalId, vanId, bundleId, totalCents, ...data }
  });

  return NextResponse.json({ bookingId: booking.id, totalCents: booking.totalCents });
}
