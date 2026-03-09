"use client";
import { usePeers } from "@/hooks/usePeers";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice } from "@/lib/formatters";
import type { Security } from "@/lib/types";

export function RV({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const { data, isLoading } = usePeers(symbol);

  if (!security) return <div className="flex items-center justify-center h-full text-bloomberg-amber text-sm">Enter a security in the command bar (e.g., AAPL)</div>;
  if (isLoading) return <LoadingState />;

  const peerData: Record<string, unknown>[] = data?.peerData || [];
  const metrics = ["peRatio", "pbRatio", "priceToSalesRatio", "evToEbitda", "evToRevenue", "pegRatio"];
  const metricLabels: Record<string, string> = {
    peRatio: "P/E Ratio",
    pbRatio: "P/B Ratio",
    priceToSalesRatio: "P/S Ratio",
    evToEbitda: "EV/EBITDA",
    evToRevenue: "EV/Revenue",
    pegRatio: "PEG Ratio",
  };

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">{symbol} — RELATIVE VALUATION</div>
      {metrics.map((metric) => {
        const values = peerData.map((p) => p[metric] as number).filter((v) => v != null && v > 0);
        if (values.length === 0) return null;
        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const range = max - min || 1;

        return (
          <div key={metric} className="border border-bloomberg-border p-1">
            <div className="flex justify-between mb-0.5">
              <span className="text-[9px] text-bloomberg-amber font-bold uppercase">{metricLabels[metric]}</span>
              <span className="text-xs text-bloomberg-muted">Avg: {formatPrice(avg)}</span>
            </div>
            <div className="relative h-4 bg-bloomberg-panel-alt rounded">
              <div className="absolute h-full bg-bloomberg-border/50 rounded" style={{ left: "0%", width: "100%" }} />
              {peerData.map((p, i) => {
                const val = p[metric] as number;
                if (!val || val <= 0) return null;
                const pos = ((val - min) / range) * 100;
                const isSelf = p.symbol === symbol;
                return (
                  <div
                    key={i}
                    className={`absolute top-0 w-2 h-4 rounded ${isSelf ? "bg-bloomberg-amber" : "bg-bloomberg-blue/60"}`}
                    style={{ left: `${Math.min(pos, 98)}%` }}
                    title={`${p.symbol}: ${formatPrice(val)}`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] text-bloomberg-muted mt-0.5">
              <span>{formatPrice(min)}</span>
              <span>{formatPrice(max)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
