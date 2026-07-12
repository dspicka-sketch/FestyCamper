import { NextRequest, NextResponse } from "next/server";
import { getDailyForecast, getWeeklyForecast } from "@/lib/forecast/build-forecast";

export async function GET(request: NextRequest) {
  const dateParam = request.nextUrl.searchParams.get("date");
  const locationSlug = request.nextUrl.searchParams.get("location") ?? undefined;
  const includeWeekly =
    request.nextUrl.searchParams.get("weekly") === "true";

  const date = dateParam ? new Date(dateParam) : new Date();

  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const daily = await getDailyForecast(date, locationSlug);

  if (includeWeekly) {
    const weekly = await getWeeklyForecast(date);
    return NextResponse.json({ daily, weekly });
  }

  return NextResponse.json({ daily });
}
