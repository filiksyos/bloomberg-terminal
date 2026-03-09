import { useQuery } from "@tanstack/react-query";
import type { AlpacaPortfolioHistory } from "@/lib/types";

export function useAlpacaHistory(period: string = "1M", timeframe: string = "1D") {
  return useQuery<AlpacaPortfolioHistory>({
    queryKey: ["alpaca-history", period, timeframe],
    queryFn: async () => {
      const res = await fetch(`/api/trading/history?period=${period}&timeframe=${timeframe}`);
      if (!res.ok) throw new Error("Failed to fetch portfolio history");
      return res.json();
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}
