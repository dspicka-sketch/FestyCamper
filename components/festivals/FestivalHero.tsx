import Image from 'next/image';
import Link from 'next/link';
import { formatFestivalDates } from '@/lib/dates';
import { getFestivalHeroDna } from '@/lib/festivals/hero-dna';
import { FestivalCountdown } from '@/components/festivals/FestivalCountdown';
import { FestivalAnticipationCue } from '@/components/festivals/FestivalAnticipationCue';

type FestivalHeroProps = {
  slug: string;
  name: string;
  city: string;
  state: string;
  startsAt: Date;
  endsAt: Date;
  vanCount: number;
};

export function FestivalHero({
  slug,
  name,
  city,
  state,
  startsAt,
  endsAt,
  vanCount,
}: FestivalHeroProps) {
  const dna = getFestivalHeroDna(slug);
  const initials = name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <section className="relative min-h-[88svh] overflow-hidden border-b border-white/10">
      <Image
        src={dna.heroImage}
        alt={`${name} festival atmosphere`}
        fill
        priority
        className={`object-cover ${dna.imagePosition}`}
        sizes="100vw"
      />

      <div className={`absolute inset-0 bg-gradient-to-br ${dna.colorWash} mix-blend-multiply opacity-85`} />
      <div className={`absolute inset-0 bg-gradient-to-t ${dna.accentGradient}`} />
      <div className={`absolute inset-0 bg-gradient-to-r ${dna.scrimGradient}`} />

      <div className="relative flex min-h-[88svh] flex-col justify-end">
        <div className="mx-auto w-full max-w-7xl px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
          <Link
            href="/festivals"
            className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80 ${dna.accentLabel}`}
          >
            <span aria-hidden>←</span> All festivals
          </Link>

          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-sand-50 backdrop-blur-md sm:h-16 sm:w-16 sm:text-xl ${dna.monogramBorder} ${dna.monogramBg}`}
                  aria-hidden
                >
                  {initials}
                </div>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${dna.accentLabel}`}>
                    Festival weekend
                  </p>
                  <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] tracking-tight text-sand-50 sm:text-5xl lg:text-6xl">
                    {name}
                  </h1>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-sand-200/80">
                <span className="inline-flex items-center gap-1.5">
                  <svg className={`h-4 w-4 ${dna.accentIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={startsAt.toISOString()}>
                    {formatFestivalDates(startsAt, endsAt)}
                  </time>
                </span>
                <span className="hidden text-sand-200/30 sm:inline" aria-hidden>
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <svg className={`h-4 w-4 ${dna.accentIcon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {city}, {state}
                </span>
              </div>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand-100/90 sm:text-xl">
                {dna.tagline}
              </p>

              {dna.emotionalCue && (
                <FestivalAnticipationCue
                  startsAt={startsAt.toISOString()}
                  template={dna.emotionalCue}
                  className={`mt-3 text-sm italic ${dna.accentLabel} opacity-80`}
                />
              )}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="#plan-your-weekend"
                  className={`inline-flex items-center justify-center rounded-full bg-gradient-to-r px-8 py-4 text-base font-semibold text-forest-950 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl ${dna.ctaFrom} ${dna.ctaTo} ${dna.ctaShadow}`}
                >
                  Plan My Festival
                </a>
                <a
                  href="#available-vans"
                  className={`inline-flex items-center justify-center rounded-full border bg-white/10 px-8 py-4 text-base font-semibold text-sand-50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 ${dna.monogramBorder}`}
                >
                  Browse Available RVs
                  {vanCount > 0 && (
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${dna.monogramBg} text-sand-100`}>
                      {vanCount}
                    </span>
                  )}
                </a>
              </div>
            </div>

            <div className="lg:pb-1">
              <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${dna.countdown.labelText}`}>
                Countdown
              </p>
              <FestivalCountdown
                startsAt={startsAt.toISOString()}
                festivalName={name}
                theme={dna.countdown}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
