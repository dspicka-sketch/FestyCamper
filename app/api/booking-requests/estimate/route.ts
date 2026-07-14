import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { parseDateInput, validateBookingDates } from '@/lib/booking/dates';
import { buildBookingEstimate } from '@/lib/pricing';

const schema = z.object({
  vanId: z.string().min(1),
  bundleId: z.string().min(1),
  arrivalAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  departureAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid estimate request.' }, { status: 400 });
  }

  const { vanId, bundleId, arrivalAt, departureAt } = parsed.data;
  const [van, bundle] = await Promise.all([
    prisma.van.findUnique({ where: { id: vanId } }),
    prisma.bundle.findUnique({ where: { id: bundleId } }),
  ]);

  if (!van || !bundle) {
    return NextResponse.json({ error: 'Invalid van or package.' }, { status: 404 });
  }

  const dates = validateBookingDates({
    arrivalAt: parseDateInput(arrivalAt),
    departureAt: parseDateInput(departureAt),
    minNights: van.minNights,
  });

  if (!dates.ok) {
    return NextResponse.json({ error: dates.error }, { status: 400 });
  }

  const estimate = buildBookingEstimate({
    nightlyRateCents: van.nightlyRateCents,
    cleaningFeeCents: van.cleaningFeeCents,
    bundlePriceCents: bundle.priceCents,
    nights: dates.nights,
  });

  return NextResponse.json(estimate);
}
