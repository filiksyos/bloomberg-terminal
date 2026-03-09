import { NextResponse } from "next/server";
import { getPositions, closeAllPositions } from "@/lib/api/alpaca";

function mapPosition(p: Record<string, unknown>) {
  return {
    assetId: p.asset_id,
    symbol: p.symbol,
    exchange: p.exchange,
    assetClass: p.asset_class,
    qty: parseFloat(p.qty as string),
    side: p.side,
    avgEntryPrice: parseFloat(p.avg_entry_price as string),
    marketValue: parseFloat(p.market_value as string),
    costBasis: parseFloat(p.cost_basis as string),
    currentPrice: parseFloat(p.current_price as string),
    lastdayPrice: parseFloat(p.lastday_price as string),
    changeToday: parseFloat(p.change_today as string),
    unrealizedPl: parseFloat(p.unrealized_pl as string),
    unrealizedPlpc: parseFloat(p.unrealized_plpc as string),
    unrealizedIntradayPl: parseFloat(p.unrealized_intraday_pl as string),
    unrealizedIntradayPlpc: parseFloat(p.unrealized_intraday_plpc as string),
  };
}

export async function GET() {
  try {
    const data = await getPositions();
    const positions = (data || []).map(mapPosition);
    return NextResponse.json(positions);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await closeAllPositions();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
