import { NextResponse } from "next/server";
import { getMultipleSeries } from "@/lib/api/fred";
import { TREASURY_SERIES } from "@/lib/constants";

export async function GET() {
  try {
    const seriesIds = TREASURY_SERIES.map((s) => s.id);
    const data = await getMultipleSeries(seriesIds, 2);

    const yields = TREASURY_SERIES.map((series) => {
      const seriesData = data[series.id] as Record<string, unknown> | undefined;
      const obs = (((seriesData?.observations) || []) as Record<string, unknown>[]).filter((o) => o.value !== ".");
      const current = obs[0] ? parseFloat(obs[0].value as string) : 0;
      const previous = obs[1] ? parseFloat(obs[1].value as string) : current;

      return {
        maturity: series.maturity,
        yield: current,
        change: current - previous,
        previousYield: previous,
      };
    });

    return NextResponse.json(yields);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
