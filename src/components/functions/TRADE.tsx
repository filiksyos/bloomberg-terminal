"use client";
import { useState, useMemo } from "react";
import { useStockQuote } from "@/hooks/useStockQuote";
import { useAlpacaAccount } from "@/hooks/useAlpacaAccount";
import { useAlpacaPosition } from "@/hooks/useAlpacaPositions";
import { usePlaceOrder } from "@/hooks/useAlpacaOrders";
import { formatPrice, formatPercent, getChangeColor } from "@/lib/formatters";
import type { Security, AlpacaOrderSide, AlpacaOrderType, AlpacaTimeInForce, AlpacaOrderRequest } from "@/lib/types";

const ORDER_TYPES: { value: AlpacaOrderType; label: string }[] = [
  { value: "market", label: "MKT" },
  { value: "limit", label: "LMT" },
  { value: "stop", label: "STP" },
  { value: "stop_limit", label: "STP-LMT" },
];

const TIF_OPTIONS: { value: AlpacaTimeInForce; label: string }[] = [
  { value: "day", label: "DAY" },
  { value: "gtc", label: "GTC" },
  { value: "ioc", label: "IOC" },
  { value: "fok", label: "FOK" },
];

export function TRADE({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const { data: quote } = useStockQuote(symbol);
  const { data: account, error: accountError } = useAlpacaAccount();
  const { data: position } = useAlpacaPosition(symbol);
  const placeOrder = usePlaceOrder();

  const [side, setSide] = useState<AlpacaOrderSide>("buy");
  const [orderType, setOrderType] = useState<AlpacaOrderType>("market");
  const [qty, setQty] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [tif, setTif] = useState<AlpacaTimeInForce>("day");
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const needsLimit = orderType === "limit" || orderType === "stop_limit";
  const needsStop = orderType === "stop" || orderType === "stop_limit";

  const estimatedCost = useMemo(() => {
    const q = parseFloat(qty) || 0;
    if (needsLimit) return q * (parseFloat(limitPrice) || 0);
    return q * (quote?.price || 0);
  }, [qty, limitPrice, quote, needsLimit]);

  const canSubmit = useMemo(() => {
    if (!symbol || !qty || parseFloat(qty) <= 0) return false;
    if (needsLimit && (!limitPrice || parseFloat(limitPrice) <= 0)) return false;
    if (needsStop && (!stopPrice || parseFloat(stopPrice) <= 0)) return false;
    return true;
  }, [symbol, qty, orderType, limitPrice, stopPrice, needsLimit, needsStop]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!symbol) return;
    setShowConfirm(false);
    setResult(null);
    try {
      const order: AlpacaOrderRequest = {
        symbol,
        qty: parseFloat(qty),
        side,
        type: orderType,
        time_in_force: tif,
      };
      if (needsLimit) order.limit_price = parseFloat(limitPrice);
      if (needsStop) order.stop_price = parseFloat(stopPrice);
      await placeOrder.mutateAsync(order);
      setResult({ success: true, message: `${side.toUpperCase()} ${qty} ${symbol} -- Order submitted` });
      setQty("");
      setLimitPrice("");
      setStopPrice("");
      setShowConfirm(false);
    } catch (err) {
      setResult({ success: false, message: err instanceof Error ? err.message : "Order failed" });
    }
  };

  if (!security) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-bloomberg-amber text-[11px]">Select a security to trade (e.g., AAPL &lt;GO&gt;)</div>
      </div>
    );
  }

  if (accountError) {
    return (
      <div className="p-1 space-y-1 overflow-auto h-full">
        <div className="bb-section-header">ORDER ENTRY <span className="text-bloomberg-green ml-2">PAPER</span></div>
        <div className="border border-bloomberg-border p-3 text-center">
          <div className="text-bloomberg-red text-xs font-bold mb-1">ALPACA NOT CONFIGURED</div>
          <div className="text-bloomberg-muted text-[10px]">Add your Alpaca API keys in Settings (SET) and .env.local to enable trading.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">ORDER ENTRY <span className="text-bloomberg-green ml-2">PAPER</span></div>

      {/* Quote Strip */}
      {quote && (
        <div className="border border-bloomberg-border p-1">
          <div className="grid grid-cols-6 gap-1 text-center">
            <div>
              <div className="text-[9px] text-bloomberg-muted">LAST</div>
              <div className="text-sm font-bold text-bloomberg-white">${formatPrice(quote.price)}</div>
            </div>
            <div>
              <div className="text-[9px] text-bloomberg-muted">CHG</div>
              <div className={`text-sm font-bold ${getChangeColor(quote.change)}`}>
                {quote.change >= 0 ? "+" : ""}{formatPrice(quote.change)}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-bloomberg-muted">CHG%</div>
              <div className={`text-sm font-bold ${getChangeColor(quote.changePercent)}`}>
                {formatPercent(quote.changePercent)}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-bloomberg-muted">OPEN</div>
              <div className="text-[11px] text-bloomberg-white">${formatPrice(quote.open)}</div>
            </div>
            <div>
              <div className="text-[9px] text-bloomberg-muted">HIGH</div>
              <div className="text-[11px] text-bloomberg-white">${formatPrice(quote.high)}</div>
            </div>
            <div>
              <div className="text-[9px] text-bloomberg-muted">LOW</div>
              <div className="text-[11px] text-bloomberg-white">${formatPrice(quote.low)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-1">
        {/* Order Form (2 cols) */}
        <div className="col-span-2 border border-bloomberg-border p-1 space-y-1">
          {/* Side */}
          <div>
            <div className="text-[9px] text-bloomberg-muted mb-0.5">SIDE</div>
            <div className="flex gap-0.5">
              <button
                onClick={() => setSide("buy")}
                className={`flex-1 py-1 text-[10px] font-bold border ${
                  side === "buy"
                    ? "bg-bloomberg-green/20 border-bloomberg-green text-bloomberg-green"
                    : "border-bloomberg-border text-bloomberg-muted"
                }`}
              >
                BUY
              </button>
              <button
                onClick={() => setSide("sell")}
                className={`flex-1 py-1 text-[10px] font-bold border ${
                  side === "sell"
                    ? "bg-bloomberg-red/20 border-bloomberg-red text-bloomberg-red"
                    : "border-bloomberg-border text-bloomberg-muted"
                }`}
              >
                SELL
              </button>
            </div>
          </div>

          {/* Order Type */}
          <div>
            <div className="text-[9px] text-bloomberg-muted mb-0.5">ORDER TYPE</div>
            <div className="flex gap-0.5">
              {ORDER_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setOrderType(t.value)}
                  className={`bb-btn text-[9px] flex-1 ${orderType === t.value ? "bb-btn-active" : ""}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <div className="text-[9px] text-bloomberg-muted mb-0.5">QUANTITY</div>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="bb-input w-full"
              placeholder="Shares..."
              min="0"
              step="1"
            />
          </div>

          {/* Limit Price */}
          {needsLimit && (
            <div>
              <div className="text-[9px] text-bloomberg-muted mb-0.5">LIMIT PRICE</div>
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="bb-input w-full"
                placeholder="Limit price..."
                min="0"
                step="0.01"
              />
            </div>
          )}

          {/* Stop Price */}
          {needsStop && (
            <div>
              <div className="text-[9px] text-bloomberg-muted mb-0.5">STOP PRICE</div>
              <input
                type="number"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                className="bb-input w-full"
                placeholder="Stop price..."
                min="0"
                step="0.01"
              />
            </div>
          )}

          {/* Time in Force */}
          <div>
            <div className="text-[9px] text-bloomberg-muted mb-0.5">TIME IN FORCE</div>
            <div className="flex gap-0.5">
              {TIF_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTif(t.value)}
                  className={`bb-btn text-[9px] flex-1 ${tif === t.value ? "bb-btn-active" : ""}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated cost */}
          {qty && parseFloat(qty) > 0 && (
            <div className="text-[10px] text-bloomberg-muted">
              Est. {side === "buy" ? "cost" : "proceeds"}: <span className="text-bloomberg-white font-bold">${formatPrice(estimatedCost)}</span>
            </div>
          )}

          {/* Submit / Confirm */}
          {showConfirm ? (
            <div className="border border-bloomberg-amber p-1 space-y-1">
              <div className="text-[10px] text-bloomberg-amber font-bold">CONFIRM ORDER</div>
              <div className="text-[11px] text-bloomberg-white">
                <span className={side === "buy" ? "text-bloomberg-green" : "text-bloomberg-red"}>
                  {side.toUpperCase()}
                </span>{" "}
                {qty} {symbol}{" "}
                {ORDER_TYPES.find((t) => t.value === orderType)?.label}{" "}
                {TIF_OPTIONS.find((t) => t.value === tif)?.label}
                {needsLimit && ` @ $${limitPrice}`}
                {needsStop && ` stop $${stopPrice}`}
              </div>
              <div className="flex gap-0.5">
                <button
                  onClick={handleConfirm}
                  disabled={placeOrder.isPending}
                  className={`bb-btn text-[10px] flex-1 font-bold ${
                    side === "buy" ? "text-bloomberg-green" : "text-bloomberg-red"
                  }`}
                >
                  {placeOrder.isPending ? "SENDING..." : "CONFIRM"}
                </button>
                <button onClick={() => setShowConfirm(false)} className="bb-btn text-[10px] flex-1">
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`bb-btn text-[10px] w-full py-1 font-bold ${
                canSubmit ? (side === "buy" ? "text-bloomberg-green" : "text-bloomberg-red") : "opacity-40"
              }`}
            >
              {side === "buy" ? "BUY" : "SELL"} {symbol}
            </button>
          )}

          {/* Result */}
          {result && (
            <div className={`text-[10px] font-bold ${result.success ? "text-bloomberg-green" : "text-bloomberg-red"}`}>
              {result.message}
            </div>
          )}
        </div>

        {/* Right sidebar: Account + Position */}
        <div className="space-y-1">
          {/* Account */}
          {account && (
            <div className="border border-bloomberg-border p-1">
              <div className="text-[9px] text-bloomberg-amber font-bold mb-0.5">ACCOUNT</div>
              <div className="space-y-0.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-bloomberg-muted">Buying Power</span>
                  <span className="text-bloomberg-white">${formatPrice(account.buyingPower)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bloomberg-muted">Equity</span>
                  <span className="text-bloomberg-white">${formatPrice(account.equity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bloomberg-muted">Cash</span>
                  <span className="text-bloomberg-white">${formatPrice(account.cash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bloomberg-muted">Day Trades</span>
                  <span className="text-bloomberg-white">{account.daytradeCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Current Position */}
          {position && (
            <div className="border border-bloomberg-border p-1">
              <div className="text-[9px] text-bloomberg-amber font-bold mb-0.5">CURRENT POSITION</div>
              <div className="space-y-0.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-bloomberg-muted">Qty</span>
                  <span className="text-bloomberg-white">{position.qty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bloomberg-muted">Avg Entry</span>
                  <span className="text-bloomberg-white">${formatPrice(position.avgEntryPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bloomberg-muted">Mkt Value</span>
                  <span className="text-bloomberg-white">${formatPrice(position.marketValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bloomberg-muted">Unrealized P&L</span>
                  <span className={`font-bold ${getChangeColor(position.unrealizedPl)}`}>
                    {position.unrealizedPl >= 0 ? "+" : ""}${formatPrice(Math.abs(position.unrealizedPl))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bloomberg-muted">P&L%</span>
                  <span className={getChangeColor(position.unrealizedPlpc)}>
                    {formatPercent(position.unrealizedPlpc * 100)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!position && symbol && (
            <div className="border border-bloomberg-border p-1">
              <div className="text-[9px] text-bloomberg-muted text-center py-2">No position in {symbol}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
