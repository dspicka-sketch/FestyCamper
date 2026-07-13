import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { findOverlappingApprovedBooking } from '@/lib/booking/conflicts';
import { getOwnerBooking, getOwnerForUser } from '@/lib/owner/auth';
import { createClient } from '@/lib/supabase/server';

const statusSchema = z.object({
  status: z.enum(['APPROVED', 'DECLINED']),
  declineReason: z.string().max(1000).optional(),
});

const messageSchema = z.object({
  body: z.string().trim().min(1).max(4000),
});

async function getAuthenticatedOwner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const owner = await getOwnerForUser(user.id);
  if (!owner) return null;

  return owner;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await params;
  const booking = await getOwnerBooking(id, owner.id);

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }

  return NextResponse.json({ booking });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const parsed = statusSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status update.' }, { status: 400 });
  }

  const { id } = await params;
  const booking = await getOwnerBooking(id, owner.id);

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }

  if (booking.status === 'PAID') {
    return NextResponse.json({ error: 'Paid bookings cannot be changed.' }, { status: 409 });
  }

  if (booking.status === 'DECLINED' || booking.status === 'CANCELLED') {
    return NextResponse.json({ error: 'This booking is already closed.' }, { status: 409 });
  }

  if (parsed.data.status === 'APPROVED') {
    const overlapping = await findOverlappingApprovedBooking({
      vanId: booking.vanId,
      arrivalAt: booking.arrivalAt,
      departureAt: booking.departureAt,
      excludeBookingId: booking.id,
    });

    if (overlapping) {
      return NextResponse.json(
        { error: 'These dates overlap another approved booking for this van.' },
        { status: 409 },
      );
    }
  }

  const updated = await prisma.bookingRequest.update({
    where: { id: booking.id },
    data: {
      status: parsed.data.status,
      approvedAt: parsed.data.status === 'APPROVED' ? new Date() : null,
      declineReason: parsed.data.status === 'DECLINED' ? parsed.data.declineReason?.trim() || null : null,
    },
  });

  return NextResponse.json({ id: updated.id, status: updated.status });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const parsed = messageSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
  }

  const { id } = await params;
  const booking = await getOwnerBooking(id, owner.id);

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }

  if (booking.status === 'DECLINED' || booking.status === 'CANCELLED') {
    return NextResponse.json({ error: 'This booking request is closed.' }, { status: 409 });
  }

  const message = await prisma.bookingMessage.create({
    data: {
      bookingId: booking.id,
      senderRole: 'OWNER',
      body: parsed.data.body,
    },
  });

  await prisma.bookingRequest.update({
    where: { id: booking.id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({ message });
}
