import { NextResponse } from 'next/server';
import { z } from 'zod';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { DEPOSIT_AMOUNT_CENTS, getAppUrl, isStripeConfigured } from '@/lib/stripe-config';

const schema = z.object({
  bookingId: z.string().min(1),
});

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          'Stripe is not configured. Add a valid STRIPE_SECRET_KEY (sk_test_...) from your Stripe Dashboard to .env.',
      },
      { status: 503 },
    );
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request. Booking ID is required.' }, { status: 400 });
  }

  const booking = await prisma.bookingRequest.findUnique({
    where: { id: parsed.data.bookingId },
    include: { festival: true, van: true, bundle: true },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }

  const appUrl = getAppUrl();
  const confirmationUrl = `${appUrl}/booking/confirmation/${booking.id}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: booking.renterEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: DEPOSIT_AMOUNT_CENTS,
            product_data: {
              name: 'FestyCamper booking deposit',
              description: `${booking.festival.name} · ${booking.van.name} · ${booking.bundle.name}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        type: 'deposit',
      },
      success_url: `${confirmationUrl}?deposit=success`,
      cancel_url: `${confirmationUrl}?deposit=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Unable to create checkout session.' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof Stripe.errors.StripeAuthenticationError) {
      return NextResponse.json(
        { error: 'Invalid Stripe API key. Check STRIPE_SECRET_KEY in your .env file.' },
        { status: 503 },
      );
    }

    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: 'Payment service error. Please try again in a moment.' },
      { status: 502 },
    );
  }
}
