import { useQuery } from "@tanstack/react-query";
import type { OptionsChain } from "@/lib/types";

export function useOptions(symbol: string | undefined, expiration?: string) {
  return useQuery({
    queryKey: ["options", symbol, expiration],
    queryFn: async () => {
      const url = expiration
        ? `/api/options/chain/${symbol}?expiration=${expiration}`
        : `/api/options/chain/${symbol}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch options");
      return res.json() as Promise<OptionsChain>;
    },
    enabled: !!symbol,
    staleTime: 300000,
  });
}
