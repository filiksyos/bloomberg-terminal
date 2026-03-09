"use client";
import { useState } from "react";
import { useWatchlistStore } from "@/store/watchlistStore";
import { useQueries } from "@tanstack/react-query";
import { formatPrice, formatPercent, getChangeColor } from "@/lib/formatters";
import { SparklineChart } from "@/components/data-display/SparklineChart";
import type { Security, StockQuote } from "@/lib/types";

export function Watchlist({ security }: { security?: Security | null }) {
  void security;
  const watchlists = useWatchlistStore((s) => s.watchlists);
  const activeWatchlistId = useWatchlistStore((s) => s.activeWatchlistId);
  const setActiveWatchlist = useWatchlistStore((s) => s.setActiveWatchlist);
  const createWatchlist = useWatchlistStore((s) => s.createWatchlist);
  const addSymbol = useWatchlistStore((s) => s.addSymbol);
  const removeSymbol = useWatchlistStore((s) => s.removeSymbol);

  const [newSymbol, setNewSymbol] = useState("");
  const activeWl = watchlists.find((w) => w.id === activeWatchlistId);

  const quotes = useQueries({
    queries: (activeWl?.symbols || []).map((symbol) => ({
      queryKey: ["stock-quote", symbol],
      queryFn: async () => {
        const res = await fetch(`/api/stocks/quote/${symbol}`);
        if (!res.ok) throw new Error("Failed");
        return res.json() as Promise<StockQuote>;
      },
      refetchInterval: 15000,
      staleTime: 10000,
    })),
  });

  const handleAdd = () => {
    if (!newSymbol || !activeWatchlistId) return;
    addSymbol(activeWatchlistId, newSymbol);
    setNewSymbol("");
  };

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="flex items-center gap-2 mb-1">
        <div className="bb-section-header flex-1">WATCHLIST</div>
        <select value={activeWatchlistId} onChange={(e) => setActiveWatchlist(e.target.value)} className="bb-input text-xs">
          {watchlists.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}
        </select>
        <button onClick={() => createWatchlist(`Watchlist ${watchlists.length + 1}`)} className="bb-btn text-[10px]">NEW</button>
      </div>

      <div className="flex gap-2 items-center">
        <input value={newSymbol} onChange={(e) => setNewSymbol(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && handleAdd()} className="bb-input w-28" placeholder="Add symbol..." />
        <button onClick={handleAdd} className="bb-btn text-[10px]">ADD</button>
      </div>

      <div className="border border-bloomberg-border">
        <table className="bb-table">
          <thead>
            <tr><th>Symbol</th><th className="text-right">Last</th><th className="text-right">Change</th><th className="text-right">Chg%</th><th className="text-right">High</th><th className="text-right">Low</th><th className="text-right">Volume</th><th></th></tr>
          </thead>
          <tbody>
            {(activeWl?.symbols || []).map((symbol, i) => {
              const quote = quotes[i]?.data;
              return (
                <tr key={symbol}>
                  <td className="text-bloomberg-amber font-bold">{symbol}</td>
                  <td className="text-right num">{quote ? `$${formatPrice(quote.price)}` : "--"}</td>
                  <td className={`text-right num ${getChangeColor(quote?.change || 0)}`}>
                    {quote ? `${quote.change >= 0 ? "+" : ""}${formatPrice(quote.change)}` : "--"}
                  </td>
                  <td className={`text-right num ${getChangeColor(quote?.changePercent || 0)}`}>
                    {quote ? formatPercent(quote.changePercent) : "--"}
                  </td>
                  <td className="text-right num">{quote ? `$${formatPrice(quote.high)}` : "--"}</td>
                  <td className="text-right num">{quote ? `$${formatPrice(quote.low)}` : "--"}</td>
                  <td className="text-right num">--</td>
                  <td>
                    <button onClick={() => removeSymbol(activeWatchlistId, symbol)} className="text-bloomberg-red text-[10px] hover:underline">DEL</button>
                  </td>
                </tr>
              );
            })}
            {(activeWl?.symbols || []).length === 0 && (
              <tr><td colSpan={8} className="text-center text-bloomberg-muted py-4">Watchlist is empty</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
