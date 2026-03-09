"use client";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useStockQuote } from "@/hooks/useStockQuote";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice } from "@/lib/formatters";
import type { Security, RecommendationData } from "@/lib/types";

export function ANR({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const { data, isLoading } = useRecommendations(symbol);
  const { data: quote } = useStockQuote(symbol);

  if (!security) return <div className="flex items-center justify-center h-full text-bloomberg-amber text-sm">Enter a security in the command bar (e.g., AAPL)</div>;
  if (isLoading) return <LoadingState />;

  const recs: RecommendationData[] = data?.recommendations || [];
  const pt = data?.priceTarget;
  const latest = recs[0];

  const total = latest ? latest.strongBuy + latest.buy + latest.hold + latest.sell + latest.strongSell : 0;
  const buyPct = total > 0 ? ((latest.strongBuy + latest.buy) / total) * 100 : 0;
  const consensus = buyPct >= 60 ? "BUY" : buyPct >= 40 ? "HOLD" : "SELL";
  const consensusColor = consensus === "BUY" ? "text-bloomberg-green" : consensus === "SELL" ? "text-bloomberg-red" : "text-bloomberg-amber";

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">{symbol} — ANALYST RECOMMENDATIONS</div>

      <div className="grid grid-cols-2 gap-1">
        <div className="border border-bloomberg-border p-2 text-center">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-1">Consensus</div>
          <div className={`text-2xl font-bold ${consensusColor}`}>{consensus}</div>
          <div className="text-xs text-bloomberg-muted mt-1">{total} analysts</div>
        </div>

        {pt && (
          <div className="border border-bloomberg-border p-2">
            <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-1">Price Target</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-bloomberg-muted">Current:</span><span>${formatPrice(quote?.price || 0)}</span></div>
              <div className="flex justify-between"><span className="text-bloomberg-muted">Mean:</span><span className="text-bloomberg-amber">${formatPrice(pt.targetMean)}</span></div>
              <div className="flex justify-between"><span className="text-bloomberg-muted">High:</span><span className="text-bloomberg-green">${formatPrice(pt.targetHigh)}</span></div>
              <div className="flex justify-between"><span className="text-bloomberg-muted">Low:</span><span className="text-bloomberg-red">${formatPrice(pt.targetLow)}</span></div>
              <div className="flex justify-between"><span className="text-bloomberg-muted">Median:</span><span>${formatPrice(pt.targetMedian)}</span></div>
            </div>
            {quote && (
              <div className="mt-2">
                <div className="text-[9px] text-bloomberg-muted mb-0.5">PRICE TARGET RANGE</div>
                <div className="flex items-center gap-2 text-[9px]">
                  <span className="text-bloomberg-red">${formatPrice(pt.targetLow)}</span>
                  <div className="flex-1 h-3 bg-bloomberg-panel-alt rounded relative">
                    {/* Mean target marker */}
                    <div className="absolute h-full w-0.5 bg-bloomberg-amber" style={{ left: `${Math.min(100, Math.max(0, ((pt.targetMean - pt.targetLow) / (pt.targetHigh - pt.targetLow)) * 100))}%` }} />
                    {/* Current price marker */}
                    <div className="absolute -top-0.5 w-2 h-4 bg-bloomberg-white rounded-sm" style={{ left: `${Math.min(100, Math.max(0, ((quote.price - pt.targetLow) / (pt.targetHigh - pt.targetLow)) * 100))}%` }} />
                  </div>
                  <span className="text-bloomberg-green">${formatPrice(pt.targetHigh)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {latest && (
        <div className="border border-bloomberg-border p-1">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-1">Rating Distribution</div>
          <div className="flex h-6 gap-0.5 mb-1">
            {[
              { val: latest.strongBuy, color: "bg-bloomberg-green", label: "Strong Buy" },
              { val: latest.buy, color: "bg-bloomberg-green/70", label: "Buy" },
              { val: latest.hold, color: "bg-bloomberg-amber", label: "Hold" },
              { val: latest.sell, color: "bg-bloomberg-red/70", label: "Sell" },
              { val: latest.strongSell, color: "bg-bloomberg-red", label: "Strong Sell" },
            ].map((b, i) => (
              total > 0 && b.val > 0 ? (
                <div key={i} className={`${b.color} flex items-center justify-center text-[9px] text-black font-bold`} style={{ width: `${(b.val / total) * 100}%` }}>
                  {b.val}
                </div>
              ) : null
            ))}
          </div>
          <div className="flex justify-between text-[9px] text-bloomberg-muted">
            <span>Strong Buy: {latest.strongBuy}</span>
            <span>Buy: {latest.buy}</span>
            <span>Hold: {latest.hold}</span>
            <span>Sell: {latest.sell}</span>
            <span>Strong Sell: {latest.strongSell}</span>
          </div>
        </div>
      )}

      {recs.length > 0 && (
        <div className="border border-bloomberg-border">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase px-2 py-1">History</div>
          <table className="bb-table">
            <thead>
              <tr>
                <th>Period</th><th className="text-right">Strong Buy</th><th className="text-right">Buy</th>
                <th className="text-right">Hold</th><th className="text-right">Sell</th><th className="text-right">Strong Sell</th>
              </tr>
            </thead>
            <tbody>
              {recs.slice(0, 12).map((r, i) => (
                <tr key={i}>
                  <td>{r.period}</td>
                  <td className="text-right num text-bloomberg-green">{r.strongBuy}</td>
                  <td className="text-right num text-bloomberg-green">{r.buy}</td>
                  <td className="text-right num text-bloomberg-amber">{r.hold}</td>
                  <td className="text-right num text-bloomberg-red">{r.sell}</td>
                  <td className="text-right num text-bloomberg-red">{r.strongSell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
