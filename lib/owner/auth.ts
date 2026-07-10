import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getOwnerForUser(userId: string) {
  return prisma.owner.findUnique({ where: { supabaseUserId: userId } });
}

export async function requireOwnerSession(nextPath: string) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect(`/owner/login?next=${encodeURIComponent(nextPath)}`);
  }

  const owner = await getOwnerForUser(user.id);
  return { user, owner };
}

export async function getVanForOwner(vanId: string, ownerId: string) {
  return prisma.van.findFirst({
    where: { id: vanId, ownerId },
    include: {
      photos: { orderBy: { sortOrder: 'asc' } },
      festivals: { include: { festival: true } },
    },
  });
}
