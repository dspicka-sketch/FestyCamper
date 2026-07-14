import { notFound } from 'next/navigation';
import { getBookingByAccessToken } from '@/lib/booking/access-token';
import { RenterBookingView } from '@/components/booking/RenterBookingView';
import { SiteFooter } from '@/components/home/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';

export default async function BookingAccessPage({
  params,
  searchParams,
}: PageProps<'/booking/access/[token]'>) {
  const { token } = await params;
  const { deposit } = await searchParams;
  const result = await getBookingByAccessToken(token);

  if (!result) notFound();

  const { booking } = result;
  const depositStatus = typeof deposit === 'string' ? deposit : undefined;

  return (
    <div className="min-h-screen bg-forest-950 font-[family-name:var(--font-body)] text-sand-50 antialiased">
      <SiteHeader />

      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900/40 to-forest-950" />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
          <RenterBookingView
            accessToken={token}
            booking={{
              id: booking.id,
              status: booking.status,
              renterName: booking.renterName,
              guests: booking.guests,
              pickupType: booking.pickupType,
              arrivalAt: booking.arrivalAt.toISOString(),
              departureAt: booking.departureAt.toISOString(),
              nights: booking.nights,
              totalCents: booking.totalCents,
              tripNeeds: booking.tripNeeds,
              declineReason: booking.declineReason,
              depositPaidCents: booking.depositPaidCents,
              festival: booking.festival,
              van: { name: booking.van.name },
              bundle: { name: booking.bundle.name },
            }}
            messages={booking.messages.map((message) => ({
              id: message.id,
              senderRole: message.senderRole,
              body: message.body,
              createdAt: message.createdAt.toISOString(),
            }))}
            depositStatus={depositStatus}
          />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
