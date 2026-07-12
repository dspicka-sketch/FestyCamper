-- Persist Stripe payment state on bookings.
ALTER TABLE "BookingRequest"
  ADD COLUMN "depositPaidCents" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "stripeCheckoutSessionId" TEXT,
  ADD COLUMN "stripePaymentIntentId" TEXT,
  ADD COLUMN "paidAt" TIMESTAMP(3),
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX "BookingRequest_stripeCheckoutSessionId_key"
  ON "BookingRequest"("stripeCheckoutSessionId");
CREATE UNIQUE INDEX "BookingRequest_stripePaymentIntentId_key"
  ON "BookingRequest"("stripePaymentIntentId");
