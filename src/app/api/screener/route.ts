import { NextResponse } from "next/server";
import { getStockScreener } from "@/lib/api/fmp";

export async function POST(req: Request) {
  try {
    const filters = await req.json();
    const params: Record<string, string> = {};
    if (filters.marketCapMoreThan) params.marketCapMoreThan = String(filters.marketCapMoreThan);
    if (filters.marketCapLowerThan) params.marketCapLowerThan = String(filters.marketCapLowerThan);
    if (filters.priceMoreThan) params.priceMoreThan = String(filters.priceMoreThan);
    if (filters.priceLowerThan) params.priceLowerThan = String(filters.priceLowerThan);
    if (filters.betaMoreThan) params.betaMoreThan = String(filters.betaMoreThan);
    if (filters.betaLowerThan) params.betaLowerThan = String(filters.betaLowerThan);
    if (filters.volumeMoreThan) params.volumeMoreThan = String(filters.volumeMoreThan);
    if (filters.dividendMoreThan) params.dividendMoreThan = String(filters.dividendMoreThan);
    if (filters.sector) params.sector = filters.sector;
    if (filters.exchange) params.exchange = filters.exchange;
    if (filters.country) params.country = filters.country;

    const data = await getStockScreener(params);
    const results = (data || []).map((s: Record<string, unknown>) => ({
      symbol: s.symbol,
      companyName: s.companyName,
      marketCap: s.marketCap,
      sector: s.sector,
      industry: s.industry,
      price: s.price,
      change: s.changes || 0,
      changePercent: s.changesPercentage ? parseFloat(String(s.changesPercentage)) : 0,
      volume: s.volume || 0,
      beta: s.beta || 0,
      lastAnnualDividend: s.lastAnnualDividend || 0,
      exchange: s.exchangeShortName || s.exchange || "",
      country: s.country || "",
    }));

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
