import { NextResponse } from "next/server";
import { getCoinsMarkets } from "@/lib/api/coingecko";

export async function GET() {
  try {
    const data = await getCoinsMarkets("usd", 50);
    const assets = (data || []).map((c: Record<string, unknown>) => ({
      id: c.id,
      symbol: (c.symbol as string || "").toUpperCase(),
      name: c.name,
      image: c.image,
      currentPrice: c.current_price,
      marketCap: c.market_cap,
      marketCapRank: c.market_cap_rank,
      totalVolume: c.total_volume,
      priceChangePercentage24h: c.price_change_percentage_24h_in_currency ?? c.price_change_percentage_24h ?? 0,
      priceChangePercentage7d: c.price_change_percentage_7d_in_currency ?? 0,
      sparklineIn7d: (c.sparkline_in_7d as Record<string, unknown>)?.price || [],
      high24h: c.high_24h,
      low24h: c.low_24h,
      circulatingSupply: c.circulating_supply,
      totalSupply: c.total_supply,
    }));

    return NextResponse.json(assets);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
