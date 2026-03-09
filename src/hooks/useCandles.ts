import { useQuery } from "@tanstack/react-query";
import type { CandleData } from "@/lib/types";

/** Round timestamps to interval (default 5 min) so query key stays stable across re-renders. */
const STABILITY_INTERVAL = 300;

export function useCandles(symbol: string | undefined, resolution: string, from: number, to: number) {
  const stableFrom = Math.floor(from / STABILITY_INTERVAL) * STABILITY_INTERVAL;
  const stableTo = Math.floor(to / STABILITY_INTERVAL) * STABILITY_INTERVAL;

  return useQuery({
    queryKey: ["candles", symbol, resolution, stableFrom, stableTo],
    queryFn: async () => {
      const res = await fetch(
        `/api/stocks/candles/${symbol}?resolution=${resolution}&from=${stableFrom}&to=${stableTo}`
      );
      if (!res.ok) throw new Error("Failed to fetch candles");
      return res.json() as Promise<CandleData[]>;
    },
    enabled: !!symbol && stableFrom > 0 && stableTo > 0,
    staleTime: 60000,
  });
}
