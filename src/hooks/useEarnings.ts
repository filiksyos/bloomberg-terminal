import { useQuery } from "@tanstack/react-query";
import type { EarningsData } from "@/lib/types";

export function useEarnings(symbol: string | undefined) {
  return useQuery({
    queryKey: ["earnings", symbol],
    queryFn: async () => {
      const res = await fetch(`/api/stocks/earnings/${symbol}`);
      if (!res.ok) throw new Error("Failed to fetch earnings");
      return res.json() as Promise<EarningsData[]>;
    },
    enabled: !!symbol,
    staleTime: 600000,
  });
}
