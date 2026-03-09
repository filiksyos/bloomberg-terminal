"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice, formatPercent, formatVolume, getChangeColor } from "@/lib/formatters";
import type { Security } from "@/lib/types";

const TABS = [
  { key: "gainers", label: "Top Gainers" },
  { key: "losers", label: "Top Losers" },
  { key: "actives", label: "Most Active" },
] as const;

interface MoverItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export function MOST({ security }: { security?: Security | null }) {
  void security;
  const [tab, setTab] = useState<string>("gainers");

  const { data, isLoading } = useQuery<MoverItem[]>({
    queryKey: ["movers", tab],
    queryFn: async () => {
      const res = await fetch(`/api/stocks/movers?type=${tab}`);
      if (!res.ok) throw new Error("Failed to fetch movers");
      return res.json();
    },
    staleTime: 300000,
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-1 p-1 border-b border-bloomberg-border shrink-0">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`bb-btn text-[10px] ${tab === t.key ? "bb-btn-active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="bb-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Symbol</th>
                <th>Name</th>
                <th className="text-right">Price</th>
                <th className="text-right">Change</th>
                <th className="text-right">Chg%</th>
                <th className="text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              {(data || []).map((item, i) => (
                <tr key={item.symbol}>
                  <td className="text-bloomberg-muted">{i + 1}</td>
                  <td className="text-bloomberg-amber font-bold">{item.symbol}</td>
                  <td className="text-bloomberg-white truncate max-w-[160px]">{item.name}</td>
                  <td className="text-right num">${formatPrice(item.price)}</td>
                  <td className={`text-right num ${getChangeColor(item.change)}`}>
                    {item.change > 0 ? "+" : ""}
                    {formatPrice(item.change)}
                  </td>
                  <td className={`text-right num ${getChangeColor(item.changePercent)}`}>
                    {formatPercent(item.changePercent)}
                  </td>
                  <td className="text-right num text-bloomberg-muted">
                    {formatVolume(item.volume)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
