import { NextResponse } from "next/server";
import { getGlobalData } from "@/lib/api/coingecko";

export async function GET() {
  try {
    const raw = await getGlobalData();
    const data = raw?.data || {};
    return NextResponse.json({
      totalMarketCap: data.total_market_cap?.usd || 0,
      totalVolume: data.total_volume?.usd || 0,
      btcDominance: data.market_cap_percentage?.btc || 0,
      ethDominance: data.market_cap_percentage?.eth || 0,
      activeCryptocurrencies: data.active_cryptocurrencies || 0,
      marketCapChangePercentage24h: data.market_cap_change_percentage_24h_usd || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
