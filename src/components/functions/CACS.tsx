"use client";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice } from "@/lib/formatters";
import type { Security, DividendData } from "@/lib/types";

interface StockSplit {
  date: string;
  numerator: number;
  denominator: number;
}

export function CACS({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;

  const { data: dividends, isLoading: dl } = useQuery<DividendData[]>({
    queryKey: ["dividends-cacs", symbol],
    queryFn: async () => {
      if (!symbol) return [];
      const res = await fetch(`/api/stocks/dividends/${symbol}`);
      const data = await res.json();
      return data.dividends || [];
    },
    enabled: !!symbol,
  });

  const { data: splits, isLoading: sl } = useQuery<StockSplit[]>({
    queryKey: ["splits", symbol],
    queryFn: async () => {
      if (!symbol) return [];
      const res = await fetch(`/api/stocks/splits/${symbol}`);
      const data = await res.json();
      return data.splits || [];
    },
    enabled: !!symbol,
  });

  if (!security) return <div className="flex items-center justify-center h-full text-bloomberg-amber text-[11px]">Enter a security (e.g., AAPL &lt;GO&gt;)</div>;
  if (dl || sl) return <LoadingState />;

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      {/* Stock Splits */}
      <div className="border border-bloomberg-border">
        <div className="bb-section-header">STOCK SPLITS — {symbol}</div>
        <table className="bb-table">
          <thead>
            <tr><th>Date</th><th className="text-right">Ratio</th></tr>
          </thead>
          <tbody>
            {(splits || []).map((s, i) => (
              <tr key={i}>
                <td className="text-bloomberg-muted">{s.date}</td>
                <td className="text-right text-bloomberg-amber font-bold">{s.numerator}:{s.denominator}</td>
              </tr>
            ))}
            {(!splits || splits.length === 0) && (
              <tr><td colSpan={2} className="text-center text-bloomberg-muted py-2">No stock splits recorded</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dividend History */}
      <div className="border border-bloomberg-border">
        <div className="bb-section-header">DIVIDEND HISTORY — {symbol}</div>
        <div className="max-h-[400px] overflow-auto">
          <table className="bb-table">
            <thead>
              <tr><th>Ex-Date</th><th>Pay Date</th><th className="text-right">Amount</th><th>Currency</th></tr>
            </thead>
            <tbody>
              {(dividends || []).map((d, i) => (
                <tr key={i}>
                  <td className="text-bloomberg-muted">{d.exDate}</td>
                  <td className="text-bloomberg-muted">{d.payDate}</td>
                  <td className="text-right text-bloomberg-green font-bold">${formatPrice(d.amount)}</td>
                  <td className="text-bloomberg-muted">{d.currency}</td>
                </tr>
              ))}
              {(!dividends || dividends.length === 0) && (
                <tr><td colSpan={4} className="text-center text-bloomberg-muted py-2">No dividend history</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
