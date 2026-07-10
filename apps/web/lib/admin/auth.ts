import { NextRequest, NextResponse } from "next/server";

export function verifyAdminRequest(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const header = request.headers.get("x-admin-secret");
  const param = request.nextUrl.searchParams.get("secret");
  return header === secret || param === secret;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
