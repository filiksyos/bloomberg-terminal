import { NextResponse } from "next/server";
import { searchSymbol } from "@/lib/api/finnhub";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    if (!q) return NextResponse.json({ results: [] });

    const data = await searchSymbol(q);
    const results = (data?.result || []).slice(0, 10).map((r: Record<string, unknown>) => ({
      symbol: r.symbol,
      description: r.description,
      type: r.type,
      displaySymbol: r.displaySymbol,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
