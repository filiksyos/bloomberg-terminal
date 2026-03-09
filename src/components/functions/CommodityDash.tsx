"use client";
import { useCommodities } from "@/hooks/useCommodities";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice, formatPercent, getChangeColor } from "@/lib/formatters";
import type { Security, CommodityPrice } from "@/lib/types";

const CATEGORIES: { key: CommodityPrice["category"]; label: string }[] = [
  { key: "precious_metals", label: "PRECIOUS METALS" },
  { key: "energy", label: "ENERGY" },
  { key: "industrial_metals", label: "INDUSTRIAL METALS" },
  { key: "agriculture", label: "AGRICULTURE" },
];

export function CommodityDash({ security }: { security?: Security | null }) {
  void security;
  const { data: commodities, isLoading } = useCommodities();

  if (isLoading) return <LoadingState />;

  const preciousMetals = (commodities || []).filter((c) => c.category === "precious_metals");

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      {/* Precious Metals Spotlight */}
      {preciousMetals.length > 0 && (
        <div className="grid grid-cols-4 gap-1">
          {preciousMetals.map((metal) => (
            <div key={metal.symbol} className="border border-bloomberg-border p-1">
              <div className="text-[9px] text-bloomberg-muted uppercase">{metal.name}</div>
              <div className="text-base text-bloomberg-amber font-bold">${formatPrice(metal.price)}</div>
              <div className={`text-[10px] ${getChangeColor(metal.change)}`}>
                {metal.change >= 0 ? "+" : ""}{formatPrice(metal.change)} ({formatPercent(metal.changePercent)})
              </div>
              <div className="text-[8px] text-bloomberg-muted mt-0.5">{metal.unit}</div>
            </div>
          ))}
        </div>
      )}

      {/* Category Tables */}
      {CATEGORIES.map((cat) => {
        const items = (commodities || []).filter((c) => c.category === cat.key);
        if (items.length === 0) return null;
        return (
          <div key={cat.key} className="border border-bloomberg-border">
            <div className="bb-section-header">{cat.label}</div>
            <table className="bb-table">
              <thead>
                <tr><th>Commodity</th><th>Symbol</th><th className="text-right">Price</th><th className="text-right">Change</th><th className="text-right">Chg%</th><th className="text-right">Unit</th></tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.symbol}>
                    <td className="text-bloomberg-white">{item.name}</td>
                    <td className="text-bloomberg-amber font-bold">{item.symbol}</td>
                    <td className="text-right num">${formatPrice(item.price)}</td>
                    <td className={`text-right num ${getChangeColor(item.change)}`}>{item.change > 0 ? "+" : ""}{formatPrice(item.change)}</td>
                    <td className={`text-right num ${getChangeColor(item.changePercent)}`}>{formatPercent(item.changePercent)}</td>
                    <td className="text-right text-bloomberg-muted">{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
