-- CreateEnum
CREATE TYPE "BetaSignupStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "GoNoGoRating" AS ENUM ('GO', 'MAYBE', 'NO_GO');

-- CreateTable
CREATE TABLE "BeachLocation" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "accessType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BeachLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BetaSignup" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "experience" TEXT,
    "homeBreak" TEXT,
    "status" "BetaSignupStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BetaSignup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatchReport" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "reporterName" TEXT NOT NULL,
    "reporterEmail" TEXT,
    "tripDate" TIMESTAMP(3) NOT NULL,
    "species" TEXT NOT NULL,
    "fishCount" INTEGER NOT NULL DEFAULT 0,
    "baitUsed" TEXT,
    "lureUsed" TEXT,
    "surfScore" INTEGER,
    "goNoGo" "GoNoGoRating",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatchReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForecastCache" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForecastCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BeachLocation_slug_key" ON "BeachLocation"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BetaSignup_email_key" ON "BetaSignup"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ForecastCache_date_key" ON "ForecastCache"("date");

-- AddForeignKey
ALTER TABLE "CatchReport" ADD CONSTRAINT "CatchReport_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "BeachLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
