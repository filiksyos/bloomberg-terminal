import { useQuery } from "@tanstack/react-query";
import type { DividendData } from "@/lib/types";

export function useDividends(symbol: string | undefined) {
  return useQuery({
    queryKey: ["dividends", symbol],
    queryFn: async () => {
      const res = await fetch(`/api/stocks/dividends/${symbol}`);
      if (!res.ok) throw new Error("Failed to fetch dividends");
      return res.json() as Promise<DividendData[]>;
    },
    enabled: !!symbol,
    staleTime: 600000,
  });
}
