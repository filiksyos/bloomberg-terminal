import { NextResponse } from "next/server";
import { getQuote } from "@/lib/api/finnhub";
import { format, addDays, addMonths } from "date-fns";

function normalCDF(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

function blackScholes(S: number, K: number, T: number, r: number, sigma: number, type: "call" | "put") {
  if (T <= 0) return Math.max(type === "call" ? S - K : K - S, 0);
  const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  if (type === "call") return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
}

export async function GET(req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const url = new URL(req.url);
    const selectedExp = url.searchParams.get("expiration");

    const quote = await getQuote(symbol.toUpperCase());
    const price = quote.c || 100;
    const r = 0.05;
    const sigma = 0.30;

    const expirations = [
      format(addDays(new Date(), 7), "yyyy-MM-dd"),
      format(addDays(new Date(), 14), "yyyy-MM-dd"),
      format(addMonths(new Date(), 1), "yyyy-MM-dd"),
      format(addMonths(new Date(), 2), "yyyy-MM-dd"),
      format(addMonths(new Date(), 3), "yyyy-MM-dd"),
      format(addMonths(new Date(), 6), "yyyy-MM-dd"),
    ];

    const expDate = selectedExp || expirations[2];
    const T = Math.max((new Date(expDate).getTime() - Date.now()) / (365.25 * 24 * 3600 * 1000), 0.01);

    const strikes: number[] = [];
    const step = price > 100 ? 5 : price > 50 ? 2.5 : 1;
    for (let k = price * 0.8; k <= price * 1.2; k += step) {
      strikes.push(Math.round(k * 2) / 2);
    }

    const calls = strikes.map((K) => {
      const bsPrice = blackScholes(price, K, T, r, sigma, "call");
      const d1 = (Math.log(price / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
      return {
        contractSymbol: `${symbol}${expDate.replace(/-/g, "")}C${K}`,
        strike: K,
        expiration: expDate,
        type: "call" as const,
        lastPrice: parseFloat(bsPrice.toFixed(2)),
        change: parseFloat((Math.random() * 2 - 1).toFixed(2)),
        bid: parseFloat((bsPrice * 0.95).toFixed(2)),
        ask: parseFloat((bsPrice * 1.05).toFixed(2)),
        volume: Math.floor(Math.random() * 5000),
        openInterest: Math.floor(Math.random() * 10000),
        impliedVolatility: sigma + (Math.random() - 0.5) * 0.1,
        delta: parseFloat(normalCDF(d1).toFixed(4)),
        gamma: null,
        theta: null,
        vega: null,
        inTheMoney: price > K,
      };
    });

    const puts = strikes.map((K) => {
      const bsPrice = blackScholes(price, K, T, r, sigma, "put");
      const d1 = (Math.log(price / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
      return {
        contractSymbol: `${symbol}${expDate.replace(/-/g, "")}P${K}`,
        strike: K,
        expiration: expDate,
        type: "put" as const,
        lastPrice: parseFloat(bsPrice.toFixed(2)),
        change: parseFloat((Math.random() * 2 - 1).toFixed(2)),
        bid: parseFloat((bsPrice * 0.95).toFixed(2)),
        ask: parseFloat((bsPrice * 1.05).toFixed(2)),
        volume: Math.floor(Math.random() * 5000),
        openInterest: Math.floor(Math.random() * 10000),
        impliedVolatility: sigma + (Math.random() - 0.5) * 0.1,
        delta: parseFloat((normalCDF(d1) - 1).toFixed(4)),
        gamma: null,
        theta: null,
        vega: null,
        inTheMoney: price < K,
      };
    });

    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      expirationDates: expirations,
      selectedExpiration: expDate,
      calls,
      puts,
      underlyingPrice: price,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
