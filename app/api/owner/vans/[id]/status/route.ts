import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { getOwnerForUser, getVanForOwner } from '@/lib/owner/auth';

const statusSchema = z.object({
  status: z.enum(['ACTIVE', 'PAUSED']),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const owner = await getOwnerForUser(user.id);
  if (!owner) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const van = await getVanForOwner(id, owner.id);
  if (!van) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (van.status === 'DRAFT') {
    return NextResponse.json({ error: 'Draft listings must be completed before changing status.' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  await prisma.van.update({
    where: { id: van.id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ status: parsed.data.status });
}
