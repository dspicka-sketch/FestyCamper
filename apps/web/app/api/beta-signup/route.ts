import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email/resend";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  experience: z.string().optional(),
  homeBreak: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const signup = await db.betaSignup.upsert({
      where: { email: data.email },
      update: {
        name: data.name,
        experience: data.experience,
        homeBreak: data.homeBreak,
      },
      create: {
        name: data.name,
        email: data.email,
        experience: data.experience,
        homeBreak: data.homeBreak,
      },
    });

    await sendEmail({
      to: data.email,
      subject: "SurfScore Beta — You're on the list",
      html: `<p>Hi ${data.name},</p><p>Thanks for requesting SurfScore beta access. We'll notify you when your spot opens.</p>`,
    });

    return NextResponse.json({ id: signup.id, status: signup.status });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to process signup" },
      { status: 500 },
    );
  }
}
