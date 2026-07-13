export function calculateTotalCents(input: {
  nightlyRateCents: number;
  cleaningFeeCents: number;
  bundlePriceCents: number;
  nights: number;
}) {
  return input.nightlyRateCents * input.nights + input.cleaningFeeCents + input.bundlePriceCents;
}

export type BookingEstimate = {
  nights: number;
  nightlyRateCents: number;
  nightlySubtotalCents: number;
  cleaningFeeCents: number;
  bundlePriceCents: number;
  totalCents: number;
};

export function buildBookingEstimate(input: {
  nightlyRateCents: number;
  cleaningFeeCents: number;
  bundlePriceCents: number;
  nights: number;
}): BookingEstimate {
  const nightlySubtotalCents = input.nightlyRateCents * input.nights;
  return {
    nights: input.nights,
    nightlyRateCents: input.nightlyRateCents,
    nightlySubtotalCents,
    cleaningFeeCents: input.cleaningFeeCents,
    bundlePriceCents: input.bundlePriceCents,
    totalCents: nightlySubtotalCents + input.cleaningFeeCents + input.bundlePriceCents,
  };
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(cents / 100);
}
