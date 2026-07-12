import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({ status: z.enum(['APPROVED', 'DECLINED', 'CANCELLED']) });

function adminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase();

  if (!email || !adminEmails().has(email)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid booking status.' }, { status: 400 });
  }

  const { id } = await params;
  const booking = await prisma.bookingRequest.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  if (booking.status === 'PAID') {
    return NextResponse.json({ error: 'Paid bookings cannot be changed here.' }, { status: 409 });
  }

  const updated = await prisma.bookingRequest.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ id: updated.id, status: updated.status });
}
