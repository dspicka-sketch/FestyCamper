-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('REQUESTED', 'APPROVED', 'DECLINED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VanStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED');

-- CreateTable
CREATE TABLE "Festival" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "campNotes" TEXT NOT NULL,

    CONSTRAINT "Festival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "supabaseUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Van" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "year" INTEGER,
    "make" TEXT,
    "model" TEXT,
    "trim" TEXT,
    "sleeps" INTEGER NOT NULL,
    "seatbelts" INTEGER,
    "transmission" TEXT,
    "fuelType" TEXT,
    "minNights" INTEGER NOT NULL DEFAULT 2,
    "weekendRateCents" INTEGER,
    "coverPhotoUrl" TEXT,
    "status" "VanStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "nightlyRateCents" INTEGER NOT NULL,
    "cleaningFeeCents" INTEGER NOT NULL,
    "securityDepositCents" INTEGER NOT NULL,
    "festivalFriendly" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,
    "amenities" TEXT NOT NULL,
    "rules" TEXT NOT NULL,
    "availableFestivals" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Van_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VanPhoto" (
    "id" TEXT NOT NULL,
    "vanId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "VanPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VanFestival" (
    "vanId" TEXT NOT NULL,
    "festivalId" TEXT NOT NULL,

    CONSTRAINT "VanFestival_pkey" PRIMARY KEY ("vanId","festivalId")
);

-- CreateTable
CREATE TABLE "Bundle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "includes" TEXT NOT NULL,

    CONSTRAINT "Bundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingRequest" (
    "id" TEXT NOT NULL,
    "festivalId" TEXT NOT NULL,
    "vanId" TEXT NOT NULL,
    "bundleId" TEXT NOT NULL,
    "renterName" TEXT NOT NULL,
    "renterEmail" TEXT NOT NULL,
    "renterPhone" TEXT,
    "guests" INTEGER NOT NULL,
    "pickupType" TEXT NOT NULL,
    "notes" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'REQUESTED',
    "totalCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerLead" (
    "id" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "vanYearMakeModel" TEXT NOT NULL,
    "sleeps" INTEGER NOT NULL,
    "homeCity" TEXT NOT NULL,
    "nightlyRateCents" INTEGER NOT NULL,
    "festivalAvailability" TEXT NOT NULL,
    "photosUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnerLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Festival_slug_key" ON "Festival"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_email_key" ON "Owner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_supabaseUserId_key" ON "Owner"("supabaseUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Bundle_slug_key" ON "Bundle"("slug");

-- AddForeignKey
ALTER TABLE "Van" ADD CONSTRAINT "Van_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VanPhoto" ADD CONSTRAINT "VanPhoto_vanId_fkey" FOREIGN KEY ("vanId") REFERENCES "Van"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VanFestival" ADD CONSTRAINT "VanFestival_vanId_fkey" FOREIGN KEY ("vanId") REFERENCES "Van"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VanFestival" ADD CONSTRAINT "VanFestival_festivalId_fkey" FOREIGN KEY ("festivalId") REFERENCES "Festival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingRequest" ADD CONSTRAINT "BookingRequest_festivalId_fkey" FOREIGN KEY ("festivalId") REFERENCES "Festival"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingRequest" ADD CONSTRAINT "BookingRequest_vanId_fkey" FOREIGN KEY ("vanId") REFERENCES "Van"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingRequest" ADD CONSTRAINT "BookingRequest_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Bundle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

