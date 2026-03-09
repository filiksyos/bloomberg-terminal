"use client";
import { useState } from "react";
import { useFinancials } from "@/hooks/useFinancials";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatLargeNumber, formatPercent } from "@/lib/formatters";
import type { Security } from "@/lib/types";

const STATEMENTS = [
  { key: "income", label: "Income Statement" },
  { key: "balance", label: "Balance Sheet" },
  { key: "cashflow", label: "Cash Flow" },
  { key: "metrics", label: "Key Metrics" },
  { key: "growth", label: "Growth" },
];

export function FA({ security }: { security?: Security | null }) {
  const [statement, setStatement] = useState("income");
  const [period, setPeriod] = useState("annual");
  const symbol = security?.symbol;
  const { data, isLoading } = useFinancials(symbol, statement, period);

  if (!security) {
    return <div className="flex items-center justify-center h-full text-bloomberg-amber text-sm">Enter a security in the command bar (e.g., AAPL)</div>;
  }

  const rows = Array.isArray(data) ? data : [];
  const fields = rows.length > 0
    ? Object.keys(rows[0]).filter((k) => !["date", "symbol", "reportedCurrency", "cik", "fillingDate", "acceptedDate", "calendarYear", "period", "link", "finalLink"].includes(k))
    : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-1 p-1 border-b border-bloomberg-border shrink-0 flex-wrap">
        {STATEMENTS.map((s) => (
          <button key={s.key} onClick={() => setStatement(s.key)} className={`bb-btn text-[9px] ${statement === s.key ? "bb-btn-active" : ""}`}>
            {s.label}
          </button>
        ))}
        <span className="text-bloomberg-border mx-1">|</span>
        <button onClick={() => setPeriod("annual")} className={`bb-btn text-[9px] ${period === "annual" ? "bb-btn-active" : ""}`}>Annual</button>
        <button onClick={() => setPeriod("quarter")} className={`bb-btn text-[9px] ${period === "quarter" ? "bb-btn-active" : ""}`}>Quarterly</button>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <div className="flex items-center justify-center h-full text-bloomberg-muted text-sm">NO FINANCIAL DATA AVAILABLE</div>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="bb-table">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-bloomberg-panel-alt min-w-[200px]">Metric</th>
                {rows.map((r: Record<string, unknown>, i: number) => (
                  <th key={i} className="text-right min-w-[120px]">{String(r.date || r.calendarYear || i)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field}>
                  <td className="sticky left-0 bg-bloomberg-black text-bloomberg-amber text-[9px] font-bold uppercase">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </td>
                  {rows.map((r: Record<string, unknown>, i: number) => {
                    const val = r[field];
                    const num = typeof val === "number" ? val : parseFloat(String(val));
                    return (
                      <td key={i} className="text-right num">
                        {isNaN(num) ? String(val || "-") :
                          field.toLowerCase().includes("ratio") || field.toLowerCase().includes("margin") || field.toLowerCase().includes("growth") || field.toLowerCase().includes("yield") || field.toLowerCase().includes("percentage")
                            ? formatPercent(num * (Math.abs(num) < 1 ? 100 : 1))
                            : formatLargeNumber(num)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
