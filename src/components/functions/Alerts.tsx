"use client";
import { useState } from "react";
import { useAlertStore } from "@/store/alertStore";
import { formatDate } from "@/lib/formatters";
import type { Security, AlertCondition } from "@/lib/types";

const CONDITIONS: { value: AlertCondition; label: string }[] = [
  { value: "above", label: "Price Above" },
  { value: "below", label: "Price Below" },
  { value: "pct_change_above", label: "% Change Above" },
  { value: "pct_change_below", label: "% Change Below" },
  { value: "volume_above", label: "Volume Above" },
];

export function Alerts({ security }: { security?: Security | null }) {
  const alerts = useAlertStore((s) => s.alerts);
  const createAlert = useAlertStore((s) => s.createAlert);
  const deleteAlert = useAlertStore((s) => s.deleteAlert);
  const toggleAlert = useAlertStore((s) => s.toggleAlert);
  const clearTriggered = useAlertStore((s) => s.clearTriggered);

  const [symbol, setSymbol] = useState(security?.symbol || "");
  const [condition, setCondition] = useState<AlertCondition>("above");
  const [value, setValue] = useState("");

  const handleCreate = () => {
    if (!symbol || !value) return;
    createAlert(symbol, condition, parseFloat(value));
    setSymbol(""); setValue("");
  };

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">ALERT MANAGER</div>

      <div className="border border-bloomberg-border p-2">
        <div className="text-[10px] text-bloomberg-muted mb-2">CREATE NEW ALERT</div>
        <div className="flex gap-2 items-end">
          <div>
            <label className="text-[10px] text-bloomberg-muted block mb-1">Symbol</label>
            <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} className="bb-input w-24" placeholder="AAPL" />
          </div>
          <div>
            <label className="text-[10px] text-bloomberg-muted block mb-1">Condition</label>
            <select value={condition} onChange={(e) => setCondition(e.target.value as AlertCondition)} className="bb-input">
              {CONDITIONS.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-bloomberg-muted block mb-1">Value</label>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="bb-input w-24" placeholder="150.00" />
          </div>
          <button onClick={handleCreate} className="bb-btn bb-btn-active text-[10px]">CREATE</button>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={clearTriggered} className="bb-btn text-[10px]">CLEAR TRIGGERED</button>
      </div>

      <div className="border border-bloomberg-border">
        <table className="bb-table">
          <thead>
            <tr><th>Symbol</th><th>Condition</th><th className="text-right">Value</th><th className="text-center">Status</th><th>Created</th><th>Triggered</th><th></th></tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className={alert.triggered ? "bg-bloomberg-amber/10" : ""}>
                <td className="text-bloomberg-amber font-bold">{alert.symbol}</td>
                <td className="text-bloomberg-white">{CONDITIONS.find((c) => c.value === alert.condition)?.label}</td>
                <td className="text-right num">{alert.value}</td>
                <td className="text-center">
                  {alert.triggered ? (
                    <span className="text-bloomberg-amber font-bold">TRIGGERED</span>
                  ) : alert.enabled ? (
                    <span className="text-bloomberg-green">ACTIVE</span>
                  ) : (
                    <span className="text-bloomberg-muted">DISABLED</span>
                  )}
                </td>
                <td className="text-bloomberg-muted">{formatDate(alert.createdAt)}</td>
                <td className="text-bloomberg-muted">{alert.triggeredAt ? formatDate(alert.triggeredAt) : "--"}</td>
                <td className="flex gap-1">
                  <button onClick={() => toggleAlert(alert.id)} className="text-bloomberg-cyan text-[10px] hover:underline">
                    {alert.enabled ? "OFF" : "ON"}
                  </button>
                  <button onClick={() => deleteAlert(alert.id)} className="text-bloomberg-red text-[10px] hover:underline">DEL</button>
                </td>
              </tr>
            ))}
            {alerts.length === 0 && (
              <tr><td colSpan={7} className="text-center text-bloomberg-muted py-4">No alerts configured</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
