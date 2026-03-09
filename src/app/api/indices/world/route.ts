import { NextResponse } from "next/server";
import { getQuote } from "@/lib/api/finnhub";
import { INDEX_PROXIES } from "@/lib/constants";

export async function GET() {
  try {
    const results = await Promise.all(
      INDEX_PROXIES.map(async (idx) => {
        try {
          const quote = await getQuote(idx.etf);
          return {
            etf: idx.etf,
            name: idx.name,
            region: idx.region,
            price: quote.c || 0,
            change: quote.d || 0,
            changePercent: quote.dp || 0,
            high: quote.h || 0,
            low: quote.l || 0,
          };
        } catch {
          return {
            etf: idx.etf,
            name: idx.name,
            region: idx.region,
            price: 0, change: 0, changePercent: 0, high: 0, low: 0,
          };
        }
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
