import { createHash, randomBytes } from 'crypto';
import { prisma } from '@/lib/db';

const TOKEN_BYTES = 32;
export const ACCESS_TOKEN_TTL_DAYS = 90;

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function generateAccessTokenValue() {
  return randomBytes(TOKEN_BYTES).toString('base64url');
}

export async function createBookingAccessToken(bookingId: string) {
  const token = generateAccessTokenValue();
  const expiresAt = new Date();
  expiresAt.setUTCDate(expiresAt.getUTCDate() + ACCESS_TOKEN_TTL_DAYS);

  await prisma.bookingAccessToken.create({
    data: {
      bookingId,
      tokenHash: hashToken(token),
      expiresAt,
    },
  });

  return token;
}

export async function getBookingByAccessToken(token: string) {
  const record = await prisma.bookingAccessToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      booking: {
        include: {
          festival: true,
          van: true,
          bundle: true,
          messages: { orderBy: { createdAt: 'asc' } },
        },
      },
    },
  });

  if (!record) return null;
  if (record.expiresAt.getTime() < Date.now()) return null;

  return { token: record, booking: record.booking };
}
