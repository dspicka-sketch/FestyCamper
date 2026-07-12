import { PrismaClient } from "@prisma/client";
import { SURF_LOCATIONS } from "../lib/locations";

const prisma = new PrismaClient();

async function main() {
  for (const loc of SURF_LOCATIONS) {
    await prisma.beachLocation.upsert({
      where: { slug: loc.slug },
      update: {
        name: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        accessType: loc.access,
        description: loc.description,
        active: true,
      },
      create: {
        slug: loc.slug,
        name: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        accessType: loc.access,
        description: loc.description,
        active: true,
      },
    });
  }

  await prisma.betaSignup.upsert({
    where: { email: "beta@surfscore.app" },
    update: {},
    create: {
      email: "beta@surfscore.app",
      name: "Demo Beta User",
      experience: "intermediate",
      homeBreak: "Doran Beach",
      status: "APPROVED",
    },
  });

  const doran = await prisma.beachLocation.findUnique({
    where: { slug: "doran-beach" },
  });

  if (doran) {
    const existing = await prisma.catchReport.count();
    if (existing === 0) {
      await prisma.catchReport.create({
        data: {
          locationId: doran.id,
          reporterName: "Demo Angler",
          reporterEmail: "demo@example.com",
          tripDate: new Date(),
          species: "Surf perch",
          fishCount: 4,
          baitUsed: "Sand crabs",
          surfScore: 7,
          goNoGo: "GO",
          notes: "Incoming tide bite at the wash zone.",
        },
      });
    }
  }

  console.log("SurfScore seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
