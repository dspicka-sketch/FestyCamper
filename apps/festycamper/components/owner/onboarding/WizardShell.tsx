'use client';

import { ONBOARDING_STEPS } from '@/lib/owner/onboarding-constants';

type WizardShellProps = {
  currentStep: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function WizardShell({ currentStep, title, subtitle, children, footer }: WizardShellProps) {
  const progress = ((currentStep - 1) / (ONBOARDING_STEPS.length - 1)) * 100;

  return (
    <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Add your first van</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-sand-50 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-base text-sand-200/70">{subtitle}</p>
      </div>

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs font-medium text-sand-200/50">
          <span>
            Step {currentStep} of {ONBOARDING_STEPS.length}
          </span>
          <span>{ONBOARDING_STEPS[currentStep - 1]?.label}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-glow to-amber-deep transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 hidden gap-2 sm:flex">
          {ONBOARDING_STEPS.map((step) => {
            const isComplete = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            return (
              <div
                key={step.id}
                className={`flex-1 rounded-lg border px-2 py-2 text-center text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'border-amber-glow/40 bg-amber-glow/10 text-amber-glow'
                    : isComplete
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-white/10 bg-white/5 text-sand-200/40'
                }`}
              >
                {step.short}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-forest-900/60 p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8">
        {children}
      </div>

      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );
}

export function WizardNav({
  onBack,
  onNext,
  nextLabel = 'Continue',
  backLabel = 'Back',
  nextDisabled = false,
  loading = false,
  showBack = true,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  showBack?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      {showBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-sand-100 transition-all duration-200 hover:border-amber-glow/40 hover:bg-white/10 disabled:opacity-50"
        >
          {backLabel}
        </button>
      ) : (
        <div className="hidden sm:block" />
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || loading}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-8 py-3.5 text-sm font-semibold text-forest-950 shadow-lg shadow-amber-glow/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-glow/35 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto"
        >
          {loading ? 'Please wait…' : nextLabel}
        </button>
      )}
    </div>
  );
}
