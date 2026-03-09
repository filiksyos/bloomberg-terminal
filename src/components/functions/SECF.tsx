"use client";
import { useState } from "react";
import { LoadingState } from "@/components/data-display/LoadingState";
import type { Security } from "@/lib/types";

interface SearchResult {
  symbol: string;
  description: string;
  type: string;
  displaySymbol: string;
}

export function SECF({ security }: { security?: Security | null }) {
  void security;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="border border-bloomberg-border p-1">
        <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">SECURITY FINDER</div>
        <div className="flex gap-1 items-end">
          <div className="flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bb-input"
              placeholder="Search by name, ticker, or ISIN..."
            />
          </div>
          <button onClick={handleSearch} className="bb-btn bb-btn-active text-[9px]">SEARCH</button>
        </div>
      </div>

      {isLoading ? <LoadingState /> : results.length > 0 && (
        <div className="border border-bloomberg-border">
          <div className="bb-section-header">RESULTS ({results.length})</div>
          <table className="bb-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Type</th>
                <th>Exchange</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.symbol}>
                  <td className="text-bloomberg-amber font-bold">{r.symbol}</td>
                  <td className="text-bloomberg-white truncate max-w-[300px]">{r.description}</td>
                  <td className="text-bloomberg-muted uppercase">{r.type}</td>
                  <td className="text-bloomberg-muted">{r.displaySymbol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && results.length === 0 && query && (
        <div className="text-center text-bloomberg-muted py-4 text-[10px]">No results found. Try a different search term.</div>
      )}
    </div>
  );
}
