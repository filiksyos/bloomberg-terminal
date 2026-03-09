import { NextResponse } from "next/server";
import { getCandles } from "@/lib/api/finnhub";
import { getHistoricalDaily } from "@/lib/api/fmp";
import { getDailyTimeSeries } from "@/lib/api/alphavantage";

function toYYYYMMDD(ts: number): string {
  return new Date(ts * 1000).toISOString().slice(0, 10);
}

function fmpToCandles(historical: { date: string; open: number; high: number; low: number; close: number; volume: number }[]) {
  return historical.map((h) => ({
    time: Math.floor(new Date(h.date).getTime() / 1000),
    open: h.open,
    high: h.high,
    low: h.low,
    close: h.close,
    volume: h.volume,
  })).reverse();
}

function avToCandles(series: Record<string, { "1. open": string; "2. high": string; "3. low": string; "4. close": string; "5. volume": string }>) {
  const entries = Object.entries(series).filter(([date]) => !date.startsWith("Note"));
  return entries
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, o]) => ({
      time: Math.floor(new Date(date).getTime() / 1000),
      open: parseFloat(o["1. open"]),
      high: parseFloat(o["2. high"]),
      low: parseFloat(o["3. low"]),
      close: parseFloat(o["4. close"]),
      volume: parseInt(o["5. volume"], 10),
    }));
}

export async function GET(req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  const now = Math.floor(Date.now() / 1000);
  try {
    const { symbol } = await params;
    const url = new URL(req.url);
    const resolution = url.searchParams.get("resolution") || "D";
    let from = parseInt(url.searchParams.get("from") || "0");
    let to = parseInt(url.searchParams.get("to") || String(now));

    to = Math.min(to, now);
    if (from > to) from = to - 365 * 86400;

    try {
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
    } catch (finnhubError) {
      const msg = finnhubError instanceof Error ? finnhubError.message : "";
      if (!msg.includes("403") || resolution !== "D") throw finnhubError;

      if (process.env.FMP_API_KEY) {
        try {
          const fmpData = await getHistoricalDaily(symbol.toUpperCase(), toYYYYMMDD(from), toYYYYMMDD(to));
          const historical = (fmpData as { historical?: { date: string; open: number; high: number; low: number; close: number; volume: number }[] }).historical;
          if (historical?.length) return NextResponse.json(fmpToCandles(historical));
        } catch {
          /* fall through to Alpha Vantage */
        }
      }

      if (process.env.ALPHA_VANTAGE_API_KEY) {
        try {
          const avData = await getDailyTimeSeries(symbol.toUpperCase(), "compact");
          const series = (avData as { "Time Series (Daily)"?: Record<string, { "1. open": string; "2. high": string; "3. low": string; "4. close": string; "5. volume": string }> })["Time Series (Daily)"];
          if (series) {
            const candles = avToCandles(series).filter((c) => c.time >= from && c.time <= to);
            return NextResponse.json(candles);
          }
        } catch {
          /* fall through */
        }
      }

      return NextResponse.json([]);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const is429 = message.includes("429");
    if (is429) {
      console.warn("[candles] Rate limit exceeded");
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
    console.error("[candles]", message);
    return NextResponse.json([], { status: 200 });
  }
}
