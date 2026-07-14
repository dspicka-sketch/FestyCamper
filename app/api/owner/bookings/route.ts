import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getOwnerForUser } from '@/lib/owner/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const owner = await getOwnerForUser(user.id);
  if (!owner) {
    return NextResponse.json({ error: 'Owner profile not found.' }, { status: 404 });
  }

  const bookings = await prisma.bookingRequest.findMany({
    where: { van: { ownerId: owner.id } },
    include: {
      festival: true,
      van: { select: { id: true, name: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ bookings });
}
