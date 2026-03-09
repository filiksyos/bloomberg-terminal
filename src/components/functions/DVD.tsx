"use client";
import { useDividends } from "@/hooks/useDividends";
import { LoadingState } from "@/components/data-display/LoadingState";
import { BarChartComponent } from "@/components/charts/BarChartComponent";
import { formatPrice, formatDate } from "@/lib/formatters";
import type { Security } from "@/lib/types";

export function DVD({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const { data: dividends, isLoading } = useDividends(symbol);

  if (!security) return <div className="flex items-center justify-center h-full text-bloomberg-amber text-sm">Enter a security in the command bar (e.g., AAPL)</div>;
  if (isLoading) return <LoadingState />;
  if (!dividends || dividends.length === 0) return <div className="flex items-center justify-center h-full text-bloomberg-muted text-sm">NO DIVIDEND DATA AVAILABLE</div>;

  // Calculate annual dividend (sum of last 4 dividends as proxy)
  const annualDiv = dividends.slice(0, 4).reduce((sum, d) => sum + d.amount, 0);

  // 5-year CAGR (if we have 5+ years of data)
  const fiveYearCagr = (() => {
    if (dividends.length < 8) return null;
    const recent = dividends.slice(0, 4).reduce((s, d) => s + d.amount, 0);
    const fiveYearsAgo = dividends.slice(-4).reduce((s, d) => s + d.amount, 0);
    if (fiveYearsAgo <= 0) return null;
    return (Math.pow(recent / fiveYearsAgo, 1 / 5) - 1) * 100;
  })();

  const chartData = [...dividends].reverse().slice(-20).map((d) => ({
    date: formatDate(d.exDate),
    value: d.amount,
  }));

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">{symbol} — DIVIDENDS</div>

      <div className="grid grid-cols-2 gap-1">
        <div className="border border-bloomberg-border p-2 text-center">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">Annual Dividend</div>
          <div className="text-xl font-bold text-bloomberg-green">${formatPrice(annualDiv)}</div>
          <div className="text-[9px] text-bloomberg-muted mt-1">Sum of last 4 payments</div>
        </div>
        <div className="border border-bloomberg-border p-2 text-center">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">5Y Dividend CAGR</div>
          <div className={`text-xl font-bold ${fiveYearCagr !== null && fiveYearCagr >= 0 ? "text-bloomberg-green" : "text-bloomberg-red"}`}>
            {fiveYearCagr !== null ? `${fiveYearCagr >= 0 ? "+" : ""}${fiveYearCagr.toFixed(2)}%` : "--"}
          </div>
          <div className="text-[9px] text-bloomberg-muted mt-1">{fiveYearCagr !== null ? "Compound annual growth" : "Insufficient data"}</div>
        </div>
      </div>

      <div className="border border-bloomberg-border p-1">
        <div className="text-[9px] text-bloomberg-amber font-bold uppercase px-1 mb-0.5">Dividend History</div>
        <BarChartComponent data={chartData} height={180} color="#00d26a" />
      </div>
      <div className="border border-bloomberg-border">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Ex-Date</th><th>Pay Date</th><th>Record Date</th><th className="text-right">Amount</th><th className="text-right">Adj. Amount</th>
            </tr>
          </thead>
          <tbody>
            {dividends.slice(0, 30).map((d, i) => (
              <tr key={i}>
                <td>{formatDate(d.exDate)}</td>
                <td>{d.payDate ? formatDate(d.payDate) : "-"}</td>
                <td>{d.recordDate ? formatDate(d.recordDate) : "-"}</td>
                <td className="text-right num">${formatPrice(d.amount)}</td>
                <td className="text-right num">${formatPrice(d.adjustedAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
