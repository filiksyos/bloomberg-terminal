"use client";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPercent, formatPrice, getChangeColor } from "@/lib/formatters";
import { SECTOR_ETFS } from "@/lib/constants";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import type { Security } from "@/lib/types";

interface SectorData {
  sector: string;
  etf: string;
  price: number;
  change: number;
  changePercent: number;
  color: string;
}

export function GIP({ security }: { security?: Security | null }) {
  void security;

  const { data: sectors, isLoading } = useQuery<SectorData[]>({
    queryKey: ["sector-performance"],
    queryFn: async () => {
      // Fetch all sector ETF quotes
      const promises = SECTOR_ETFS.map(async (s) => {
        try {
          const res = await fetch(`/api/stocks/quote/${s.etf}`);
          const data = await res.json();
          return {
            sector: s.sector,
            etf: s.etf,
            price: data.price || 0,
            change: data.change || 0,
            changePercent: data.changePercent || 0,
            color: s.color,
          };
        } catch {
          return { sector: s.sector, etf: s.etf, price: 0, change: 0, changePercent: 0, color: s.color };
        }
      });
      const res = await Promise.all(promises);
      return res.sort((a, b) => b.changePercent - a.changePercent);
    },
    refetchInterval: 30000,
  });

  if (isLoading) return <LoadingState />;

  const chartData = (sectors || []).map((s) => ({
    name: s.sector.slice(0, 8),
    value: s.changePercent,
  }));

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="border border-bloomberg-border p-1">
        <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">S&P 500 SECTOR PERFORMANCE</div>
        <BarChartComponent data={chartData} height={160} showColors />
      </div>

      <div className="border border-bloomberg-border">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Sector</th>
              <th>ETF</th>
              <th className="text-right">Price</th>
              <th className="text-right">Change</th>
              <th className="text-right">Chg%</th>
              <th className="text-right">Performance</th>
            </tr>
          </thead>
          <tbody>
            {(sectors || []).map((s) => (
              <tr key={s.etf}>
                <td className="text-bloomberg-white font-bold">{s.sector}</td>
                <td className="text-bloomberg-amber">{s.etf}</td>
                <td className="text-right num">${formatPrice(s.price)}</td>
                <td className={`text-right num ${getChangeColor(s.change)}`}>
                  {s.change >= 0 ? "+" : ""}{formatPrice(s.change)}
                </td>
                <td className={`text-right num ${getChangeColor(s.changePercent)}`}>
                  {formatPercent(s.changePercent)}
                </td>
                <td className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <div className="w-16 h-1.5 bg-bloomberg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.changePercent >= 0 ? "bg-bloomberg-green" : "bg-bloomberg-red"}`}
                        style={{ width: `${Math.min(100, Math.abs(s.changePercent) * 20)}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
