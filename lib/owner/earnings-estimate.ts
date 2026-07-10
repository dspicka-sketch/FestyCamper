type EarningsInput = {
  nightlyRateCents: number;
  cleaningFeeCents: number;
  minNights: number;
  weekendPricing: boolean;
  weekendPremiumCents: number;
  festivalCount: number;
};

const AVG_NIGHTS_PER_FESTIVAL = 4;
const PLATFORM_FEE_RATE = 0.15;

export function estimateEarnings(input: EarningsInput) {
  const {
    nightlyRateCents,
    cleaningFeeCents,
    minNights,
    weekendPricing,
    weekendPremiumCents,
    festivalCount,
  } = input;

  const nights = Math.max(minNights, AVG_NIGHTS_PER_FESTIVAL);
  const weekendNights = weekendPricing ? 2 : 0;
  const weekdayNights = nights - weekendNights;

  const nightlyTotal =
    weekdayNights * nightlyRateCents +
    weekendNights * (nightlyRateCents + weekendPremiumCents);

  const perBookingGross = nightlyTotal + cleaningFeeCents;
  const perBookingNet = Math.round(perBookingGross * (1 - PLATFORM_FEE_RATE));

  const festivalsBooked = Math.max(festivalCount, 1);
  const seasonGross = perBookingGross * festivalsBooked;
  const seasonNet = perBookingNet * festivalsBooked;

  return {
    perBookingGross,
    perBookingNet,
    seasonGross,
    seasonNet,
    nights,
    platformFeeRate: PLATFORM_FEE_RATE,
  };
}

export function formatUsd(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function dollarsToCents(value: string) {
  const parsed = parseFloat(value.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}
