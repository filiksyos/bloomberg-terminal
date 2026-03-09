"use client";
import { usePeers } from "@/hooks/usePeers";
import { useStockQuote } from "@/hooks/useStockQuote";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice, formatPercent, formatLargeNumber, getChangeColor } from "@/lib/formatters";
import type { Security } from "@/lib/types";

export function COMP({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const { data, isLoading } = usePeers(symbol);
  const { data: quote } = useStockQuote(symbol);

  if (!security) return <div className="flex items-center justify-center h-full text-bloomberg-amber text-sm">Enter a security in the command bar (e.g., AAPL)</div>;
  if (isLoading) return <LoadingState />;

  const peerData = data?.peerData || [];

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">{symbol} — COMPARABLE COMPANIES</div>
      <div className="border border-bloomberg-border overflow-auto">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th><th>Name</th><th className="text-right">Price</th><th className="text-right">Chg%</th>
              <th className="text-right">Mkt Cap</th><th className="text-right">P/E</th>
              <th className="text-right">P/B</th><th className="text-right">EV/EBITDA</th><th className="text-right">Beta</th>
              <th className="text-right">Div Yield</th><th className="text-right">ROE</th>
            </tr>
          </thead>
          <tbody>
            {quote && (
              <tr className="!bg-bloomberg-amber/10">
                <td className="text-bloomberg-amber font-bold">{symbol}</td>
                <td className="text-bloomberg-white truncate max-w-[150px]">{security?.name || "-"}</td>
                <td className="text-right num">${formatPrice(quote.price)}</td>
                <td className={`text-right num ${getChangeColor(quote.changePercent)}`}>{formatPercent(quote.changePercent)}</td>
                <td className="text-right num">-</td>
                <td className="text-right num">-</td>
                <td className="text-right num">-</td>
                <td className="text-right num">-</td>
                <td className="text-right num">-</td>
                <td className="text-right num">-</td>
                <td className="text-right num">-</td>
              </tr>
            )}
            {peerData.map((p: Record<string, unknown>, i: number) => (
              <tr key={i}>
                <td className="font-bold">{String(p.symbol)}</td>
                <td className="text-bloomberg-white truncate max-w-[150px]">{String(p.name || p.companyName || p.symbol)}</td>
                <td className="text-right num">${formatPrice(p.price as number)}</td>
                <td className={`text-right num ${getChangeColor(p.changePercent as number)}`}>{formatPercent(p.changePercent as number)}</td>
                <td className="text-right num">{(p.marketCap as number) > 0 ? formatLargeNumber((p.marketCap as number) * 1e6) : "-"}</td>
                <td className="text-right num">{(p.peRatio as number) > 0 ? formatPrice(p.peRatio as number) : "-"}</td>
                <td className="text-right num">{(p.pbRatio as number) > 0 ? formatPrice(p.pbRatio as number) : "-"}</td>
                <td className="text-right num">{(p.evToEbitda as number) > 0 ? formatPrice(p.evToEbitda as number) : "-"}</td>
                <td className="text-right num">{(p.beta as number) ? (p.beta as number).toFixed(2) : "-"}</td>
                <td className="text-right num">{(p.dividendYield as number) > 0 ? formatPercent(p.dividendYield as number) : "-"}</td>
                <td className="text-right num">{(p.roe as number) ? formatPercent(p.roe as number) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
