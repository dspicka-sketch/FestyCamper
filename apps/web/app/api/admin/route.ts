import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdminRequest } from "@/lib/admin/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return unauthorizedResponse();
  }

  const [signups, reports, locations] = await Promise.all([
    db.betaSignup.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    db.catchReport.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { location: true },
    }),
    db.beachLocation.count(),
  ]);

  const signupStats = {
    total: await db.betaSignup.count(),
    pending: await db.betaSignup.count({ where: { status: "PENDING" } }),
    approved: await db.betaSignup.count({ where: { status: "APPROVED" } }),
  };

  return NextResponse.json({
    signupStats,
    signups,
    reports,
    locationCount: locations,
  });
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return unauthorizedResponse();
  }

  const body = await request.json();
  const { id, status } = body as { id?: string; status?: string };

  if (!id || !status) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }

  if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await db.betaSignup.update({
    where: { id },
    data: { status: status as "PENDING" | "APPROVED" | "REJECTED" },
  });

  return NextResponse.json(updated);
}
