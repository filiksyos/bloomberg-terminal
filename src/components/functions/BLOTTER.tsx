"use client";
import { useState } from "react";
import { useAlpacaAccount } from "@/hooks/useAlpacaAccount";
import { useAlpacaPositions, useClosePosition, useCloseAllPositions } from "@/hooks/useAlpacaPositions";
import { useAlpacaHistory } from "@/hooks/useAlpacaHistory";
import { LoadingState } from "@/components/data-display/LoadingState";
import { AreaChart } from "@/components/charts/AreaChart";
import { formatPrice, formatPercent, formatLargeNumber, getChangeColor } from "@/lib/formatters";
import type { Security } from "@/lib/types";

const PERIODS = ["1W", "1M", "3M", "6M", "1Y"] as const;

export function BLOTTER({ security }: { security?: Security | null }) {
  void security;
  const { data: account, isLoading: accountLoading, error: accountError } = useAlpacaAccount();
  const { data: positions, isLoading: positionsLoading } = useAlpacaPositions();
  const closePosition = useClosePosition();
  const closeAll = useCloseAllPositions();
  const [historyPeriod, setHistoryPeriod] = useState("1M");
  const { data: history } = useAlpacaHistory(historyPeriod, "1D");
  const [confirmCloseAll, setConfirmCloseAll] = useState(false);
  const [closingSymbol, setClosingSymbol] = useState<string | null>(null);

  if (accountLoading || positionsLoading) return <LoadingState />;

  if (accountError) {
    return (
      <div className="p-1 space-y-1 overflow-auto h-full">
        <div className="bb-section-header">TRADE BLOTTER <span className="text-bloomberg-green ml-2">PAPER</span></div>
        <div className="border border-bloomberg-border p-3 text-center">
          <div className="text-bloomberg-red text-xs font-bold mb-1">ALPACA NOT CONFIGURED</div>
          <div className="text-bloomberg-muted text-[10px]">Add your Alpaca API keys in Settings (SET) and .env.local to enable trading.</div>
        </div>
      </div>
    );
  }

  const dayPnL = account ? account.equity - account.lastEquity : 0;
  const dayPnLPct = account && account.lastEquity > 0
    ? ((account.equity - account.lastEquity) / account.lastEquity) * 100
    : 0;

  const totalUnrealizedPl = (positions || []).reduce((sum, p) => sum + p.unrealizedPl, 0);

  const chartData = history
    ? history.timestamp.map((t: number, i: number) => ({
        date: new Date(t * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: history.equity[i],
      }))
    : [];

  const handleClosePosition = async (symbol: string) => {
    setClosingSymbol(symbol);
    try {
      await closePosition.mutateAsync(symbol);
    } finally {
      setClosingSymbol(null);
    }
  };

  const handleCloseAll = async () => {
    setConfirmCloseAll(false);
    await closeAll.mutateAsync();
  };

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">TRADE BLOTTER <span className="text-bloomberg-green ml-2">PAPER</span></div>

      {/* Account Summary */}
      {account && (
        <div className="grid grid-cols-4 gap-1">
          <div className="border border-bloomberg-border p-1">
            <div className="text-[9px] text-bloomberg-muted">EQUITY</div>
            <div className="text-sm font-bold text-bloomberg-amber">${formatPrice(account.equity)}</div>
          </div>
          <div className="border border-bloomberg-border p-1">
            <div className="text-[9px] text-bloomberg-muted">BUYING POWER</div>
            <div className="text-sm font-bold text-bloomberg-white">${formatPrice(account.buyingPower)}</div>
          </div>
          <div className="border border-bloomberg-border p-1">
            <div className="text-[9px] text-bloomberg-muted">CASH</div>
            <div className="text-sm font-bold text-bloomberg-white">${formatPrice(account.cash)}</div>
          </div>
          <div className="border border-bloomberg-border p-1">
            <div className="text-[9px] text-bloomberg-muted">DAY P&L</div>
            <div className={`text-sm font-bold ${getChangeColor(dayPnL)}`}>
              {dayPnL >= 0 ? "+" : ""}${formatPrice(Math.abs(dayPnL))} ({formatPercent(dayPnLPct)})
            </div>
          </div>
        </div>
      )}

      {/* Positions Table */}
      <div className="border border-bloomberg-border">
        <div className="flex items-center justify-between px-1 py-px">
          <div className="text-[9px] text-bloomberg-amber font-bold">
            POSITIONS ({(positions || []).length})
            {totalUnrealizedPl !== 0 && (
              <span className={`ml-2 ${getChangeColor(totalUnrealizedPl)}`}>
                UNREALIZED: {totalUnrealizedPl >= 0 ? "+" : ""}${formatPrice(Math.abs(totalUnrealizedPl))}
              </span>
            )}
          </div>
          {(positions || []).length > 0 && (
            <div>
              {confirmCloseAll ? (
                <span className="text-[9px]">
                  <span className="text-bloomberg-red mr-1">Close ALL positions?</span>
                  <button onClick={handleCloseAll} className="bb-btn text-[9px] text-bloomberg-red mr-0.5">YES</button>
                  <button onClick={() => setConfirmCloseAll(false)} className="bb-btn text-[9px]">NO</button>
                </span>
              ) : (
                <button onClick={() => setConfirmCloseAll(true)} className="bb-btn text-[9px]">CLOSE ALL</button>
              )}
            </div>
          )}
        </div>
        <table className="bb-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Avg Entry</th>
              <th className="text-right">Price</th>
              <th className="text-right">Mkt Value</th>
              <th className="text-right">Cost</th>
              <th className="text-right">Unrealized P&L</th>
              <th className="text-right">P&L%</th>
              <th className="text-right">Today</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {(positions || []).length === 0 ? (
              <tr><td colSpan={10} className="text-center text-bloomberg-muted py-4">No open positions</td></tr>
            ) : (
              (positions || []).map((p) => (
                <tr key={p.symbol}>
                  <td className="text-bloomberg-amber font-bold">{p.symbol}</td>
                  <td className="text-right num">{p.qty}</td>
                  <td className="text-right num">${formatPrice(p.avgEntryPrice)}</td>
                  <td className="text-right num">${formatPrice(p.currentPrice)}</td>
                  <td className="text-right num">{formatLargeNumber(p.marketValue)}</td>
                  <td className="text-right num">{formatLargeNumber(p.costBasis)}</td>
                  <td className={`text-right num font-bold ${getChangeColor(p.unrealizedPl)}`}>
                    {p.unrealizedPl >= 0 ? "+" : ""}${formatPrice(Math.abs(p.unrealizedPl))}
                  </td>
                  <td className={`text-right num ${getChangeColor(p.unrealizedPlpc)}`}>
                    {formatPercent(p.unrealizedPlpc * 100)}
                  </td>
                  <td className={`text-right num ${getChangeColor(p.changeToday)}`}>
                    {formatPercent(p.changeToday * 100)}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleClosePosition(p.symbol)}
                      disabled={closingSymbol === p.symbol}
                      className="bb-btn text-[9px] text-bloomberg-red"
                    >
                      {closingSymbol === p.symbol ? "..." : "CLOSE"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Portfolio History Chart */}
      {chartData.length > 0 && (
        <div className="border border-bloomberg-border p-1">
          <div className="flex items-center justify-between mb-0.5">
            <div className="text-[9px] text-bloomberg-amber font-bold">PORTFOLIO EQUITY</div>
            <div className="flex gap-0.5">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setHistoryPeriod(p)}
                  className={`bb-btn text-[9px] ${historyPeriod === p ? "bb-btn-active" : ""}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <AreaChart data={chartData} height={160} color={dayPnL >= 0 ? "#00c853" : "#ff1744"} />
        </div>
      )}
    </div>
  );
}
