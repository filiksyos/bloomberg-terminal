"use client";
import { useState } from "react";
import { useAlpacaOrders, useCancelOrder, useCancelAllOrders } from "@/hooks/useAlpacaOrders";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice, formatDateTime } from "@/lib/formatters";
import type { Security, AlpacaOrderStatus } from "@/lib/types";

function getStatusColor(status: AlpacaOrderStatus): string {
  switch (status) {
    case "filled": case "partially_filled": return "text-bloomberg-green";
    case "canceled": case "expired": case "rejected": return "text-bloomberg-red";
    case "new": case "accepted": case "pending_new": return "text-bloomberg-amber";
    default: return "text-bloomberg-muted";
  }
}

function isOpenOrder(status: string): boolean {
  return ["new", "accepted", "pending_new", "partially_filled", "done_for_day", "pending_cancel", "pending_replace"].includes(status);
}

function formatOrderType(type: string): string {
  return type === "stop_limit" ? "STP-LMT" : type === "stop" ? "STP" : type === "limit" ? "LMT" : "MKT";
}

export function OMS({ security }: { security?: Security | null }) {
  void security;
  const [tab, setTab] = useState<"open" | "history">("open");
  const { data: orders, isLoading, error } = useAlpacaOrders("all");
  const cancelOrder = useCancelOrder();
  const cancelAll = useCancelAllOrders();
  const [confirmCancelAll, setConfirmCancelAll] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  if (isLoading) return <LoadingState />;

  if (error) {
    return (
      <div className="p-1 space-y-1 overflow-auto h-full">
        <div className="bb-section-header">ORDER MANAGEMENT <span className="text-bloomberg-green ml-2">PAPER</span></div>
        <div className="border border-bloomberg-border p-3 text-center">
          <div className="text-bloomberg-red text-xs font-bold mb-1">ALPACA NOT CONFIGURED</div>
          <div className="text-bloomberg-muted text-[10px]">Add your Alpaca API keys in Settings (SET) and .env.local to enable trading.</div>
        </div>
      </div>
    );
  }

  const openOrders = (orders || []).filter((o) => isOpenOrder(o.status));
  const historicalOrders = (orders || []).filter((o) => !isOpenOrder(o.status));
  const displayOrders = tab === "open" ? openOrders : historicalOrders;

  const handleCancel = async (orderId: string) => {
    setCancelingId(orderId);
    try {
      await cancelOrder.mutateAsync(orderId);
    } finally {
      setCancelingId(null);
    }
  };

  const handleCancelAll = async () => {
    setConfirmCancelAll(false);
    await cancelAll.mutateAsync();
  };

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">ORDER MANAGEMENT <span className="text-bloomberg-green ml-2">PAPER</span></div>

      {/* Tab bar */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => setTab("open")}
          className={`bb-btn text-[9px] ${tab === "open" ? "bb-btn-active" : ""}`}
        >
          OPEN ORDERS ({openOrders.length})
        </button>
        <button
          onClick={() => setTab("history")}
          className={`bb-btn text-[9px] ${tab === "history" ? "bb-btn-active" : ""}`}
        >
          ORDER HISTORY ({historicalOrders.length})
        </button>
        <div className="flex-1" />
        {tab === "open" && openOrders.length > 0 && (
          confirmCancelAll ? (
            <span className="text-[9px]">
              <span className="text-bloomberg-red mr-1">Cancel ALL open orders?</span>
              <button onClick={handleCancelAll} className="bb-btn text-[9px] text-bloomberg-red mr-0.5">YES</button>
              <button onClick={() => setConfirmCancelAll(false)} className="bb-btn text-[9px]">NO</button>
            </span>
          ) : (
            <button onClick={() => setConfirmCancelAll(true)} className="bb-btn text-[9px]">CANCEL ALL</button>
          )
        )}
      </div>

      {/* Orders Table */}
      <div className="border border-bloomberg-border">
        <table className="bb-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Symbol</th>
              <th>Side</th>
              <th>Type</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Filled</th>
              <th className="text-right">Limit</th>
              <th className="text-right">Stop</th>
              <th className="text-right">Fill Price</th>
              <th>Status</th>
              {tab === "open" && <th className="text-center">Action</th>}
            </tr>
          </thead>
          <tbody>
            {displayOrders.length === 0 ? (
              <tr>
                <td colSpan={tab === "open" ? 11 : 10} className="text-center text-bloomberg-muted py-4">
                  {tab === "open" ? "No open orders" : "No order history"}
                </td>
              </tr>
            ) : (
              displayOrders.map((o) => (
                <tr key={o.id}>
                  <td className="text-bloomberg-muted">{formatDateTime(o.submittedAt)}</td>
                  <td className="text-bloomberg-amber font-bold">{o.symbol}</td>
                  <td className={o.side === "buy" ? "text-bloomberg-green font-bold" : "text-bloomberg-red font-bold"}>
                    {o.side.toUpperCase()}
                  </td>
                  <td>{formatOrderType(o.type)}</td>
                  <td className="text-right num">{o.qty || "--"}</td>
                  <td className="text-right num">{o.filledQty || "0"}</td>
                  <td className="text-right num">{o.limitPrice ? `$${formatPrice(parseFloat(o.limitPrice))}` : "--"}</td>
                  <td className="text-right num">{o.stopPrice ? `$${formatPrice(parseFloat(o.stopPrice))}` : "--"}</td>
                  <td className="text-right num">
                    {o.filledAvgPrice ? `$${formatPrice(parseFloat(o.filledAvgPrice))}` : "--"}
                  </td>
                  <td className={`font-bold ${getStatusColor(o.status)}`}>
                    {o.status.toUpperCase().replace(/_/g, " ")}
                  </td>
                  {tab === "open" && (
                    <td className="text-center">
                      <button
                        onClick={() => handleCancel(o.id)}
                        disabled={cancelingId === o.id}
                        className="bb-btn text-[9px] text-bloomberg-red"
                      >
                        {cancelingId === o.id ? "..." : "CANCEL"}
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-[9px] text-bloomberg-muted">Auto-refreshing every 5 seconds</div>
    </div>
  );
}
