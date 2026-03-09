import { NextRequest, NextResponse } from "next/server";

const FMP_KEY = process.env.FMP_API_KEY || "";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;

  try {
    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/stock_split/${symbol}?apikey=${FMP_KEY}`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    const splits = (data.historical || []).map((s: { date: string; numerator: number; denominator: number }) => ({
      date: s.date,
      numerator: s.numerator,
      denominator: s.denominator,
    }));
    return NextResponse.json({ splits });
  } catch {
    return NextResponse.json({ splits: [] });
  }
}
