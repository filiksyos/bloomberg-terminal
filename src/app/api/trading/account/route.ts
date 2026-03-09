import { NextResponse } from "next/server";
import { getAccount } from "@/lib/api/alpaca";

export async function GET() {
  try {
    const data = await getAccount();
    return NextResponse.json({
      id: data.id,
      status: data.status,
      currency: data.currency,
      buyingPower: parseFloat(data.buying_power),
      cash: parseFloat(data.cash),
      portfolioValue: parseFloat(data.portfolio_value),
      equity: parseFloat(data.equity),
      lastEquity: parseFloat(data.last_equity),
      longMarketValue: parseFloat(data.long_market_value),
      shortMarketValue: parseFloat(data.short_market_value),
      daytradeCount: data.daytrade_count,
      daytradingBuyingPower: parseFloat(data.daytrading_buying_power),
      patternDayTrader: data.pattern_day_trader,
      tradingBlocked: data.trading_blocked,
      transfersBlocked: data.transfers_blocked,
      accountBlocked: data.account_blocked,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
