import { prisma } from '@/lib/db';
import { datesOverlap } from '@/lib/booking/dates';

export async function findOverlappingApprovedBooking(input: {
  vanId: string;
  arrivalAt: Date;
  departureAt: Date;
  excludeBookingId?: string;
}) {
  const candidates = await prisma.bookingRequest.findMany({
    where: {
      vanId: input.vanId,
      status: { in: ['APPROVED', 'PAID'] },
      ...(input.excludeBookingId ? { id: { not: input.excludeBookingId } } : {}),
    },
    select: {
      id: true,
      arrivalAt: true,
      departureAt: true,
    },
  });

  return (
    candidates.find((booking) =>
      datesOverlap(input.arrivalAt, input.departureAt, booking.arrivalAt, booking.departureAt),
    ) ?? null
  );
}
