import { NextResponse } from "next/server";
import { getProfile, getBasicFinancials } from "@/lib/api/finnhub";

export async function GET(_req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const sym = symbol.toUpperCase();
    const [profile, metrics] = await Promise.all([
      getProfile(sym),
      getBasicFinancials(sym),
    ]);

    const m = metrics?.metric || {};
    return NextResponse.json({
      symbol: sym,
      name: profile.name || sym,
      exchange: profile.exchange || "",
      industry: profile.finnhubIndustry || "",
      sector: profile.finnhubIndustry || "",
      marketCap: profile.marketCapitalization ? profile.marketCapitalization * 1e6 : 0,
      description: "",
      website: profile.weburl || "",
      logo: profile.logo || "",
      country: profile.country || "",
      ipo: profile.ipo || "",
      phone: profile.phone || "",
      employees: 0,
      ceo: "",
      peRatio: m["peNormalizedAnnual"] || 0,
      pbRatio: m["pbAnnual"] || 0,
      evToEbitda: m["currentEv/freeCashFlowAnnual"] || 0,
      dividendYield: m["dividendYieldIndicatedAnnual"] || 0,
      beta: m["beta"] || 0,
      week52High: m["52WeekHigh"] || 0,
      week52Low: m["52WeekLow"] || 0,
      roe: m["roeTTM"] || 0,
      roa: m["roaTTM"] || 0,
      eps: m["epsNormalizedAnnual"] || 0,
      revenueGrowth: m["revenueGrowthQuarterlyYoy"] || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
