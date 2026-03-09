"use client";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatDate } from "@/lib/formatters";
import type { Security, EconomicEvent } from "@/lib/types";

export function ECO({ security }: { security?: Security | null }) {
  void security;
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [importanceFilter, setImportanceFilter] = useState<Set<number>>(new Set([1, 2, 3]));

  const { data: events, isLoading } = useQuery({
    queryKey: ["economic-calendar"],
    queryFn: async () => {
      const res = await fetch("/api/economic/calendar");
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<EconomicEvent[]>;
    },
    staleTime: 300000,
  });

  const countries = useMemo(() => {
    const set = new Set<string>();
    (events || []).forEach((e) => {
      if (e.country) set.add(e.country);
    });
    return Array.from(set).sort();
  }, [events]);

  const toggleImportance = (level: number) => {
    setImportanceFilter((prev) => {
      const next = new Set(prev);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  };

  if (isLoading) return <LoadingState />;

  const filtered = (events || []).filter((e) => {
    if (countryFilter && e.country !== countryFilter) return false;
    if (!importanceFilter.has(e.importance)) return false;
    return true;
  });

  const importanceLabel = (imp: number) => {
    if (imp === 3) return { text: "HIGH", cls: "text-bloomberg-red" };
    if (imp === 2) return { text: "MED", cls: "text-bloomberg-amber" };
    return { text: "LOW", cls: "text-bloomberg-muted" };
  };

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">ECONOMIC CALENDAR</div>

      {/* Filters */}
      <div className="border border-bloomberg-border p-2 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-bloomberg-muted">COUNTRY:</label>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bb-input text-xs"
          >
            <option value="">All</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-bloomberg-muted">IMPORTANCE:</label>
          {[
            { level: 3, label: "HIGH", cls: "text-bloomberg-red" },
            { level: 2, label: "MED", cls: "text-bloomberg-amber" },
            { level: 1, label: "LOW", cls: "text-bloomberg-muted" },
          ].map((imp) => (
            <button
              key={imp.level}
              onClick={() => toggleImportance(imp.level)}
              className={`bb-btn text-[10px] px-2 py-0.5 ${importanceFilter.has(imp.level) ? "bb-btn-active" : "opacity-40"}`}
            >
              <span className={imp.cls}>{imp.label}</span>
            </button>
          ))}
        </div>
        <div className="text-[10px] text-bloomberg-muted ml-auto">
          {filtered.length} / {(events || []).length} events
        </div>
      </div>

      <div className="border border-bloomberg-border">
        <table className="bb-table">
          <thead>
            <tr><th>Date</th><th>Time</th><th>Country</th><th>Event</th><th className="text-center">Impact</th><th className="text-right">Actual</th><th className="text-right">Estimate</th><th className="text-right">Previous</th></tr>
          </thead>
          <tbody>
            {filtered.map((event, i) => {
              const imp = importanceLabel(event.importance);
              return (
                <tr key={`${event.event}-${i}`}>
                  <td className="text-bloomberg-muted">{formatDate(event.date)}</td>
                  <td className="text-bloomberg-muted">{event.time || "--:--"}</td>
                  <td className="text-bloomberg-cyan font-bold">{event.country}</td>
                  <td className="text-bloomberg-white">{event.event}</td>
                  <td className={`text-center font-bold ${imp.cls}`}>{imp.text}</td>
                  <td className="text-right num text-bloomberg-white">{event.actual != null ? event.actual : "--"}</td>
                  <td className="text-right num text-bloomberg-muted">{event.estimate != null ? event.estimate : "--"}</td>
                  <td className="text-right num text-bloomberg-muted">{event.previous != null ? event.previous : "--"}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center text-bloomberg-muted py-4">No matching economic events</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
