"use client";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatLargeNumber } from "@/lib/formatters";
import type { Security } from "@/lib/types";

interface IPOEvent {
  date: string;
  symbol: string;
  name: string;
  exchange: string;
  shares: number | null;
  priceRange: string;
  status: string;
}

export function IPO({ security }: { security?: Security | null }) {
  void security;

  const { data: ipos, isLoading } = useQuery<IPOEvent[]>({
    queryKey: ["ipo-calendar"],
    queryFn: async () => {
      const res = await fetch("/api/stocks/ipos");
      const data = await res.json();
      return data.ipos || [];
    },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="border border-bloomberg-border">
        <div className="bb-section-header">IPO CALENDAR</div>
        <table className="bb-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Symbol</th>
              <th>Company</th>
              <th>Exchange</th>
              <th className="text-right">Shares</th>
              <th className="text-right">Price Range</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(ipos || []).map((ipo, i) => (
              <tr key={`${ipo.symbol}-${i}`}>
                <td className="text-bloomberg-muted">{ipo.date}</td>
                <td className="text-bloomberg-amber font-bold">{ipo.symbol || "--"}</td>
                <td className="text-bloomberg-white truncate max-w-[200px]">{ipo.name}</td>
                <td className="text-bloomberg-muted">{ipo.exchange}</td>
                <td className="text-right num">{ipo.shares ? formatLargeNumber(ipo.shares) : "--"}</td>
                <td className="text-right num">{ipo.priceRange || "--"}</td>
                <td>
                  <span className={`text-[9px] font-bold ${ipo.status === "priced" ? "text-bloomberg-green" : ipo.status === "upcoming" ? "text-bloomberg-amber" : "text-bloomberg-muted"}`}>
                    {ipo.status?.toUpperCase() || "--"}
                  </span>
                </td>
              </tr>
            ))}
            {(!ipos || ipos.length === 0) && (
              <tr><td colSpan={7} className="text-center text-bloomberg-muted py-2">No upcoming IPOs found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
