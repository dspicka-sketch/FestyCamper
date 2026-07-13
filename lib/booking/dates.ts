const MS_PER_DAY = 86_400_000;

export function parseDateInput(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function calculateNights(arrivalAt: Date, departureAt: Date): number {
  const start = Date.UTC(arrivalAt.getUTCFullYear(), arrivalAt.getUTCMonth(), arrivalAt.getUTCDate());
  const end = Date.UTC(departureAt.getUTCFullYear(), departureAt.getUTCMonth(), departureAt.getUTCDate());
  const nights = Math.round((end - start) / MS_PER_DAY);
  return Math.max(1, nights);
}

export function validateBookingDates(input: {
  arrivalAt: Date;
  departureAt: Date;
  minNights: number;
}) {
  const nights = calculateNights(input.arrivalAt, input.departureAt);

  if (nights < 1) {
    return { ok: false as const, error: 'Departure must be after arrival.' };
  }

  if (nights < input.minNights) {
    return {
      ok: false as const,
      error: `This van requires a minimum stay of ${input.minNights} night${input.minNights === 1 ? '' : 's'}.`,
    };
  }

  return { ok: true as const, nights };
}

export function datesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  const a0 = parseDateInput(formatDateInput(aStart)).getTime();
  const a1 = parseDateInput(formatDateInput(aEnd)).getTime();
  const b0 = parseDateInput(formatDateInput(bStart)).getTime();
  const b1 = parseDateInput(formatDateInput(bEnd)).getTime();
  return a0 < b1 && b0 < a1;
}
