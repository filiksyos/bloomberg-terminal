import { NextResponse } from "next/server";
import { getDividendHistory } from "@/lib/api/fmp";

export async function GET(_req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const data = await getDividendHistory(symbol.toUpperCase());
    const dividends = (data?.historical || []).slice(0, 40).map((d: Record<string, unknown>) => ({
      exDate: d.date || "",
      payDate: d.paymentDate || "",
      recordDate: d.recordDate || "",
      amount: d.dividend || 0,
      adjustedAmount: d.adjDividend || d.dividend || 0,
      currency: "USD",
    }));

    return NextResponse.json(dividends);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
