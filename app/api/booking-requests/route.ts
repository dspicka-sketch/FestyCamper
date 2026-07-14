import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { createBookingAccessToken } from '@/lib/booking/access-token';
import { findOverlappingApprovedBooking } from '@/lib/booking/conflicts';
import { parseDateInput, validateBookingDates } from '@/lib/booking/dates';
import { buildBookingEstimate } from '@/lib/pricing';

const schema = z.object({
  festivalId: z.string().min(1),
  vanId: z.string().min(1),
  bundleId: z.string().min(1),
  renterName: z.string().min(2),
  renterEmail: z.string().email(),
  renterPhone: z.string().optional(),
  guests: z.coerce.number().int().min(1).max(12),
  pickupType: z.string().min(1),
  arrivalAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  departureAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  renterMessage: z.string().max(4000).optional(),
  tripNeeds: z.string().max(4000).optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const {
    festivalId,
    vanId,
    bundleId,
    arrivalAt,
    departureAt,
    renterMessage,
    tripNeeds,
    ...data
  } = parsed.data;

  const arrival = parseDateInput(arrivalAt);
  const departure = parseDateInput(departureAt);

  const [festival, van, bundle, vanFestivalLink] = await Promise.all([
    prisma.festival.findUnique({ where: { id: festivalId } }),
    prisma.van.findUnique({ where: { id: vanId } }),
    prisma.bundle.findUnique({ where: { id: bundleId } }),
    prisma.vanFestival.findUnique({
      where: { vanId_festivalId: { vanId, festivalId } },
    }),
  ]);

  if (!festival || !van || !bundle) {
    return NextResponse.json({ error: 'Invalid festival, van, or package.' }, { status: 404 });
  }

  if (van.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'This van is not available for booking.' }, { status: 400 });
  }

  if (!vanFestivalLink) {
    return NextResponse.json({ error: 'This van is not available for the selected festival.' }, { status: 400 });
  }

  if (data.guests > van.sleeps) {
    return NextResponse.json(
      { error: `This van sleeps up to ${van.sleeps} guests.` },
      { status: 400 },
    );
  }

  const dates = validateBookingDates({
    arrivalAt: arrival,
    departureAt: departure,
    minNights: van.minNights,
  });

  if (!dates.ok) {
    return NextResponse.json({ error: dates.error }, { status: 400 });
  }

  const overlapping = await findOverlappingApprovedBooking({
    vanId,
    arrivalAt: arrival,
    departureAt: departure,
  });

  if (overlapping) {
    return NextResponse.json(
      { error: 'This RV already has approved dates that overlap your selected stay.' },
      { status: 409 },
    );
  }

  const estimate = buildBookingEstimate({
    nightlyRateCents: van.nightlyRateCents,
    cleaningFeeCents: van.cleaningFeeCents,
    bundlePriceCents: bundle.priceCents,
    nights: dates.nights,
  });

  const trimmedMessage = renterMessage?.trim() || undefined;
  const trimmedTripNeeds = tripNeeds?.trim() || undefined;

  const booking = await prisma.bookingRequest.create({
    data: {
      festivalId,
      vanId,
      bundleId,
      arrivalAt: arrival,
      departureAt: departure,
      nights: dates.nights,
      totalCents: estimate.totalCents,
      renterMessage: trimmedMessage,
      tripNeeds: trimmedTripNeeds,
      notes: trimmedMessage,
      ...data,
      messages: trimmedMessage
        ? {
            create: {
              senderRole: 'RENTER',
              body: trimmedMessage,
            },
          }
        : undefined,
    },
  });

  const accessToken = await createBookingAccessToken(booking.id);

  return NextResponse.json({
    bookingId: booking.id,
    accessToken,
    totalCents: booking.totalCents,
  });
}
