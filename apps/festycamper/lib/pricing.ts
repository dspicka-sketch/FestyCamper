export function calculateTotalCents(input: {
  nightlyRateCents: number;
  cleaningFeeCents: number;
  bundlePriceCents: number;
  nights: number;
}) {
  return input.nightlyRateCents * input.nights + input.cleaningFeeCents + input.bundlePriceCents;
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(cents / 100);
}
