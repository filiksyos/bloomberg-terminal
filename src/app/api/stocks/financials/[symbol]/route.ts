import { NextResponse } from "next/server";
import { getIncomeStatement, getBalanceSheet, getCashFlowStatement, getKeyMetrics, getFinancialGrowth } from "@/lib/api/fmp";

export async function GET(req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const url = new URL(req.url);
    const statement = url.searchParams.get("statement") || "income";
    const period = url.searchParams.get("period") || "annual";

    let data;
    switch (statement) {
      case "income":
        data = await getIncomeStatement(symbol.toUpperCase(), period);
        break;
      case "balance":
        data = await getBalanceSheet(symbol.toUpperCase(), period);
        break;
      case "cashflow":
        data = await getCashFlowStatement(symbol.toUpperCase(), period);
        break;
      case "metrics":
        data = await getKeyMetrics(symbol.toUpperCase(), period);
        break;
      case "growth":
        data = await getFinancialGrowth(symbol.toUpperCase(), period);
        break;
      default:
        data = await getIncomeStatement(symbol.toUpperCase(), period);
    }

    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
