import { useQuery } from "@tanstack/react-query";
import type { StockQuote } from "@/lib/types";

export function useStockQuote(symbol: string | undefined) {
  return useQuery({
    queryKey: ["stock-quote", symbol],
    queryFn: async () => {
      const res = await fetch(`/api/stocks/quote/${symbol}`);
      if (!res.ok) throw new Error("Failed to fetch quote");
      return res.json() as Promise<StockQuote>;
    },
    enabled: !!symbol,
    refetchInterval: 15000,
    staleTime: 10000,
  });
}
