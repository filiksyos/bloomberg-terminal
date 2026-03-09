"use client";
import { useIndices } from "@/hooks/useIndices";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice, formatPercent, getChangeColor } from "@/lib/formatters";
import type { Security } from "@/lib/types";

const REGIONS = [
  { key: "americas", label: "AMERICAS" },
  { key: "emea", label: "EMEA" },
  { key: "apac", label: "ASIA PACIFIC" },
];

export function WEI({ security }: { security?: Security | null }) {
  void security;
  const { data, isLoading } = useIndices();

  if (isLoading) return <LoadingState />;

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">WORLD EQUITY INDICES</div>
      {REGIONS.map((region) => {
        const indices = (data || []).filter((idx: Record<string, unknown>) => idx.region === region.key);
        if (indices.length === 0) return null;
        return (
          <div key={region.key} className="border border-bloomberg-border">
            <div className="bb-section-header">{region.label}</div>
            <table className="bb-table">
              <thead>
                <tr>
                  <th>Index</th><th>ETF</th><th className="text-right">Last</th>
                  <th className="text-right">Change</th><th className="text-right">Chg%</th>
                  <th className="text-right">High</th><th className="text-right">Low</th>
                </tr>
              </thead>
              <tbody>
                {indices.map((idx: Record<string, unknown>) => (
                  <tr key={String(idx.etf)}>
                    <td className="text-bloomberg-white">{String(idx.name)}</td>
                    <td className="text-bloomberg-amber font-bold">{String(idx.etf)}</td>
                    <td className="text-right num">${formatPrice(idx.price as number)}</td>
                    <td className={`text-right num ${getChangeColor(idx.change as number)}`}>
                      {(idx.change as number) > 0 ? "+" : ""}{formatPrice(idx.change as number)}
                    </td>
                    <td className={`text-right num ${getChangeColor(idx.changePercent as number)}`}>
                      {formatPercent(idx.changePercent as number)}
                    </td>
                    <td className="text-right num">${formatPrice(idx.high as number)}</td>
                    <td className="text-right num">${formatPrice(idx.low as number)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
