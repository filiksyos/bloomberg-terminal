import { NextResponse } from "next/server";
import { getEarnings } from "@/lib/api/finnhub";

export async function GET(_req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const data = await getEarnings(symbol.toUpperCase());

    const earnings = (data || []).map((e: Record<string, unknown>) => ({
      date: e.period,
      epsActual: e.actual ?? null,
      epsEstimate: e.estimate ?? null,
      epsSurprise: e.surprise ?? null,
      epsSurprisePercent: e.surprisePercent ?? null,
      revenueActual: e.revenueActual ?? null,
      revenueEstimate: e.revenueEstimate ?? null,
      quarter: e.quarter || 0,
      year: e.year || 0,
    }));

    return NextResponse.json(earnings);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
