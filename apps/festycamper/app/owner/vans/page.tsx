import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireOwnerSession } from '@/lib/owner/auth';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';
import { OwnerVanCard, OwnerVansEmpty, OwnerVansError } from '@/components/owner/vans/OwnerVanCard';

export default async function OwnerVansPage() {
  const { owner } = await requireOwnerSession('/owner/vans');

  if (!owner) {
    redirect('/owner/onboarding');
  }

  let vans;
  try {
    vans = await prisma.van.findMany({
      where: { ownerId: owner.id },
      include: {
        photos: { orderBy: { sortOrder: 'asc' } },
        festivals: { include: { festival: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return (
      <OwnerShell>
        <OwnerVansError />
      </OwnerShell>
    );
  }

  return (
    <OwnerShell>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Your fleet</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-sand-50">
            Van listings
          </h1>
          <p className="mt-3 text-lg text-sand-200/70">
            {vans.length} {vans.length === 1 ? 'listing' : 'listings'} in your account
          </p>
        </div>
        <Link
          href="/owner/onboarding"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-6 py-3 text-sm font-semibold text-forest-950 shadow-lg shadow-amber-glow/25 transition-all duration-300 hover:-translate-y-0.5"
        >
          Add another van
        </Link>
      </div>

      {vans.length === 0 ? (
        <OwnerVansEmpty />
      ) : (
        <div className="space-y-5">
          {vans.map((van) => (
            <OwnerVanCard key={van.id} van={van} />
          ))}
        </div>
      )}
    </OwnerShell>
  );
}

function OwnerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-amber-glow)_0%,_transparent_50%)] opacity-10" />
        <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32">{children}</div>
      </section>
      <SiteFooter />
    </div>
  );
}
