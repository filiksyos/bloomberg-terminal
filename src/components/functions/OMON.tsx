"use client";
import { useState } from "react";
import { useOptions } from "@/hooks/useOptions";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice, getChangeColor } from "@/lib/formatters";
import type { Security } from "@/lib/types";

export function OMON({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const [selectedExpiration, setSelectedExpiration] = useState<string | undefined>();
  const { data: chain, isLoading } = useOptions(symbol, selectedExpiration);

  if (!symbol) {
    return (
      <div className="flex items-center justify-center h-full text-bloomberg-muted">
        <div className="text-center">
          <div className="text-lg mb-2">OPTIONS MONITOR</div>
          <div className="text-sm">Enter a security symbol to view options chain</div>
        </div>
      </div>
    );
  }

  if (isLoading) return <LoadingState />;

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="flex items-center gap-2">
        <div className="bb-section-header flex-1">OPTIONS MONITOR - {symbol}</div>
        {chain?.underlyingPrice && (
          <span className="text-bloomberg-white text-sm">Underlying: ${formatPrice(chain.underlyingPrice)}</span>
        )}
      </div>

      {chain?.expirationDates && (
        <div className="flex flex-wrap gap-1">
          {chain.expirationDates.map((exp) => (
            <button key={exp} onClick={() => setSelectedExpiration(exp)} className={`bb-btn text-[10px] ${(selectedExpiration || chain.selectedExpiration) === exp ? "bb-btn-active" : ""}`}>
              {exp}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1 border border-bloomberg-border">
          <div className="bb-section-header">CALLS</div>
          <div className="max-h-[400px] overflow-auto">
            <table className="bb-table">
              <thead>
                <tr><th className="text-right">Strike</th><th className="text-right">Last</th><th className="text-right">Bid</th><th className="text-right">Ask</th><th className="text-right">Vol</th><th className="text-right">OI</th><th className="text-right">IV</th><th className="text-right">Delta</th></tr>
              </thead>
              <tbody>
                {(chain?.calls || []).map((c) => (
                  <tr key={c.contractSymbol} className={c.inTheMoney ? "bg-bloomberg-panel-alt" : ""}>
                    <td className="text-right num text-bloomberg-amber font-bold">{formatPrice(c.strike)}</td>
                    <td className="text-right num">${formatPrice(c.lastPrice)}</td>
                    <td className="text-right num text-bloomberg-green">${formatPrice(c.bid)}</td>
                    <td className="text-right num text-bloomberg-red">${formatPrice(c.ask)}</td>
                    <td className="text-right num">{c.volume}</td>
                    <td className="text-right num">{c.openInterest}</td>
                    <td className="text-right num">{(c.impliedVolatility * 100).toFixed(1)}%</td>
                    <td className="text-right num">{c.delta?.toFixed(3) || "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-1 border border-bloomberg-border">
          <div className="bb-section-header">PUTS</div>
          <div className="max-h-[400px] overflow-auto">
            <table className="bb-table">
              <thead>
                <tr><th className="text-right">Strike</th><th className="text-right">Last</th><th className="text-right">Bid</th><th className="text-right">Ask</th><th className="text-right">Vol</th><th className="text-right">OI</th><th className="text-right">IV</th><th className="text-right">Delta</th></tr>
              </thead>
              <tbody>
                {(chain?.puts || []).map((p) => (
                  <tr key={p.contractSymbol} className={p.inTheMoney ? "bg-bloomberg-panel-alt" : ""}>
                    <td className="text-right num text-bloomberg-amber font-bold">{formatPrice(p.strike)}</td>
                    <td className="text-right num">${formatPrice(p.lastPrice)}</td>
                    <td className="text-right num text-bloomberg-green">${formatPrice(p.bid)}</td>
                    <td className="text-right num text-bloomberg-red">${formatPrice(p.ask)}</td>
                    <td className="text-right num">{p.volume}</td>
                    <td className="text-right num">{p.openInterest}</td>
                    <td className="text-right num">{(p.impliedVolatility * 100).toFixed(1)}%</td>
                    <td className="text-right num">{p.delta?.toFixed(3) || "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
