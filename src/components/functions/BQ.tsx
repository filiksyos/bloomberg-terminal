"use client";
import { useStockQuote } from "@/hooks/useStockQuote";
import { useStockProfile } from "@/hooks/useStockProfile";
import { useCandles } from "@/hooks/useCandles";
import { PriceDisplay } from "@/components/data-display/PriceDisplay";
import { LoadingState } from "@/components/data-display/LoadingState";
import { LineChart } from "@/components/charts/LineChart";
import { formatPrice, formatLargeNumber, formatVolume } from "@/lib/formatters";
import type { Security } from "@/lib/types";

export function BQ({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const { data: quote, isLoading: ql } = useStockQuote(symbol);
  const { data: profile, isLoading: pl } = useStockProfile(symbol);

  const now = Math.floor(Date.now() / 1000);
  const from = now - 86400;
  const { data: candles } = useCandles(symbol, "5", from, now);

  if (!security) return <div className="flex items-center justify-center h-full text-bloomberg-amber text-[11px]">Enter a security (e.g., AAPL &lt;GO&gt;)</div>;
  if (ql || pl) return <LoadingState />;

  const chartData = (candles || []).map((c) => ({
    date: new Date(c.time * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    value: c.close,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = profile as any;

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="grid grid-cols-[1fr_1fr] gap-1">
        {/* Left: Price & Quote Data */}
        <div className="border border-bloomberg-border p-1">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">QUOTE</div>
          {quote && (
            <div className="space-y-1">
              <PriceDisplay price={quote.price} change={quote.change} changePercent={quote.changePercent} size="lg" />
              <div className="grid grid-cols-2 gap-x-3 text-[10px]">
                <div className="flex justify-between"><span className="text-bloomberg-amber text-[9px]">Open</span><span>${formatPrice(quote.open)}</span></div>
                <div className="flex justify-between"><span className="text-bloomberg-amber text-[9px]">Prev Close</span><span>${formatPrice(quote.prevClose)}</span></div>
                <div className="flex justify-between"><span className="text-bloomberg-amber text-[9px]">High</span><span>${formatPrice(quote.high)}</span></div>
                <div className="flex justify-between"><span className="text-bloomberg-amber text-[9px]">Low</span><span>${formatPrice(quote.low)}</span></div>
                <div className="flex justify-between"><span className="text-bloomberg-amber text-[9px]">52W High</span><span>{p?.week52High ? `$${formatPrice(p.week52High)}` : "--"}</span></div>
                <div className="flex justify-between"><span className="text-bloomberg-amber text-[9px]">52W Low</span><span>{p?.week52Low ? `$${formatPrice(p.week52Low)}` : "--"}</span></div>
                <div className="flex justify-between"><span className="text-bloomberg-amber text-[9px]">Mkt Cap</span><span>{profile?.marketCap ? formatLargeNumber(profile.marketCap) : "--"}</span></div>
                <div className="flex justify-between"><span className="text-bloomberg-amber text-[9px]">Avg Vol</span><span>{p?.avgVolume ? formatVolume(p.avgVolume) : "--"}</span></div>
                <div className="flex justify-between"><span className="text-bloomberg-amber text-[9px]">P/E</span><span>{p?.peRatio?.toFixed(2) || "--"}</span></div>
                <div className="flex justify-between"><span className="text-bloomberg-amber text-[9px]">EPS</span><span>{p?.eps ? `$${p.eps.toFixed(2)}` : "--"}</span></div>
                <div className="flex justify-between"><span className="text-bloomberg-amber text-[9px]">Div Yield</span><span>{p?.dividendYield ? `${(p.dividendYield * 100).toFixed(2)}%` : "--"}</span></div>
                <div className="flex justify-between"><span className="text-bloomberg-amber text-[9px]">Beta</span><span>{p?.beta?.toFixed(2) || "--"}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Intraday chart */}
        <div className="border border-bloomberg-border p-1">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">INTRADAY</div>
          {chartData.length > 0 ? (
            <LineChart data={chartData} dataKey="value" height={180} color="#fb8b1e" />
          ) : (
            <div className="flex items-center justify-center h-[180px] text-bloomberg-muted text-[10px]">No intraday data</div>
          )}
        </div>
      </div>

      {/* Company Info Bar */}
      {profile && (
        <div className="border border-bloomberg-border p-1">
          <div className="flex items-center gap-4 text-[10px]">
            <span className="text-bloomberg-white font-bold">{profile.name}</span>
            <span className="text-bloomberg-muted">{profile.exchange}</span>
            <span className="text-bloomberg-muted">{profile.sector}</span>
            <span className="text-bloomberg-muted">{profile.industry}</span>
            <span className="text-bloomberg-muted ml-auto">{profile.country}</span>
          </div>
        </div>
      )}

      {/* Day Range Visual */}
      {quote && (
        <div className="border border-bloomberg-border p-1">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">DAY RANGE</div>
          <div className="flex items-center gap-2 text-[10px]">
            <span>${formatPrice(quote.low)}</span>
            <div className="flex-1 h-1.5 bg-bloomberg-border rounded-full relative">
              <div
                className="absolute top-0 h-full bg-bloomberg-amber rounded-full"
                style={{ left: 0, width: `${Math.min(100, Math.max(0, ((quote.price - quote.low) / (quote.high - quote.low || 1)) * 100))}%` }}
              />
            </div>
            <span>${formatPrice(quote.high)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
