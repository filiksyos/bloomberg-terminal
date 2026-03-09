"use client";
import { useEarnings } from "@/hooks/useEarnings";
import { LoadingState } from "@/components/data-display/LoadingState";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { LineChart } from "@/components/charts/LineChart";
import { formatPrice, formatDate, formatLargeNumber } from "@/lib/formatters";
import type { Security } from "@/lib/types";

export function ERN({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const { data: earnings, isLoading } = useEarnings(symbol);

  if (!security) return <div className="flex items-center justify-center h-full text-bloomberg-amber text-sm">Enter a security in the command bar (e.g., AAPL)</div>;
  if (isLoading) return <LoadingState />;
  if (!earnings || earnings.length === 0) return <div className="flex items-center justify-center h-full text-bloomberg-muted text-sm">NO EARNINGS DATA AVAILABLE</div>;

  const chartData = [...earnings].reverse().slice(-8).map((e) => ({
    date: e.date ? formatDate(e.date) : `Q${e.quarter} ${e.year}`,
    value: e.epsSurprise ?? 0,
    color: (e.epsSurprise ?? 0) >= 0 ? "#00d26a" : "#ff3b3b",
  }));

  const epsTrendData = [...earnings].reverse().filter(e => e.epsActual != null).map(e => ({
    date: e.date ? formatDate(e.date) : `Q${e.quarter} ${e.year}`,
    value: e.epsActual as number,
  }));

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">{symbol} — EARNINGS</div>
      <div className="border border-bloomberg-border p-1">
        <div className="text-[9px] text-bloomberg-amber font-bold uppercase px-1 mb-0.5">EPS Surprise</div>
        <BarChartComponent data={chartData} height={180} showColors />
      </div>
      {epsTrendData.length > 0 && (
        <div className="border border-bloomberg-border p-1">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase px-1 mb-0.5">EPS Trend</div>
          <LineChart data={epsTrendData} dataKey="value" height={150} color="#fb8b1e" />
        </div>
      )}
      <div className="border border-bloomberg-border">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Date</th><th className="text-right">EPS Est</th><th className="text-right">EPS Act</th>
              <th className="text-right">Surprise</th><th className="text-right">Surprise %</th>
              <th className="text-right">Rev Est</th><th className="text-right">Rev Act</th>
            </tr>
          </thead>
          <tbody>
            {earnings.slice(0, 16).map((e, i) => (
              <tr key={i}>
                <td>{e.date ? formatDate(e.date) : "-"}</td>
                <td className="text-right num">{e.epsEstimate != null ? `$${formatPrice(e.epsEstimate)}` : "-"}</td>
                <td className="text-right num">{e.epsActual != null ? `$${formatPrice(e.epsActual)}` : "-"}</td>
                <td className={`text-right num ${(e.epsSurprise ?? 0) >= 0 ? "positive" : "negative"}`}>
                  {e.epsSurprise != null ? `$${formatPrice(e.epsSurprise)}` : "-"}
                </td>
                <td className={`text-right num ${(e.epsSurprisePercent ?? 0) >= 0 ? "positive" : "negative"}`}>
                  {e.epsSurprisePercent != null ? `${e.epsSurprisePercent.toFixed(1)}%` : "-"}
                </td>
                <td className="text-right num">{e.revenueEstimate != null ? formatLargeNumber(e.revenueEstimate) : "-"}</td>
                <td className="text-right num">{e.revenueActual != null ? formatLargeNumber(e.revenueActual) : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
