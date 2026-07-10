import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  locationSlug: z.string().min(1),
  reporterName: z.string().min(1).max(100),
  reporterEmail: z.string().email().optional(),
  tripDate: z.string(),
  species: z.string().min(1),
  fishCount: z.number().int().min(0),
  baitUsed: z.string().optional(),
  lureUsed: z.string().optional(),
  surfScore: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
});

function mapGoNoGo(score?: number) {
  if (!score) return undefined;
  if (score >= 7) return "GO" as const;
  if (score >= 4) return "MAYBE" as const;
  return "NO_GO" as const;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const location = await db.beachLocation.findUnique({
      where: { slug: data.locationSlug },
    });

    if (!location) {
      return NextResponse.json(
        { error: "Unknown location" },
        { status: 400 },
      );
    }

    const report = await db.catchReport.create({
      data: {
        locationId: location.id,
        reporterName: data.reporterName,
        reporterEmail: data.reporterEmail,
        tripDate: new Date(data.tripDate),
        species: data.species,
        fishCount: data.fishCount,
        baitUsed: data.baitUsed,
        lureUsed: data.lureUsed,
        surfScore: data.surfScore,
        goNoGo: mapGoNoGo(data.surfScore),
        notes: data.notes,
      },
    });

    return NextResponse.json({ id: report.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to save catch report" },
      { status: 500 },
    );
  }
}
