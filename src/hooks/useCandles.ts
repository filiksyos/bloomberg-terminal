import { useQuery } from "@tanstack/react-query";
import type { CandleData } from "@/lib/types";

export function useCandles(symbol: string | undefined, resolution: string, from: number, to: number) {
  return useQuery({
    queryKey: ["candles", symbol, resolution, from, to],
    queryFn: async () => {
      const res = await fetch(
        `/api/stocks/candles/${symbol}?resolution=${resolution}&from=${from}&to=${to}`
      );
      if (!res.ok) throw new Error("Failed to fetch candles");
      return res.json() as Promise<CandleData[]>;
    },
    enabled: !!symbol && from > 0 && to > 0,
    staleTime: 60000,
  });
}
