import { NextResponse } from "next/server";
import { getRecommendations, getPriceTarget } from "@/lib/api/finnhub";

export async function GET(_req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const [recommendations, priceTarget] = await Promise.all([
      getRecommendations(symbol.toUpperCase()),
      getPriceTarget(symbol.toUpperCase()),
    ]);

    return NextResponse.json({
      recommendations: recommendations || [],
      priceTarget: {
        targetHigh: priceTarget?.targetHigh || 0,
        targetLow: priceTarget?.targetLow || 0,
        targetMean: priceTarget?.targetMean || 0,
        targetMedian: priceTarget?.targetMedian || 0,
        lastUpdated: priceTarget?.lastUpdated || "",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
