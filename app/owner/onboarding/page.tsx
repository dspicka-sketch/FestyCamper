import Link from 'next/link';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';

export default function OwnerOnboardingPage() {
  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-amber-glow)_0%,_transparent_50%)] opacity-10" />

        <div className="relative mx-auto max-w-2xl px-5 pb-16 pt-32 text-center sm:px-8 sm:pt-36">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-2xl ring-1 ring-emerald-500/30">
            ✓
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-emerald-300">Account created</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-sand-50">
            Welcome to FestyCamper
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-sand-200/70">
            Your onboarding wizard is coming soon. For now, tell us about your van and our team will help you get listed.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/list-your-van"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-8 py-4 text-base font-semibold text-forest-950 shadow-lg shadow-amber-glow/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              List your van
            </Link>
            <Link
              href="/owner/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 text-base font-semibold text-sand-100 transition-all duration-200 hover:border-amber-glow/40 hover:bg-white/5"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
