'use client';

import { dollarsToCents, estimateEarnings, formatUsd } from '@/lib/owner/earnings-estimate';
import type { PricingStepData } from '@/lib/owner/onboarding-types';
import { ownerInputClassName, ownerLabelClassName } from '@/components/owner/auth-ui';

type StepPricingProps = {
  data: PricingStepData;
  festivalCount: number;
  onChange: (data: PricingStepData) => void;
};

export function StepPricing({ data, festivalCount, onChange }: StepPricingProps) {
  function update(field: keyof PricingStepData, value: string | boolean) {
    onChange({ ...data, [field]: value });
  }

  const earnings = estimateEarnings({
    nightlyRateCents: dollarsToCents(data.nightlyRate),
    cleaningFeeCents: dollarsToCents(data.cleaningFee),
    minNights: parseInt(data.minNights, 10) || 2,
    weekendPricing: data.weekendPricing,
    weekendPremiumCents: dollarsToCents(data.weekendPremium),
    festivalCount,
  });

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={ownerLabelClassName} htmlFor="nightlyRate">
            Nightly Rate ($)
          </label>
          <input
            id="nightlyRate"
            type="number"
            min={0}
            step={1}
            className={ownerInputClassName}
            value={data.nightlyRate}
            onChange={(e) => update('nightlyRate', e.target.value)}
          />
        </div>
        <div>
          <label className={ownerLabelClassName} htmlFor="cleaningFee">
            Cleaning Fee ($)
          </label>
          <input
            id="cleaningFee"
            type="number"
            min={0}
            step={1}
            className={ownerInputClassName}
            value={data.cleaningFee}
            onChange={(e) => update('cleaningFee', e.target.value)}
          />
        </div>
        <div>
          <label className={ownerLabelClassName} htmlFor="securityDeposit">
            Security Deposit ($)
          </label>
          <input
            id="securityDeposit"
            type="number"
            min={0}
            step={1}
            className={ownerInputClassName}
            value={data.securityDeposit}
            onChange={(e) => update('securityDeposit', e.target.value)}
          />
        </div>
        <div>
          <label className={ownerLabelClassName} htmlFor="minNights">
            Minimum Nights
          </label>
          <input
            id="minNights"
            type="number"
            min={1}
            max={14}
            className={ownerInputClassName}
            value={data.minNights}
            onChange={(e) => update('minNights', e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-forest-950/50 p-5">
        <label className="flex cursor-pointer items-start gap-4">
          <input
            type="checkbox"
            checked={data.weekendPricing}
            onChange={(e) => update('weekendPricing', e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-forest-950 accent-amber-glow"
          />
          <div className="flex-1">
            <span className="block text-sm font-medium text-sand-100">Weekend pricing</span>
            <span className="mt-0.5 block text-sm text-sand-200/60">
              Charge a premium on Friday and Saturday nights during festival weekends.
            </span>
          </div>
        </label>
        {data.weekendPricing && (
          <div className="mt-4 pl-8">
            <label className={ownerLabelClassName} htmlFor="weekendPremium">
              Weekend premium per night ($)
            </label>
            <input
              id="weekendPremium"
              type="number"
              min={0}
              step={1}
              className={ownerInputClassName}
              value={data.weekendPremium}
              onChange={(e) => update('weekendPremium', e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-amber-glow/20 bg-gradient-to-br from-amber-glow/10 via-forest-900/80 to-forest-950/80">
        <div className="border-b border-amber-glow/10 px-5 py-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">
            Estimated earnings
          </p>
          <p className="mt-1 text-sm text-sand-200/60">
            Based on {earnings.nights}-night festival bookings across {Math.max(festivalCount, 1)}{' '}
            selected festival{Math.max(festivalCount, 1) === 1 ? '' : 's'} (after 15% platform fee)
          </p>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-sand-200/50">Per booking</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-sand-50">
              {formatUsd(earnings.perBookingNet)}
            </p>
            <p className="mt-1 text-sm text-sand-200/50">
              Gross {formatUsd(earnings.perBookingGross)}
            </p>
          </div>
          <div className="rounded-xl border border-amber-glow/20 bg-amber-glow/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-amber-glow/80">Season estimate</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-amber-glow">
              {formatUsd(earnings.seasonNet)}
            </p>
            <p className="mt-1 text-sm text-sand-200/50">
              Gross {formatUsd(earnings.seasonGross)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function validatePricing(data: PricingStepData): string | null {
  if (dollarsToCents(data.nightlyRate) <= 0) return 'Enter a valid nightly rate.';
  if (dollarsToCents(data.cleaningFee) < 0) return 'Cleaning fee cannot be negative.';
  if (dollarsToCents(data.securityDeposit) < 0) return 'Security deposit cannot be negative.';
  const minNights = parseInt(data.minNights, 10);
  if (Number.isNaN(minNights) || minNights < 1) return 'Minimum nights must be at least 1.';
  if (data.weekendPricing && dollarsToCents(data.weekendPremium) <= 0) {
    return 'Enter a weekend premium amount.';
  }
  return null;
}
