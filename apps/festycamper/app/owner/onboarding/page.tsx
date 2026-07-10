import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';
import { VanOnboardingWizard } from '@/components/owner/onboarding/VanOnboardingWizard';

export default async function OwnerOnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/owner/login?next=/owner/onboarding');
  }

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-950 to-forest-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-amber-glow)_0%,_transparent_50%)] opacity-10" />

        <div className="relative">
          <VanOnboardingWizard userId={user.id} userEmail={user.email ?? ''} />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
