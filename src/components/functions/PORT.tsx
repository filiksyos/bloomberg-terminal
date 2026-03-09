"use client";
import { useState } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { usePortfolioStore } from "@/store/portfolioStore";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice, formatPercent, formatLargeNumber, getChangeColor } from "@/lib/formatters";
import { PieChartComponent } from "@/components/charts/PieChartComponent";
import { LineChart } from "@/components/charts/LineChart";
import { useCandles } from "@/hooks/useCandles";
import type { Security } from "@/lib/types";

export function PORT({ security }: { security?: Security | null }) {
  void security;
  const portfolios = usePortfolioStore((s) => s.portfolios);
  const activePortfolioId = usePortfolioStore((s) => s.activePortfolioId);
  const setActivePortfolio = usePortfolioStore((s) => s.setActivePortfolio);
  const createPortfolio = usePortfolioStore((s) => s.createPortfolio);
  const addPosition = usePortfolioStore((s) => s.addPosition);
  const removePosition = usePortfolioStore((s) => s.removePosition);
  const { portfolio, performance, isLoading } = usePortfolio();

  const [showAdd, setShowAdd] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newCost, setNewCost] = useState("");
  const [newPortName, setNewPortName] = useState("");

  const handleAdd = () => {
    if (!newSymbol || !newQty || !newCost || !activePortfolioId) return;
    addPosition(activePortfolioId, {
      symbol: newSymbol.toUpperCase(),
      name: newSymbol.toUpperCase(),
      quantity: parseFloat(newQty),
      avgCost: parseFloat(newCost),
      type: "equity",
    });
    setNewSymbol(""); setNewQty(""); setNewCost(""); setShowAdd(false);
  };

  const pieData = performance?.positions.map((p) => ({ name: p.symbol, value: p.marketValue })) || [];

  // Fetch SPY benchmark data for performance comparison
  const now = Math.floor(Date.now() / 1000);
  const oneYearAgo = now - 365 * 86400;
  const { data: spyCandles } = useCandles("SPY", "D", oneYearAgo, now);

  // Build performance chart data (SPY normalized to 100)
  const perfChartData = (spyCandles || []).map((c) => {
    const basePrice = spyCandles && spyCandles.length > 0 ? spyCandles[0].close : 1;
    return {
      date: new Date(c.time * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: (c.close / basePrice) * 100,
    };
  });

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="flex items-center gap-2 mb-1">
        <div className="bb-section-header flex-1">PORTFOLIO MANAGER</div>
        <select value={activePortfolioId} onChange={(e) => setActivePortfolio(e.target.value)} className="bb-input text-xs">
          {portfolios.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
        </select>
        <button onClick={() => { const name = newPortName || `Portfolio ${portfolios.length + 1}`; createPortfolio(name); setNewPortName(""); }} className="bb-btn text-[10px]">NEW</button>
      </div>

      {performance && (
        <div className="grid grid-cols-3 gap-1">
          <div className="border border-bloomberg-border p-2">
            <div className="text-[10px] text-bloomberg-muted">TOTAL VALUE</div>
            <div className="text-lg text-bloomberg-amber font-bold">{formatLargeNumber(performance.totalValue)}</div>
          </div>
          <div className="border border-bloomberg-border p-2">
            <div className="text-[10px] text-bloomberg-muted">DAY P&L</div>
            <div className={`text-lg font-bold ${getChangeColor(performance.dayPnL)}`}>
              {performance.dayPnL >= 0 ? "+" : ""}{formatPrice(performance.dayPnL)} ({formatPercent(performance.dayPnLPercent)})
            </div>
          </div>
          <div className="border border-bloomberg-border p-2">
            <div className="text-[10px] text-bloomberg-muted">TOTAL P&L</div>
            <div className={`text-lg font-bold ${getChangeColor(performance.totalPnL)}`}>
              {performance.totalPnL >= 0 ? "+" : ""}{formatPrice(performance.totalPnL)} ({formatPercent(performance.totalPnLPercent)})
            </div>
          </div>
        </div>
      )}

      {isLoading ? <LoadingState /> : (
        <>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAdd(!showAdd)} className="bb-btn text-[10px]">{showAdd ? "CANCEL" : "ADD POSITION"}</button>
          </div>

          {showAdd && (
            <div className="border border-bloomberg-border p-2 flex gap-2 items-end">
              <div><label className="text-[10px] text-bloomberg-muted block">Symbol</label><input value={newSymbol} onChange={(e) => setNewSymbol(e.target.value)} className="bb-input w-20" /></div>
              <div><label className="text-[10px] text-bloomberg-muted block">Qty</label><input type="number" value={newQty} onChange={(e) => setNewQty(e.target.value)} className="bb-input w-20" /></div>
              <div><label className="text-[10px] text-bloomberg-muted block">Avg Cost</label><input type="number" value={newCost} onChange={(e) => setNewCost(e.target.value)} className="bb-input w-24" /></div>
              <button onClick={handleAdd} className="bb-btn bb-btn-active text-[10px]">ADD</button>
            </div>
          )}

          {performance && performance.positions.length > 0 && (
            <div className="flex gap-1">
              <div className="flex-1 border border-bloomberg-border">
                <table className="bb-table">
                  <thead>
                    <tr><th>Symbol</th><th className="text-right">Qty</th><th className="text-right">Avg Cost</th><th className="text-right">Price</th><th className="text-right">Mkt Value</th><th className="text-right">P&L</th><th className="text-right">P&L%</th><th className="text-right">Wt%</th><th></th></tr>
                  </thead>
                  <tbody>
                    {performance.positions.map((pos) => (
                      <tr key={pos.id}>
                        <td className="text-bloomberg-amber font-bold">{pos.symbol}</td>
                        <td className="text-right num">{pos.quantity}</td>
                        <td className="text-right num">${formatPrice(pos.avgCost)}</td>
                        <td className="text-right num">${formatPrice(pos.currentPrice)}</td>
                        <td className="text-right num">{formatLargeNumber(pos.marketValue)}</td>
                        <td className={`text-right num ${getChangeColor(pos.pnl)}`}>{pos.pnl >= 0 ? "+" : ""}${formatPrice(pos.pnl)}</td>
                        <td className={`text-right num ${getChangeColor(pos.pnlPercent)}`}>{formatPercent(pos.pnlPercent)}</td>
                        <td className="text-right num">{pos.weight.toFixed(1)}%</td>
                        <td><button onClick={() => removePosition(activePortfolioId, pos.id)} className="text-bloomberg-red text-[10px] hover:underline">DEL</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pieData.length > 1 && (
                <div className="w-64 border border-bloomberg-border p-2">
                  <div className="text-[10px] text-bloomberg-muted mb-1">ALLOCATION</div>
                  <PieChartComponent data={pieData} height={200} />
                </div>
              )}
            </div>
          )}

          {perfChartData.length > 0 && (
            <div className="border border-bloomberg-border p-2">
              <div className="text-[10px] text-bloomberg-amber font-bold uppercase mb-1">PERFORMANCE vs SPY (1Y, Normalized to 100)</div>
              <LineChart data={perfChartData} dataKey="value" height={200} color="#fb8b1e" />
            </div>
          )}

          {portfolio && portfolio.positions.length === 0 && (
            <div className="text-center text-bloomberg-muted py-8 text-sm">No positions. Click ADD POSITION to get started.</div>
          )}
        </>
      )}
    </div>
  );
}
