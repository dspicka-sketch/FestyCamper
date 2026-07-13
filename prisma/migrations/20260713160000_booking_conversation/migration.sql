-- Booking conversation Phase 1: dates, messages, access tokens

ALTER TABLE "BookingRequest"
  ADD COLUMN "arrivalAt" DATE,
  ADD COLUMN "departureAt" DATE,
  ADD COLUMN "nights" INTEGER,
  ADD COLUMN "renterMessage" TEXT,
  ADD COLUMN "tripNeeds" TEXT,
  ADD COLUMN "declineReason" TEXT,
  ADD COLUMN "approvedAt" TIMESTAMP(3);

UPDATE "BookingRequest" b
SET
  "arrivalAt" = f."startsAt"::date,
  "departureAt" = f."endsAt"::date,
  "nights" = GREATEST(
    1,
    CEIL(EXTRACT(EPOCH FROM (f."endsAt" - f."startsAt")) / 86400)::integer
  ),
  "renterMessage" = b."notes"
FROM "Festival" f
WHERE b."festivalId" = f."id";

ALTER TABLE "BookingRequest"
  ALTER COLUMN "arrivalAt" SET NOT NULL,
  ALTER COLUMN "departureAt" SET NOT NULL,
  ALTER COLUMN "nights" SET NOT NULL;

CREATE TYPE "BookingMessageRole" AS ENUM ('RENTER', 'OWNER');

CREATE TABLE "BookingMessage" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "senderRole" "BookingMessageRole" NOT NULL,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BookingMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "BookingMessage_bookingId_createdAt_idx" ON "BookingMessage"("bookingId", "createdAt");

ALTER TABLE "BookingMessage"
  ADD CONSTRAINT "BookingMessage_bookingId_fkey"
  FOREIGN KEY ("bookingId") REFERENCES "BookingRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "BookingAccessToken" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BookingAccessToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BookingAccessToken_bookingId_key" ON "BookingAccessToken"("bookingId");
CREATE UNIQUE INDEX "BookingAccessToken_tokenHash_key" ON "BookingAccessToken"("tokenHash");

ALTER TABLE "BookingAccessToken"
  ADD CONSTRAINT "BookingAccessToken_bookingId_fkey"
  FOREIGN KEY ("bookingId") REFERENCES "BookingRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
