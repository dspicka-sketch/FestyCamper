import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatMoney } from '@/lib/pricing';
import { getCoverPhotoUrl } from '@/lib/owner/van-display';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1527786356704-89daa58a37d8?auto=format&fit=crop&w=2400&q=80';

const VAN_IMAGES = [
  'https://images.unsplash.com/photo-1561361513-0222f764fc77?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500530855698-b586d89ba769?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1476231682828-5835740a1d76?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1533571339457-7b46a10b6dca?auto=format&fit=crop&w=800&q=80',
];

const FESTIVAL_GRADIENTS = [
  'from-emerald-600/30 via-teal-700/20 to-forest-900',
  'from-amber-600/30 via-orange-700/20 to-forest-900',
  'from-violet-600/30 via-purple-700/20 to-forest-900',
  'from-rose-600/30 via-red-700/20 to-forest-900',
];

const STEPS = [
  {
    step: '01',
    title: 'Pick your festival',
    description: 'Browse upcoming festivals and find vans pre-approved for the weekend you are heading to.',
    icon: '🎪',
  },
  {
    step: '02',
    title: 'Choose your van & bundle',
    description: 'Select a festival-friendly van and add bedding, shade, solar, delivery, and camp gear in one package.',
    icon: '🚐',
  },
  {
    step: '03',
    title: 'Roll in ready to camp',
    description: 'Submit your booking request, get confirmed, and show up with everything you need for the weekend.',
    icon: '✨',
  },
];

function formatFestivalDates(startsAt: Date, endsAt: Date) {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const start = startsAt.toLocaleDateString('en-US', opts);
  const end = endsAt.toLocaleDateString('en-US', { ...opts, year: 'numeric' });
  return `${start} – ${end}`;
}

export default async function HomePage() {
  const [festivals, vans] = await Promise.all([
    prisma.festival.findMany({ orderBy: { startsAt: 'asc' } }),
    prisma.van.findMany({
      where: { status: 'ACTIVE' },
      take: 4,
      orderBy: { nightlyRateCents: 'asc' },
      include: { photos: { orderBy: { sortOrder: 'asc' } }, festivals: { include: { festival: true } } },
    }),
  ]);

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="RV parked at a scenic outdoor festival destination"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/80 via-forest-950/60 to-forest-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/40 to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-36 sm:px-8 sm:pt-40">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-glow/30 bg-amber-glow/10 px-4 py-1.5 text-sm font-medium text-amber-glow backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-glow animate-pulse" />
              Festival-friendly RV rentals
            </span>

            <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] tracking-tight text-sand-50 sm:text-6xl lg:text-7xl">
              The easiest way to get to your next festival.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-200/80 sm:text-xl">
              Book vans that actually allow festival use. Add bedding, shade, solar, delivery, and camp gear in one simple bundle.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#festivals"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-8 py-4 text-base font-semibold text-forest-950 shadow-xl shadow-amber-glow/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-glow/40"
              >
                Browse Festivals
              </a>
              <Link
                href="/list-your-van"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-sand-50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/10"
              >
                List Your Van
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap gap-8 border-t border-white/10 pt-8">
              {[
                { value: `${festivals.length}+`, label: 'Festivals' },
                { value: `${vans.length}+`, label: 'Approved vans' },
                { value: '3', label: 'Bundle tiers' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-[family-name:var(--font-display)] text-3xl font-semibold text-sand-50">{stat.value}</p>
                  <p className="mt-1 text-sm text-sand-200/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce sm:block">
          <a href="#festivals" aria-label="Scroll to festivals" className="flex flex-col items-center gap-2 text-sand-200/50 transition-colors hover:text-amber-glow">
            <span className="text-xs uppercase tracking-widest">Explore</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Featured Festivals */}
      <section id="festivals" className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/50 to-forest-950" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Featured Festivals</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-sand-50 sm:text-4xl">
              Upcoming festival drops
            </h2>
            <p className="mt-4 text-lg text-sand-200/70">
              Hand-picked events with vans pre-approved for on-site camping and bundled weekend packages.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {festivals.map((festival, index) => (
              <Link
                key={festival.id}
                href={`/festivals/${festival.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-forest-900/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-amber-glow/30 hover:shadow-2xl hover:shadow-amber-glow/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${FESTIVAL_GRADIENTS[index % FESTIVAL_GRADIENTS.length]} opacity-60 transition-opacity duration-500 group-hover:opacity-80`} />
                <div className="relative p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-sand-200/80">
                      {festival.city}, {festival.state}
                    </span>
                    <span className="text-xs text-sand-200/50">
                      {formatFestivalDates(festival.startsAt, festival.endsAt)}
                    </span>
                  </div>
                  <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50 transition-colors group-hover:text-amber-glow">
                    {festival.name}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-sand-200/70">
                    {festival.description}
                  </p>
                  <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-glow transition-all duration-300 group-hover:gap-3">
                    View vans
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vans */}
      <section id="vans" className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-forest-800)_0%,_var(--color-forest-950)_70%)]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Featured Vans</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-sand-50 sm:text-4xl">
              Festival-ready rigs
            </h2>
            <p className="mt-4 text-lg text-sand-200/70">
              Every van is vetted for festival use with clear rules, amenities, and bundled add-ons.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {vans.map((van, index) => {
              const coverUrl = getCoverPhotoUrl(van) ?? VAN_IMAGES[index % VAN_IMAGES.length];

              return (
                <Link
                  key={van.id}
                  href={`/vans/${van.id}`}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-forest-900/60 transition-all duration-500 hover:-translate-y-2 hover:border-amber-glow/30 hover:shadow-2xl hover:shadow-black/40"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={coverUrl}
                      alt={van.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent" />
                    {van.festivalFriendly && (
                      <span className="absolute left-4 top-4 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white">
                        Festival approved
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-sand-50 transition-colors group-hover:text-amber-glow">
                      {van.name}
                    </h3>
                    <p className="mt-1 text-sm text-sand-200/60">
                      {van.location} · Sleeps {van.sleeps}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm text-sand-200/70">{van.description}</p>
                    <p className="mt-4 text-lg font-bold text-amber-glow">
                      {formatMoney(van.nightlyRateCents)}
                      <span className="text-sm font-normal text-sand-200/50"> / night</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/30 to-forest-950" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">How It Works</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-sand-50 sm:text-4xl">
              Three steps to festival-ready
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-sand-200/70">
              From browsing to booking, we keep the process simple so you can focus on the music.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {STEPS.map((item, index) => (
              <div
                key={item.step}
                className="group relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 transition-all duration-500 hover:-translate-y-1 hover:border-amber-glow/25 hover:bg-white/[0.07]"
              >
                {index < STEPS.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-gradient-to-r from-amber-glow/40 to-transparent md:block" />
                )}
                <div className="flex items-center gap-4">
                  <span className="text-3xl" role="img" aria-hidden="true">{item.icon}</span>
                  <span className="font-[family-name:var(--font-display)] text-sm font-semibold text-amber-glow/70">
                    Step {item.step}
                  </span>
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-xl font-semibold text-sand-50">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-sand-200/70">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a
              href="/vans"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-8 py-4 text-base font-semibold text-forest-950 shadow-lg shadow-amber-glow/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-glow/35"
            >
              Browse all vans
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
