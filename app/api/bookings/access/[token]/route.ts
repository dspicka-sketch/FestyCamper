import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getBookingByAccessToken } from '@/lib/booking/access-token';
import { prisma } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await getBookingByAccessToken(token);

  if (!result) {
    return NextResponse.json({ error: 'Invalid or expired booking link.' }, { status: 404 });
  }

  const { booking } = result;

  return NextResponse.json({
    booking: {
      id: booking.id,
      status: booking.status,
      renterName: booking.renterName,
      renterEmail: booking.renterEmail,
      guests: booking.guests,
      pickupType: booking.pickupType,
      arrivalAt: booking.arrivalAt,
      departureAt: booking.departureAt,
      nights: booking.nights,
      totalCents: booking.totalCents,
      renterMessage: booking.renterMessage,
      tripNeeds: booking.tripNeeds,
      declineReason: booking.declineReason,
      depositPaidCents: booking.depositPaidCents,
      approvedAt: booking.approvedAt,
      festival: booking.festival,
      van: { id: booking.van.id, name: booking.van.name },
      bundle: booking.bundle,
    },
    messages: booking.messages,
  });
}

const messageSchema = z.object({
  body: z.string().trim().min(1).max(4000),
});

export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const result = await getBookingByAccessToken(token);

  if (!result) {
    return NextResponse.json({ error: 'Invalid or expired booking link.' }, { status: 404 });
  }

  const parsed = messageSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }

  const { booking } = result;

  if (booking.status === 'DECLINED' || booking.status === 'CANCELLED') {
    return NextResponse.json({ error: 'This booking request is closed.' }, { status: 409 });
  }

  const message = await prisma.bookingMessage.create({
    data: {
      bookingId: booking.id,
      senderRole: 'RENTER',
      body: parsed.data.body,
    },
  });

  await prisma.bookingRequest.update({
    where: { id: booking.id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({ message });
}
