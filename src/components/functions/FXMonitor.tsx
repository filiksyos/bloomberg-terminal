"use client";
import { useState } from "react";
import { useForex } from "@/hooks/useForex";
import { LoadingState } from "@/components/data-display/LoadingState";
import { FX_CURRENCIES, MAJOR_FX_PAIRS } from "@/lib/constants";
import type { Security } from "@/lib/types";

function parsePair(pair: string): { base: string; quote: string } {
  return { base: pair.slice(0, 3), quote: pair.slice(3, 6) };
}

function computeRate(base: string, quote: string, rates: Record<string, number>): number | null {
  // rates are USD-based: rates[XXX] = how many XXX per 1 USD
  const baseRate = base === "USD" ? 1 : rates[base];
  const quoteRate = quote === "USD" ? 1 : rates[quote];
  if (!baseRate || !quoteRate) return null;
  // rate = quoteRate / baseRate (how many quote per 1 base)
  return quoteRate / baseRate;
}

export function FXMonitor({ security }: { security?: Security | null }) {
  void security;
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const { data, isLoading } = useForex("USD");

  if (isLoading) return <LoadingState />;

  const rates: Record<string, number> = data?.rates || {};

  const pairData = MAJOR_FX_PAIRS.map((pairStr) => {
    const { base, quote } = parsePair(pairStr);
    const rate = computeRate(base, quote, rates);
    if (rate === null) return null;
    const isJpy = base === "JPY" || quote === "JPY";
    const decimals = isJpy ? 2 : 4;
    const bid = rate * 0.9999;
    const ask = rate * 1.0001;
    const spread = ((ask - bid) / bid) * 10000; // spread in pips
    return {
      pair: pairStr,
      display: `${base}/${quote}`,
      rate,
      bid,
      ask,
      spread,
      decimals,
    };
  }).filter(Boolean) as {
    pair: string;
    display: string;
    rate: number;
    bid: number;
    ask: number;
    spread: number;
    decimals: number;
  }[];

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="flex items-center gap-2 mb-1">
        <div className="bb-section-header flex-1">FX MONITOR</div>
        <label className="text-[10px] text-bloomberg-muted">BASE:</label>
        <select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)} className="bb-input text-xs">
          {FX_CURRENCIES.map((c) => (<option key={c.code} value={c.code}>{c.code}</option>))}
        </select>
      </div>
      <div className="border border-bloomberg-border">
        <div className="bb-section-header">MAJOR FX PAIRS</div>
        <table className="bb-table">
          <thead>
            <tr>
              <th>Pair</th>
              <th className="text-right">Rate</th>
              <th className="text-right">Bid</th>
              <th className="text-right">Ask</th>
              <th className="text-right">Spread (pips)</th>
            </tr>
          </thead>
          <tbody>
            {pairData.map((p) => (
              <tr key={p.pair}>
                <td className="text-bloomberg-amber font-bold">{p.display}</td>
                <td className="text-right num text-bloomberg-white">{p.rate.toFixed(p.decimals)}</td>
                <td className="text-right num text-bloomberg-green">{p.bid.toFixed(p.decimals)}</td>
                <td className="text-right num text-bloomberg-red">{p.ask.toFixed(p.decimals)}</td>
                <td className="text-right num text-bloomberg-muted">{p.spread.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
