"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatRelativeTime } from "@/lib/formatters";
import type { Security, NewsArticle } from "@/lib/types";

export function CN({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: articles, isLoading } = useQuery<NewsArticle[]>({
    queryKey: ["company-news", symbol],
    queryFn: async () => {
      if (!symbol) return [];
      const res = await fetch(`/api/news/company/${symbol}`);
      const data = await res.json();
      return data.articles || [];
    },
    enabled: !!symbol,
    refetchInterval: 60000,
  });

  const selected = articles?.find((a) => a.id === selectedId);

  if (!security) return <div className="flex items-center justify-center h-full text-bloomberg-amber text-[11px]">Enter a security (e.g., AAPL &lt;GO&gt;)</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center px-1 py-0.5 border-b border-bloomberg-border shrink-0">
        <span className="text-[9px] text-bloomberg-amber font-bold">COMPANY NEWS</span>
        <span className="text-[10px] text-bloomberg-amber ml-2">{symbol}</span>
        <span className="text-[9px] text-bloomberg-muted ml-auto">{articles?.length || 0} articles</span>
      </div>

      {isLoading ? <LoadingState /> : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto">
            {(articles || []).map((article, idx) => (
              <div
                key={article.id}
                onClick={() => setSelectedId(article.id)}
                className={`flex items-start gap-1.5 px-1 py-px cursor-pointer border-b border-bloomberg-border/20 hover:bg-bloomberg-panel-alt ${selectedId === article.id ? "bg-bloomberg-panel-alt" : ""}`}
              >
                <span className="text-[9px] text-bloomberg-muted shrink-0 w-4 text-right">{idx + 1}</span>
                <span className="text-[9px] text-bloomberg-muted shrink-0 w-12">
                  {article.datetime ? formatRelativeTime(article.datetime * 1000) : ""}
                </span>
                <span className="text-[9px] text-bloomberg-cyan font-bold shrink-0 w-10 uppercase truncate">
                  {article.source?.slice(0, 6)}
                </span>
                <span className="text-[10px] text-bloomberg-white truncate">{article.headline}</span>
              </div>
            ))}
            {articles?.length === 0 && (
              <div className="text-center text-bloomberg-muted py-4 text-[10px]">No news found for {symbol}</div>
            )}
          </div>

          {selected && (
            <div className="border-t border-bloomberg-amber p-1.5 max-h-[40%] overflow-auto shrink-0 bg-bloomberg-panel">
              <div className="text-[10px] text-bloomberg-amber font-bold mb-0.5">{selected.headline}</div>
              <div className="text-[10px] text-bloomberg-white leading-tight mb-1">{selected.summary}</div>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="text-bloomberg-cyan">{selected.source}</span>
                {selected.url && (
                  <a href={selected.url} target="_blank" rel="noopener noreferrer" className="text-bloomberg-blue hover:underline">Full Article</a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
