import { NextResponse } from "next/server";

const FMP_KEY = process.env.FMP_API_KEY || "";

export async function GET() {
  try {
    // Get IPOs from last 30 days and next 30 days
    const now = new Date();
    const from = new Date(now.getTime() - 30 * 86400000).toISOString().split("T")[0];
    const to = new Date(now.getTime() + 30 * 86400000).toISOString().split("T")[0];

    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/ipo_calendar?from=${from}&to=${to}&apikey=${FMP_KEY}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const ipos = (Array.isArray(data) ? data : []).map((ipo: { date: string; symbol: string; company: string; exchange: string; shares: number | null; priceRange: string; actions: string }) => ({
      date: ipo.date,
      symbol: ipo.symbol,
      name: ipo.company,
      exchange: ipo.exchange,
      shares: ipo.shares,
      priceRange: ipo.priceRange,
      status: new Date(ipo.date) > now ? "upcoming" : "priced",
    }));
    return NextResponse.json({ ipos });
  } catch {
    return NextResponse.json({ ipos: [] });
  }
}
