import { NextResponse } from "next/server";
import { getPortfolioHistory } from "@/lib/api/alpaca";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "1M";
    const timeframe = searchParams.get("timeframe") || "1D";
    const data = await getPortfolioHistory(period, timeframe);
    return NextResponse.json({
      timestamp: data.timestamp,
      equity: data.equity,
      profitLoss: data.profit_loss,
      profitLossPct: data.profit_loss_pct,
      baseValue: data.base_value,
      timeframe: data.timeframe,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
