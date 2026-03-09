import { NextResponse } from "next/server";
import { getStockGainers, getStockLosers, getStockMostActive } from "@/lib/api/fmp";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "gainers";

    let data;
    if (type === "gainers") data = await getStockGainers();
    else if (type === "losers") data = await getStockLosers();
    else data = await getStockMostActive();

    const results = (data || []).slice(0, 25).map((item: Record<string, unknown>) => ({
      symbol: item.symbol || item.ticker,
      name: item.companyName || item.name || "",
      price: item.price || 0,
      change: item.changes || item.change || 0,
      changePercent: item.changesPercentage || item.changePercent || 0,
      volume: item.volume || 0,
    }));

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
