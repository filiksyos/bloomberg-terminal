"use client";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/data-display/LoadingState";
import { YieldCurveChart } from "@/components/charts/YieldCurveChart";
import { formatPercent, getChangeColor } from "@/lib/formatters";
import type { Security, YieldCurvePoint } from "@/lib/types";

export function WB({ security }: { security?: Security | null }) {
  void security;
  const { data, isLoading } = useQuery({
    queryKey: ["yields"],
    queryFn: async () => {
      const res = await fetch("/api/economic/yields");
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<YieldCurvePoint[]>;
    },
    staleTime: 300000,
  });

  if (isLoading) return <LoadingState />;
  const yields = data || [];

  const spread10y2y = (() => {
    const y10 = yields.find((y) => y.maturity === "10Y");
    const y2 = yields.find((y) => y.maturity === "2Y");
    return y10 && y2 ? y10.yield - y2.yield : null;
  })();

  const spread10y3m = (() => {
    const y10 = yields.find((y) => y.maturity === "10Y");
    const y3m = yields.find((y) => y.maturity === "3M");
    return y10 && y3m ? y10.yield - y3m.yield : null;
  })();

  const spread30y5y = (() => {
    const y30 = yields.find((y) => y.maturity === "30Y");
    const y5 = yields.find((y) => y.maturity === "5Y");
    return y30 && y5 ? y30.yield - y5.yield : null;
  })();

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">US TREASURY YIELDS</div>
      <div className="border border-bloomberg-border">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Maturity</th><th className="text-right">Yield</th>
              <th className="text-right">Change</th><th className="text-right">Previous</th>
            </tr>
          </thead>
          <tbody>
            {yields.map((y) => (
              <tr key={y.maturity}>
                <td className="text-bloomberg-amber font-bold">{y.maturity}</td>
                <td className="text-right num">{y.yield.toFixed(3)}%</td>
                <td className={`text-right num ${getChangeColor(y.change)}`}>{formatPercent(y.change, 3)}</td>
                <td className="text-right num">{y.previousYield.toFixed(3)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {yields.length > 0 && (
        <div className="border border-bloomberg-border p-1">
          <div className="text-[10px] text-bloomberg-amber font-bold uppercase px-1 mb-1">Yield Curve</div>
          <YieldCurveChart data={yields} height={200} />
        </div>
      )}

      <div className="border border-bloomberg-border p-2">
        <div className="text-[10px] text-bloomberg-amber font-bold uppercase mb-2">Key Spreads</div>
        <div className="grid grid-cols-3 gap-1 text-xs">
          {spread10y2y !== null && (
            <div className="flex justify-between">
              <span className="text-bloomberg-muted">10Y-2Y Spread:</span>
              <span className={getChangeColor(spread10y2y)}>{formatPercent(spread10y2y, 3)}</span>
            </div>
          )}
          {spread10y3m !== null && (
            <div className="flex justify-between">
              <span className="text-bloomberg-muted">10Y-3M Spread:</span>
              <span className={getChangeColor(spread10y3m)}>{formatPercent(spread10y3m, 3)}</span>
            </div>
          )}
          {spread30y5y !== null && (
            <div className="flex justify-between">
              <span className="text-bloomberg-muted">30Y-5Y Spread:</span>
              <span className={getChangeColor(spread30y5y)}>{formatPercent(spread30y5y, 3)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
