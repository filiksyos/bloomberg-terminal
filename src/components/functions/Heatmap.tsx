"use client";
import { useIndices } from "@/hooks/useIndices";
import { LoadingState } from "@/components/data-display/LoadingState";
import { TreemapChart } from "@/components/charts/TreemapChart";
import type { Security } from "@/lib/types";

export function Heatmap({ security }: { security?: Security | null }) {
  void security;
  const { data, isLoading } = useIndices();

  if (isLoading) return <LoadingState />;

  const items = (data || []).map((idx: Record<string, unknown>) => ({
    name: String(idx.etf),
    size: Math.abs(Number(idx.price) || 1) * 1000,
    changePercent: Number(idx.changePercent) || 0,
    color: "",
  }));

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">MARKET HEAT MAP</div>
      {items.length > 0 ? (
        <TreemapChart data={items} height={500} />
      ) : (
        <div className="text-bloomberg-muted text-center py-8">
          No data available
        </div>
      )}
    </div>
  );
}
