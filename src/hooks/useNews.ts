import { useQuery } from "@tanstack/react-query";
import type { NewsArticle } from "@/lib/types";

export function useNews(category: string = "general") {
  return useQuery({
    queryKey: ["news", category],
    queryFn: async () => {
      const res = await fetch(`/api/news/top?category=${category}`);
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json() as Promise<NewsArticle[]>;
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useCompanyNews(symbol: string | undefined) {
  return useQuery({
    queryKey: ["company-news", symbol],
    queryFn: async () => {
      const res = await fetch(`/api/news/company/${symbol}`);
      if (!res.ok) throw new Error("Failed to fetch company news");
      return res.json() as Promise<NewsArticle[]>;
    },
    enabled: !!symbol,
    refetchInterval: 60000,
    staleTime: 30000,
  });
}
