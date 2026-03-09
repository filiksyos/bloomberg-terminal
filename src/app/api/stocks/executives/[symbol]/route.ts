import { NextRequest, NextResponse } from "next/server";

const FMP_KEY = process.env.FMP_API_KEY || "";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;

  try {
    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/key-executives/${symbol}?apikey=${FMP_KEY}`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    const executives = (Array.isArray(data) ? data : []).map((e: { name: string; title: string; pay: number | null; yearBorn: number | null }) => ({
      name: e.name,
      title: e.title,
      pay: e.pay,
      yearBorn: e.yearBorn,
    }));
    return NextResponse.json({ executives });
  } catch {
    return NextResponse.json({ executives: [] });
  }
}
