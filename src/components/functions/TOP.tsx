"use client";
import { useState } from "react";
import { useNews } from "@/hooks/useNews";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatRelativeTime } from "@/lib/formatters";
import type { Security } from "@/lib/types";

const CATEGORIES = ["general", "forex", "crypto", "merger"];

export function TOP({ security }: { security?: Security | null }) {
  const [category, setCategory] = useState("general");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: articles, isLoading } = useNews(category);

  const selected = articles?.find((a) => a.id === selectedId);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-1 px-1 py-0.5 border-b border-bloomberg-border shrink-0">
        <span className="text-[9px] text-bloomberg-amber font-bold mr-1">TOP NEWS</span>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => { setCategory(cat); setSelectedId(null); }} className={`bb-btn text-[9px] ${category === cat ? "bb-btn-active" : ""}`}>
            {cat}
          </button>
        ))}
        {security && <span className="text-bloomberg-amber text-[10px] ml-auto">{security.symbol}</span>}
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
                <span className="text-[9px] text-bloomberg-muted shrink-0 w-4 text-right">
                  {idx + 1}
                </span>
                <span className="text-[9px] text-bloomberg-muted shrink-0 w-12">
                  {article.datetime ? formatRelativeTime(article.datetime * 1000) : ""}
                </span>
                <span className="text-[9px] text-bloomberg-cyan font-bold shrink-0 w-10 uppercase truncate">
                  {article.source?.slice(0, 6)}
                </span>
                <span className="text-[10px] text-bloomberg-white truncate">{article.headline}</span>
              </div>
            ))}
          </div>

          {selected && (
            <div className="border-t border-bloomberg-amber p-1.5 max-h-[35%] overflow-auto shrink-0 bg-bloomberg-panel">
              <div className="text-[10px] text-bloomberg-amber font-bold mb-0.5">{selected.headline}</div>
              <div className="text-[10px] text-bloomberg-white leading-tight mb-1">{selected.summary}</div>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="text-bloomberg-cyan">{selected.source}</span>
                {selected.url && (
                  <a href={selected.url} target="_blank" rel="noopener noreferrer" className="text-bloomberg-blue hover:underline">
                    Full Article
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
