import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/owner/LogoutButton';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';

export default async function OwnerDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/owner/login?next=/owner/dashboard');
  }

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-amber-glow)_0%,_transparent_45%)] opacity-10" />

        <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-32 sm:px-8 sm:pt-36">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Owner dashboard</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-sand-50">
            Hello{user.email ? `, ${user.email.split('@')[0]}` : ''}
          </h1>
          <p className="mt-4 text-lg text-sand-200/70">
            Your owner dashboard is coming soon. You are signed in and ready to list vans.
          </p>

          <div className="mt-10 space-y-4 rounded-3xl border border-white/10 bg-forest-900/60 p-6 sm:p-8">
            <p className="text-sm text-sand-200/60">Signed in as {user.email}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/list-your-van"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-6 py-3 text-sm font-semibold text-forest-950 shadow-lg shadow-amber-glow/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                Submit a van listing
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
