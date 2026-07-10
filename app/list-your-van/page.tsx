import { OwnerLeadForm } from '@/components/list-your-van/OwnerLeadForm';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';

const BENEFITS = [
  {
    title: 'Festival-ready renters',
    description: 'We match you with verified renters who understand festival camping rules.',
  },
  {
    title: 'Premium weekend rates',
    description: 'Earn more during high-demand festival weekends with bundled packages.',
  },
  {
    title: 'Hands-on support',
    description: 'Our team reviews every listing and helps you get approved faster.',
  },
];

export default function ListYourVanPage() {
  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-amber-glow)_0%,_transparent_50%)] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-36">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">For owners</p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-sand-50 sm:text-5xl">
            List your van on FestyCamper
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-sand-200/70">
            Join our owner network and start earning from festival weekends. Submit your van details below and our team will follow up to get you listed.
          </p>
        </div>
      </section>

      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/40 to-forest-950" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-sand-50">
                Why list with us?
              </h2>
              <ul className="mt-8 space-y-6">
                {BENEFITS.map((benefit) => (
                  <li key={benefit.title} className="rounded-2xl border border-white/10 bg-forest-900/60 p-5">
                    <h3 className="font-semibold text-sand-50">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-sand-200/70">{benefit.description}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-sand-200/50">
                Questions?{' '}
                <a href="mailto:owners@festycamper.com" className="text-amber-glow transition-colors hover:text-amber-glow/80">
                  owners@festycamper.com
                </a>
              </p>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-white/10 bg-forest-900/60 p-6 sm:p-10">
                <OwnerLeadForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
