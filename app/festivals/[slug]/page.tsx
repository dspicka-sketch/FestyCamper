import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatMoney } from '@/lib/pricing';
import { BookingForm } from '@/components/BookingForm';

export default async function FestivalPage({ params }: PageProps<'/festivals/[slug]'>) {
  const { slug } = await params;
  const festival = await prisma.festival.findUnique({
    where: { slug },
    include: { vans: { include: { van: true } } }
  });
  if (!festival) return notFound();

  const bundles = await prisma.bundle.findMany({ orderBy: { priceCents: 'asc' } });

  return (
    <div className="container">
      <p className="badge">{festival.city}, {festival.state}</p>
      <h1>{festival.name}</h1>
      <p className="muted">{festival.description}</p>
      <p>{festival.campNotes}</p>

      <h2>Festival-approved vans</h2>
      <div className="grid">
        {festival.vans
          .filter(({ van }) => van.status === 'ACTIVE')
          .map(({ van }) => (
          <div className="card" key={van.id}>
            <h3>{van.name}</h3>
            <p className="muted">{van.location} · sleeps {van.sleeps}</p>
            <p>{van.description}</p>
            <p><strong>Amenities:</strong> {van.amenities}</p>
            <p><strong>Rules:</strong> {van.rules}</p>
            <p className="price">{formatMoney(van.nightlyRateCents)} / night</p>
            <p><a href={`/vans/${van.id}`}>View listing →</a></p>
            <BookingForm festivalId={festival.id} vanId={van.id} bundles={bundles} />
          </div>
        ))}
      </div>
    </div>
  );
}
