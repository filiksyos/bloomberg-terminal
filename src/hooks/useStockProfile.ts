import { useQuery } from "@tanstack/react-query";
import type { StockProfile } from "@/lib/types";

export function useStockProfile(symbol: string | undefined) {
  return useQuery({
    queryKey: ["stock-profile", symbol],
    queryFn: async () => {
      const res = await fetch(`/api/stocks/profile/${symbol}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json() as Promise<StockProfile>;
    },
    enabled: !!symbol,
    staleTime: 300000,
  });
}
