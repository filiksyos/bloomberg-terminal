"use client";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/data-display/LoadingState";
import { YieldCurveChart } from "@/components/charts/YieldCurveChart";
import { formatPercent, getChangeColor } from "@/lib/formatters";
import type { Security, YieldCurvePoint } from "@/lib/types";

export function CRVF({ security }: { security?: Security | null }) {
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

  // Check for inversion: any shorter maturity with higher yield than a longer one
  const isInverted = yields.some((point, i, arr) => {
    if (i === 0) return false;
    return point.yield < arr[i - 1].yield;
  });

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">YIELD CURVE VISUALIZATION</div>

      {isInverted && (
        <div className="border border-bloomberg-red bg-bloomberg-red/10 p-2 text-center">
          <span className="text-bloomberg-red font-bold text-sm">YIELD CURVE INVERSION DETECTED</span>
          <div className="text-[10px] text-bloomberg-muted mt-1">
            One or more shorter maturities have higher yields than longer maturities
          </div>
        </div>
      )}

      <div className="border border-bloomberg-border p-2">
        <YieldCurveChart data={yields} height={350} />
      </div>

      <div className="text-[10px] text-bloomberg-muted px-2">
        US Treasury yield curve showing current yields across maturities from 1 Month to 30 Year.
        Data sourced from FRED (Federal Reserve Economic Data).
      </div>

      {/* Yield Data Table */}
      {yields.length > 0 && (
        <div className="border border-bloomberg-border">
          <div className="bb-section-header">MATURITY DATA</div>
          <table className="bb-table">
            <thead>
              <tr>
                <th>Maturity</th>
                <th className="text-right">Yield</th>
                <th className="text-right">Change</th>
                <th className="text-right">Previous</th>
              </tr>
            </thead>
            <tbody>
              {yields.map((y) => (
                <tr key={y.maturity}>
                  <td className="text-bloomberg-amber font-bold">{y.maturity}</td>
                  <td className="text-right num text-bloomberg-white">{y.yield.toFixed(3)}%</td>
                  <td className={`text-right num ${getChangeColor(y.change)}`}>{formatPercent(y.change, 3)}</td>
                  <td className="text-right num text-bloomberg-muted">{y.previousYield.toFixed(3)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
