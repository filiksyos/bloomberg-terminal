"use client";
import { useState } from "react";
import { useScreener } from "@/hooks/useScreener";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice, formatLargeNumber, formatPercent, formatVolume, getChangeColor } from "@/lib/formatters";
import { SECTORS } from "@/lib/constants";
import type { Security, ScreenerFilters } from "@/lib/types";

export function EQS({ security }: { security?: Security | null }) {
  void security;
  const [filters, setFilters] = useState<ScreenerFilters>({
    marketCapMoreThan: 1000000000,
    limit: 50,
  });
  const [activeFilters, setActiveFilters] = useState<ScreenerFilters | null>(filters);
  const { data: results, isLoading } = useScreener(activeFilters);

  const updateFilter = (key: keyof ScreenerFilters, value: string) => {
    const numVal = value ? parseFloat(value) : undefined;
    setFilters((prev) => ({ ...prev, [key]: key === "sector" || key === "exchange" || key === "country" ? (value || undefined) : numVal }));
  };

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">EQUITY SCREENER</div>
      <div className="border border-bloomberg-border p-2">
        <div className="grid grid-cols-4 gap-1 text-[10px]">
          <div>
            <label className="text-bloomberg-muted block mb-1">Min Market Cap</label>
            <input type="number" value={filters.marketCapMoreThan || ""} onChange={(e) => updateFilter("marketCapMoreThan", e.target.value)} className="bb-input w-full" placeholder="e.g. 1000000000" />
          </div>
          <div>
            <label className="text-bloomberg-muted block mb-1">Max Market Cap</label>
            <input type="number" value={filters.marketCapLowerThan || ""} onChange={(e) => updateFilter("marketCapLowerThan", e.target.value)} className="bb-input w-full" />
          </div>
          <div>
            <label className="text-bloomberg-muted block mb-1">Min Price</label>
            <input type="number" value={filters.priceMoreThan || ""} onChange={(e) => updateFilter("priceMoreThan", e.target.value)} className="bb-input w-full" />
          </div>
          <div>
            <label className="text-bloomberg-muted block mb-1">Min Volume</label>
            <input type="number" value={filters.volumeMoreThan || ""} onChange={(e) => updateFilter("volumeMoreThan", e.target.value)} className="bb-input w-full" />
          </div>
          <div>
            <label className="text-bloomberg-muted block mb-1">Sector</label>
            <select value={filters.sector || ""} onChange={(e) => updateFilter("sector", e.target.value)} className="bb-input w-full">
              <option value="">All</option>
              {SECTORS.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>
          <div>
            <label className="text-bloomberg-muted block mb-1">Max Price</label>
            <input type="number" value={filters.priceLowerThan || ""} onChange={(e) => updateFilter("priceLowerThan", e.target.value)} className="bb-input w-full" />
          </div>
          <div>
            <label className="text-bloomberg-muted block mb-1">Beta Min</label>
            <input type="number" value={filters.betaMoreThan || ""} onChange={(e) => updateFilter("betaMoreThan", e.target.value)} className="bb-input w-full" step="0.1" />
          </div>
          <div>
            <label className="text-bloomberg-muted block mb-1">Beta Max</label>
            <input type="number" value={filters.betaLowerThan || ""} onChange={(e) => updateFilter("betaLowerThan", e.target.value)} className="bb-input w-full" step="0.1" />
          </div>
          <div>
            <label className="text-bloomberg-muted block mb-1">Exchange</label>
            <select value={filters.exchange || ""} onChange={(e) => updateFilter("exchange", e.target.value)} className="bb-input w-full">
              <option value="">All</option>
              <option value="NYSE">NYSE</option>
              <option value="NASDAQ">NASDAQ</option>
              <option value="AMEX">AMEX</option>
            </select>
          </div>
          <div>
            <label className="text-bloomberg-muted block mb-1">Country</label>
            <select value={filters.country || ""} onChange={(e) => updateFilter("country", e.target.value)} className="bb-input w-full">
              <option value="">All</option>
              <option value="US">US</option>
              <option value="CA">CA</option>
              <option value="GB">GB</option>
              <option value="DE">DE</option>
              <option value="FR">FR</option>
              <option value="JP">JP</option>
              <option value="CN">CN</option>
              <option value="HK">HK</option>
            </select>
          </div>
          <div>
            <label className="text-bloomberg-muted block mb-1">Min Dividend</label>
            <input type="number" value={filters.dividendMoreThan || ""} onChange={(e) => updateFilter("dividendMoreThan", e.target.value)} className="bb-input w-full" />
          </div>
          <div>
            <label className="text-bloomberg-muted block mb-1">Limit</label>
            <input type="number" value={filters.limit || 50} onChange={(e) => updateFilter("limit", e.target.value)} className="bb-input w-full" min="1" max="200" />
          </div>
          <div className="flex items-end">
            <button onClick={() => setActiveFilters({ ...filters })} className="bb-btn bb-btn-active w-full">SCREEN</button>
          </div>
        </div>
      </div>

      {isLoading ? <LoadingState /> : results && (
        <div className="border border-bloomberg-border">
          <div className="bb-section-header">RESULTS ({results.length})</div>
          <div className="max-h-[500px] overflow-auto">
            <table className="bb-table">
              <thead>
                <tr><th>Symbol</th><th>Company</th><th>Sector</th><th className="text-right">Price</th><th className="text-right">Chg%</th><th className="text-right">Mkt Cap</th><th className="text-right">Volume</th><th className="text-right">Beta</th></tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.symbol}>
                    <td className="text-bloomberg-amber font-bold">{r.symbol}</td>
                    <td className="text-bloomberg-white truncate max-w-[200px]">{r.companyName}</td>
                    <td className="text-bloomberg-muted">{r.sector}</td>
                    <td className="text-right num">${formatPrice(r.price)}</td>
                    <td className={`text-right num ${getChangeColor(r.changePercent)}`}>{formatPercent(r.changePercent)}</td>
                    <td className="text-right num">{formatLargeNumber(r.marketCap)}</td>
                    <td className="text-right num">{formatVolume(r.volume)}</td>
                    <td className="text-right num">{r.beta?.toFixed(2) || "--"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
