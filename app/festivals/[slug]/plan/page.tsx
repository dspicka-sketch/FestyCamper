import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { resolveFestivalSlug } from '@/lib/festivals/catalog';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';
import { FestivalPlanIntro } from '@/components/festivals/FestivalPlanIntro';

export default async function FestivalPlanPage({ params }: PageProps<'/festivals/[slug]/plan'>) {
  const { slug } = await params;
  const canonicalSlug = resolveFestivalSlug(slug);

  if (canonicalSlug !== slug) {
    redirect(`/festivals/${canonicalSlug}/plan`);
  }

  const festival = await prisma.festival.findUnique({
    where: { slug: canonicalSlug },
  });

  if (!festival) return notFound();

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <FestivalPlanIntro
        slug={festival.slug}
        name={festival.name}
        city={festival.city}
        state={festival.state}
        startsAt={festival.startsAt.toISOString()}
        endsAt={festival.endsAt.toISOString()}
      />

      <SiteFooter />
    </div>
  );
}
