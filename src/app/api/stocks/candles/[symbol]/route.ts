import { NextResponse } from "next/server";
import { getCandles } from "@/lib/api/finnhub";

export async function GET(req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const url = new URL(req.url);
    const resolution = url.searchParams.get("resolution") || "D";
    const from = parseInt(url.searchParams.get("from") || "0");
    const to = parseInt(url.searchParams.get("to") || String(Math.floor(Date.now() / 1000)));

    const data = await getCandles(symbol.toUpperCase(), resolution, from, to);

    if (data.s !== "ok" || !data.t) {
      return NextResponse.json([]);
    }

    const candles = data.t.map((t: number, i: number) => ({
      time: t,
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
      volume: data.v[i],
    }));

    return NextResponse.json(candles);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
