import { NextResponse } from "next/server";
import { getSeriesObservations } from "@/lib/api/fred";

export async function GET(_req: Request, { params }: { params: Promise<{ series: string }> }) {
  try {
    const { series } = await params;
    const data = await getSeriesObservations(series, 100, "desc");
    const observations = (data?.observations || [])
      .filter((o: Record<string, unknown>) => o.value !== ".")
      .map((o: Record<string, unknown>) => ({
        date: o.date,
        value: parseFloat(o.value as string),
      }));

    return NextResponse.json(observations);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
