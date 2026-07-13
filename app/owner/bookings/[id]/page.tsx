import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOwnerBooking, requireOwnerSession } from '@/lib/owner/auth';
import { OwnerBookingDetail } from '@/components/owner/OwnerBookingDetail';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';

export default async function OwnerBookingDetailPage({ params }: PageProps<'/owner/bookings/[id]'>) {
  const { owner } = await requireOwnerSession('/owner/bookings');
  const { id } = await params;

  if (!owner) notFound();

  const booking = await getOwnerBooking(id, owner.id);
  if (!booking) notFound();

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/40 to-forest-950" />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
          <Link href="/owner/bookings" className="text-sm font-medium text-amber-glow hover:text-amber-glow/80">
            ← All booking requests
          </Link>
          <OwnerBookingDetail
            booking={{
              id: booking.id,
              status: booking.status,
              renterName: booking.renterName,
              renterEmail: booking.renterEmail,
              renterPhone: booking.renterPhone,
              guests: booking.guests,
              pickupType: booking.pickupType,
              arrivalAt: booking.arrivalAt.toISOString(),
              departureAt: booking.departureAt.toISOString(),
              nights: booking.nights,
              totalCents: booking.totalCents,
              renterMessage: booking.renterMessage,
              tripNeeds: booking.tripNeeds,
              festival: { name: booking.festival.name },
              van: { name: booking.van.name },
              bundle: { name: booking.bundle.name },
              messages: booking.messages.map((message) => ({
                id: message.id,
                senderRole: message.senderRole,
                body: message.body,
                createdAt: message.createdAt.toISOString(),
              })),
            }}
          />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
