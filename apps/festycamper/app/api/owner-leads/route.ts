import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const schema = z.object({
  ownerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  vanYearMakeModel: z.string().min(2),
  sleeps: z.coerce.number().int().min(1).max(12),
  homeCity: z.string().min(2),
  nightlyRate: z.coerce.number().positive(),
  festivalAvailability: z.string().min(2),
  photosUrl: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { nightlyRate, photosUrl, ...data } = parsed.data;
  const nightlyRateCents = Math.round(nightlyRate * 100);

  const lead = await prisma.ownerLead.create({
    data: {
      ...data,
      nightlyRateCents,
      photosUrl: photosUrl || null,
      phone: data.phone || null,
      notes: data.notes || null,
    },
  });

  return NextResponse.json({ leadId: lead.id });
}
