"use client";
import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { ECONOMIC_INDICATORS } from "@/lib/constants";
import { SparklineChart } from "@/components/data-display/SparklineChart";
import { LineChart } from "@/components/charts/LineChart";
import { LoadingState } from "@/components/data-display/LoadingState";
import { getChangeColor } from "@/lib/formatters";
import type { Security } from "@/lib/types";

const CARD_INDICATORS = ECONOMIC_INDICATORS.slice(0, 8);

interface Observation {
  date: string;
  value: number;
}

export function ECST({ security }: { security?: Security | null }) {
  void security;
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  const queries = useQueries({
    queries: CARD_INDICATORS.map((ind) => ({
      queryKey: ["economic", ind.seriesId],
      queryFn: async () => {
        const res = await fetch(`/api/economic/indicators/${ind.seriesId}`);
        if (!res.ok) throw new Error("Failed");
        return res.json() as Promise<Observation[]>;
      },
      staleTime: 1800000,
    })),
  });

  const selectedIndicator = ECONOMIC_INDICATORS.find((i) => i.seriesId === selectedSeries);
  const selectedQuery = queries.find(
    (_q, i) => CARD_INDICATORS[i]?.seriesId === selectedSeries
  );
  const selectedData: Observation[] = selectedQuery?.data || [];
  const selectedChartData = [...selectedData].reverse().map((obs) => ({ date: obs.date, value: obs.value }));

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">ECONOMIC STATISTICS</div>

      {/* Card Grid */}
      <div className="grid grid-cols-3 gap-2">
        {CARD_INDICATORS.map((ind, idx) => {
          const query = queries[idx];
          const observations: Observation[] = query?.data || [];
          const isLoading = query?.isLoading;
          const latest = observations.length > 0 ? observations[0] : null;
          const previous = observations.length > 1 ? observations[1] : null;
          const change = latest && previous ? latest.value - previous.value : null;
          const sparkData = [...observations].reverse().slice(-20).map((o) => o.value);
          const isSelected = selectedSeries === ind.seriesId;

          return (
            <button
              key={ind.seriesId}
              onClick={() => setSelectedSeries(isSelected ? null : ind.seriesId)}
              className={`border text-left p-2 transition-colors ${
                isSelected
                  ? "border-bloomberg-amber bg-bloomberg-amber/10"
                  : "border-bloomberg-border hover:border-bloomberg-amber/50"
              }`}
            >
              <div className="text-[10px] text-bloomberg-amber font-bold truncate">{ind.title}</div>
              <div className="text-[9px] text-bloomberg-muted">{ind.seriesId} / {ind.frequency}</div>
              {isLoading ? (
                <div className="text-[10px] text-bloomberg-muted mt-1">Loading...</div>
              ) : latest ? (
                <div className="mt-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-bloomberg-white font-bold">
                      {latest.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[9px] text-bloomberg-muted">{ind.unit}</span>
                  </div>
                  {previous && (
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className="text-bloomberg-muted">Prev: {previous.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      {change !== null && (
                        <span className={getChangeColor(change)}>
                          {change > 0 ? "^" : change < 0 ? "v" : "-"}
                        </span>
                      )}
                    </div>
                  )}
                  {sparkData.length >= 2 && (
                    <div className="mt-1">
                      <SparklineChart data={sparkData} width={120} height={20} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[10px] text-bloomberg-muted mt-1">No data</div>
              )}
            </button>
          );
        })}
      </div>

      {/* All indicators selector */}
      <div className="flex flex-wrap gap-1">
        {ECONOMIC_INDICATORS.map((ind) => (
          <button
            key={ind.seriesId}
            onClick={() => setSelectedSeries(selectedSeries === ind.seriesId ? null : ind.seriesId)}
            className={`bb-btn text-[10px] ${selectedSeries === ind.seriesId ? "bb-btn-active" : ""}`}
          >
            {ind.seriesId}
          </button>
        ))}
      </div>

      {/* Detail Chart for selected indicator */}
      {selectedSeries && selectedIndicator && (
        <div className="border border-bloomberg-border p-2 space-y-2">
          <div className="text-bloomberg-amber font-bold text-sm">{selectedIndicator.title}</div>
          <div className="flex gap-4 text-[10px] text-bloomberg-muted">
            <span>Series: {selectedIndicator.seriesId}</span>
            <span>Unit: {selectedIndicator.unit}</span>
            <span>Freq: {selectedIndicator.frequency}</span>
          </div>
          {selectedQuery?.isLoading ? (
            <LoadingState />
          ) : selectedChartData.length > 0 ? (
            <div className="border border-bloomberg-border p-2">
              <LineChart data={selectedChartData} dataKey="value" height={300} color="#fb8b1e" />
            </div>
          ) : (
            <div className="text-bloomberg-muted text-xs py-4 text-center">No data available for this indicator</div>
          )}
          {selectedData.length > 0 && (
            <div className="border border-bloomberg-border max-h-48 overflow-auto">
              <table className="bb-table">
                <thead>
                  <tr><th>Date</th><th className="text-right">Value</th></tr>
                </thead>
                <tbody>
                  {selectedData.slice(0, 30).map((obs, i) => (
                    <tr key={i}>
                      <td className="text-bloomberg-muted">{obs.date}</td>
                      <td className="text-right num text-bloomberg-white">{obs.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
