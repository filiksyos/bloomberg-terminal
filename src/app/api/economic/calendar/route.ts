import { NextResponse } from "next/server";
import { getEconomicCalendar } from "@/lib/api/finnhub";
import { format, addDays } from "date-fns";

export async function GET() {
  try {
    const now = new Date();
    const from = format(now, "yyyy-MM-dd");
    const to = format(addDays(now, 30), "yyyy-MM-dd");
    const data = await getEconomicCalendar(from, to);

    const events = (data?.economicCalendar || []).map((e: Record<string, unknown>) => ({
      date: e.date || "",
      time: e.time || "",
      country: e.country || "",
      event: e.event || "",
      importance: e.impact || 2,
      actual: e.actual ?? null,
      estimate: e.estimate ?? null,
      previous: e.prev ?? null,
      unit: e.unit || "",
    }));

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
