"use client";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatLargeNumber } from "@/lib/formatters";
import type { Security } from "@/lib/types";

interface Executive {
  name: string;
  title: string;
  pay: number | null;
  yearBorn: number | null;
}

export function MGMT({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;

  const { data: executives, isLoading } = useQuery<Executive[]>({
    queryKey: ["executives", symbol],
    queryFn: async () => {
      if (!symbol) return [];
      const res = await fetch(`/api/stocks/executives/${symbol}`);
      const data = await res.json();
      return data.executives || [];
    },
    enabled: !!symbol,
  });

  if (!security) return <div className="flex items-center justify-center h-full text-bloomberg-amber text-[11px]">Enter a security (e.g., AAPL &lt;GO&gt;)</div>;
  if (isLoading) return <LoadingState />;

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="border border-bloomberg-border">
        <div className="bb-section-header">KEY EXECUTIVES — {symbol}</div>
        <table className="bb-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Title</th>
              <th className="text-right">Compensation</th>
              <th className="text-right">Year Born</th>
            </tr>
          </thead>
          <tbody>
            {(executives || []).map((exec, i) => (
              <tr key={i}>
                <td className="text-bloomberg-white font-bold">{exec.name}</td>
                <td className="text-bloomberg-muted">{exec.title}</td>
                <td className="text-right num">{exec.pay ? formatLargeNumber(exec.pay) : "--"}</td>
                <td className="text-right num text-bloomberg-muted">{exec.yearBorn || "--"}</td>
              </tr>
            ))}
            {(!executives || executives.length === 0) && (
              <tr><td colSpan={4} className="text-center text-bloomberg-muted py-2">No executive data available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
