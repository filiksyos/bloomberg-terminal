"use client";
import { useMemo } from "react";
import { useStockQuote } from "@/hooks/useStockQuote";
import { useCandles } from "@/hooks/useCandles";
import { PriceDisplay } from "@/components/data-display/PriceDisplay";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice, formatPercent, getChangeColor } from "@/lib/formatters";
import type { Security } from "@/lib/types";

const PERIOD_LABELS = [
  { label: "1D", days: 1 },
  { label: "5D", days: 5 },
  { label: "1M", days: 21 },
  { label: "3M", days: 63 },
  { label: "6M", days: 126 },
  { label: "YTD", days: 0 }, // special handling
  { label: "1Y", days: 252 },
] as const;

export function MOV({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const { data: quote, isLoading } = useStockQuote(symbol);

  const now = useMemo(() => Math.floor(Date.now() / 1000), []);
  const from = useMemo(() => now - 365 * 86400, [now]);
  const { data: candles } = useCandles(symbol, "D", from, now);

  if (!security)
    return (
      <div className="flex items-center justify-center h-full text-bloomberg-amber text-sm">
        Enter a security in the command bar (e.g., AAPL)
      </div>
    );
  if (isLoading) return <LoadingState />;
  if (!quote)
    return (
      <div className="flex items-center justify-center h-full text-bloomberg-muted text-sm">
        NO DATA
      </div>
    );

  const range52 =
    quote.high > 0 && quote.low > 0
      ? ((quote.price - quote.low) / (quote.high - quote.low)) * 100
      : 50;

  // Calculate period returns from candle data
  const getReturn = (daysBack: number): number | null => {
    if (!candles || candles.length === 0) return null;
    const latest = candles[candles.length - 1].close;

    if (daysBack === 0) {
      // YTD: find first candle of current year
      const currentYear = new Date().getFullYear();
      const ytdCandle = candles.find(
        (c) => new Date(c.time * 1000).getFullYear() === currentYear
      );
      if (!ytdCandle) return null;
      return ((latest - ytdCandle.close) / ytdCandle.close) * 100;
    }

    const targetIdx = Math.max(0, candles.length - 1 - daysBack);
    const base = candles[targetIdx].close;
    if (base === 0) return null;
    return ((latest - base) / base) * 100;
  };

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">{symbol} -- PRICE MOVEMENT</div>

      {/* Price Display */}
      <div className="border border-bloomberg-border p-2">
        <PriceDisplay
          price={quote.price}
          change={quote.change}
          changePercent={quote.changePercent}
          size="lg"
        />
      </div>

      {/* Day Range */}
      <div className="border border-bloomberg-border p-1">
        <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-1">
          Day Range
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-bloomberg-muted">${formatPrice(quote.low)}</span>
          <div className="flex-1 h-2 bg-bloomberg-panel-alt rounded relative">
            <div
              className="absolute h-full bg-bloomberg-amber rounded"
              style={{ width: `${range52}%` }}
            />
          </div>
          <span className="text-bloomberg-muted">${formatPrice(quote.high)}</span>
        </div>
      </div>

      {/* 52-Week Range */}
      {candles && candles.length > 0 && (
        <div className="border border-bloomberg-border p-1">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-1">
            52-Week Range
          </div>
          {(() => {
            const high52 = Math.max(...candles.map((c) => c.high));
            const low52 = Math.min(...candles.map((c) => c.low));
            const position =
              high52 > low52
                ? ((quote.price - low52) / (high52 - low52)) * 100
                : 50;
            return (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-bloomberg-muted">
                  ${formatPrice(low52)}
                </span>
                <div className="flex-1 h-2 bg-bloomberg-panel-alt rounded relative">
                  <div
                    className="absolute h-full bg-cyan-500 rounded"
                    style={{ width: `${Math.min(100, Math.max(0, position))}%` }}
                  />
                  <div
                    className="absolute top-[-2px] w-1 h-3 bg-bloomberg-white rounded-sm"
                    style={{
                      left: `${Math.min(100, Math.max(0, position))}%`,
                      transform: "translateX(-50%)",
                    }}
                  />
                </div>
                <span className="text-bloomberg-muted">
                  ${formatPrice(high52)}
                </span>
              </div>
            );
          })()}
        </div>
      )}

      {/* Period Returns */}
      {candles && candles.length > 0 && (
        <div className="border border-bloomberg-border p-1">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-1">
            Period Returns
          </div>
          <div className="grid grid-cols-4 gap-1">
            {PERIOD_LABELS.map(({ label, days }) => {
              const ret = getReturn(days);
              return (
                <div
                  key={label}
                  className="border border-bloomberg-border/50 p-1 rounded text-center"
                >
                  <div className="text-[9px] text-bloomberg-muted mb-0.5">
                    {label}
                  </div>
                  <div
                    className={`text-sm font-bold num ${ret !== null ? getChangeColor(ret) : "text-bloomberg-muted"}`}
                  >
                    {ret !== null ? formatPercent(ret) : "--"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Key Data */}
      <div className="border border-bloomberg-border p-1">
        <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-1">
          Key Data
        </div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex justify-between">
            <span className="text-bloomberg-muted">Open</span>
            <span>${formatPrice(quote.open)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bloomberg-muted">Prev Close</span>
            <span>${formatPrice(quote.prevClose)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bloomberg-muted">Day High</span>
            <span>${formatPrice(quote.high)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bloomberg-muted">Day Low</span>
            <span>${formatPrice(quote.low)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bloomberg-muted">Change</span>
            <span className={getChangeColor(quote.change)}>
              {formatPrice(quote.change)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-bloomberg-muted">Change %</span>
            <span className={getChangeColor(quote.changePercent)}>
              {formatPercent(quote.changePercent)}
            </span>
          </div>
        </div>
      </div>

      {/* Volatility */}
      {candles && candles.length > 20 && (
        <div className="border border-bloomberg-border p-1">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-1">
            Volatility
          </div>
          {(() => {
            // Calculate historical volatility from daily returns
            const returns: number[] = [];
            for (let i = 1; i < candles.length; i++) {
              if (candles[i - 1].close > 0) {
                returns.push(
                  Math.log(candles[i].close / candles[i - 1].close)
                );
              }
            }
            const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
            const variance =
              returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) /
              (returns.length - 1);
            const dailyVol = Math.sqrt(variance);
            const annualVol = dailyVol * Math.sqrt(252) * 100;

            return (
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-bloomberg-muted">
                    Hist. Volatility (Ann.)
                  </span>
                  <span>{annualVol.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bloomberg-muted">Daily Vol</span>
                  <span>{(dailyVol * 100).toFixed(2)}%</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
