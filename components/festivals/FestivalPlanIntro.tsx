'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatFestivalDates } from '@/lib/dates';
import { getFestivalHeroDna } from '@/lib/festivals/hero-dna';

type GroupType = 'solo' | 'couple' | 'friends' | 'family';
type TicketStatus = 'yes' | 'not-yet';
type RvIntent = 'yes' | 'maybe' | 'help';

type FestivalPlanIntroProps = {
  slug: string;
  name: string;
  city: string;
  state: string;
  startsAt: string;
  endsAt: string;
};

const GROUP_OPTIONS: { id: GroupType; label: string; hint: string }[] = [
  { id: 'solo', label: 'Solo', hint: 'Just me and the music' },
  { id: 'couple', label: 'Couple', hint: 'A weekend for two' },
  { id: 'friends', label: 'Friends', hint: 'The crew is coming' },
  { id: 'family', label: 'Family', hint: 'All ages along for the ride' },
];

const RV_OPTIONS: { id: RvIntent; label: string }[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'maybe', label: 'Maybe' },
  { id: 'help', label: 'Help me decide' },
];

function ChoiceChip({
  selected,
  onClick,
  label,
  hint,
  accentBorder,
  accentBg,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  hint?: string;
  accentBorder: string;
  accentBg: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
        selected
          ? `${accentBorder} ${accentBg} shadow-lg`
          : 'border-white/12 bg-forest-900/40 hover:border-white/25 hover:bg-forest-900/60'
      }`}
    >
      <span className="block text-sm font-semibold text-sand-50">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-sand-200/55">{hint}</span>}
    </button>
  );
}

export function FestivalPlanIntro({
  slug,
  name,
  city,
  state,
  startsAt,
  endsAt,
}: FestivalPlanIntroProps) {
  const dna = getFestivalHeroDna(slug);
  const [group, setGroup] = useState<GroupType | null>(null);
  const [partySize, setPartySize] = useState<number | null>(null);
  const [tickets, setTickets] = useState<TicketStatus | null>(null);
  const [rvIntent, setRvIntent] = useState<RvIntent | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const starts = new Date(startsAt);
  const ends = new Date(endsAt);
  const isComplete = group !== null && partySize !== null && tickets !== null && rvIntent !== null;

  function handleContinue() {
    if (!isComplete) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="relative min-h-[calc(100svh-4rem)]">
        <div className={`absolute inset-0 bg-gradient-to-b ${dna.accentGradient} opacity-40`} />
        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-2xl flex-col justify-center px-5 py-28 sm:px-8">
          <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${dna.accentLabel}`}>
            Step 1 complete
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-sand-50 sm:text-4xl">
            Your {name} weekend is taking shape.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-sand-200/80">
            We saved your answers. The next part of your plan — dates, camp setup, and what to
            pack — is coming soon.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/festivals/${slug}`}
              className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r px-8 py-4 text-base font-semibold text-forest-950 shadow-xl ${dna.ctaFrom} ${dna.ctaTo} ${dna.ctaShadow}`}
            >
              Back to {name}
            </Link>
            <Link
              href={`/festivals/${slug}#plan-your-weekend`}
              className={`inline-flex items-center justify-center rounded-full border bg-white/10 px-8 py-4 text-base font-semibold text-sand-50 backdrop-blur-sm ${dna.monogramBorder}`}
            >
              Read curated camp notes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100svh-4rem)]">
      <div className={`absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/50 to-forest-950`} />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${dna.colorWash} opacity-20`}
      />

      <div className="relative mx-auto max-w-2xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
        <Link
          href={`/festivals/${slug}`}
          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80 ${dna.accentLabel}`}
        >
          <span aria-hidden>←</span> Back to {name}
        </Link>

        <p className={`mt-8 text-sm font-semibold uppercase tracking-[0.2em] ${dna.accentLabel}`}>
          Plan your weekend · Step 1
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight text-sand-50 sm:text-4xl">
          Let&apos;s shape your {name} experience
        </h1>
        <p className="mt-4 text-base leading-relaxed text-sand-200/75 sm:text-lg">
          Tell us a little about your crew — no commitment yet, just the start of a plan built
          around the festival, not the checkout.
        </p>
        <p className="mt-2 text-sm text-sand-200/50">
          {formatFestivalDates(starts, ends)} · {city}, {state}
        </p>

        <div className="mt-10 space-y-10 rounded-3xl border border-white/10 bg-forest-900/50 p-6 backdrop-blur-sm sm:p-8">
          <fieldset>
            <legend className="font-[family-name:var(--font-display)] text-lg font-semibold text-sand-50">
              Who&apos;s going?
            </legend>
            <p className="mt-1 text-sm text-sand-200/55">This helps us tailor the vibe of your plan.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {GROUP_OPTIONS.map((option) => (
                <ChoiceChip
                  key={option.id}
                  selected={group === option.id}
                  onClick={() => setGroup(option.id)}
                  label={option.label}
                  hint={option.hint}
                  accentBorder={dna.monogramBorder}
                  accentBg={dna.monogramBg}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-[family-name:var(--font-display)] text-lg font-semibold text-sand-50">
              How many people?
            </legend>
            <p className="mt-1 text-sm text-sand-200/55">Including you.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPartySize(n)}
                  className={`flex h-11 min-w-[2.75rem] items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-all ${
                    partySize === n
                      ? `${dna.monogramBorder} ${dna.monogramBg} text-sand-50`
                      : 'border-white/12 bg-forest-950/50 text-sand-200/70 hover:border-white/25'
                  }`}
                >
                  {n}
                  {n === 12 ? '+' : ''}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-[family-name:var(--font-display)] text-lg font-semibold text-sand-50">
              Have you already purchased festival tickets?
            </legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {(
                [
                  { id: 'yes' as const, label: 'Yes' },
                  { id: 'not-yet' as const, label: 'Not yet' },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTickets(option.id)}
                  className={`rounded-full border px-6 py-2.5 text-sm font-semibold transition-all ${
                    tickets === option.id
                      ? `${dna.monogramBorder} ${dna.monogramBg} text-sand-50`
                      : 'border-white/12 bg-forest-950/50 text-sand-200/70 hover:border-white/25'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-[family-name:var(--font-display)] text-lg font-semibold text-sand-50">
              Are you planning to camp in an RV?
            </legend>
            <p className="mt-1 text-sm text-sand-200/55">
              No pressure — we can help you figure out what makes sense.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {RV_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setRvIntent(option.id)}
                  className={`rounded-full border px-6 py-2.5 text-sm font-semibold transition-all ${
                    rvIntent === option.id
                      ? `${dna.monogramBorder} ${dna.monogramBg} text-sand-50`
                      : 'border-white/12 bg-forest-950/50 text-sand-200/70 hover:border-white/25'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!isComplete}
            className={`mt-2 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r px-8 py-4 text-base font-semibold text-forest-950 shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 ${dna.ctaFrom} ${dna.ctaTo} ${dna.ctaShadow}`}
          >
            Continue Planning
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-sand-200/40">
          FestyCamper is an independent planning tool — not affiliated with {name} or its organizers.
        </p>
      </div>
    </div>
  );
}
