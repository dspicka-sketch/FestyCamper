export const DEPOSIT_AMOUNT_CENTS = 250_00;

const PLACEHOLDER_STRIPE_KEYS = new Set([
  'sk_test_placeholder',
  'sk_test_replace_me',
  'sk_test_your_key_here',
  'sk_live_replace_me',
]);

export function isStripeConfigured() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return false;
  if (PLACEHOLDER_STRIPE_KEYS.has(key)) return false;
  return key.startsWith('sk_test_') || key.startsWith('sk_live_');
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}
