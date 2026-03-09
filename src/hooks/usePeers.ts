import { useQuery } from "@tanstack/react-query";

export function usePeers(symbol: string | undefined) {
  return useQuery({
    queryKey: ["peers", symbol],
    queryFn: async () => {
      const res = await fetch(`/api/stocks/peers/${symbol}`);
      if (!res.ok) throw new Error("Failed to fetch peers");
      return res.json();
    },
    enabled: !!symbol,
    staleTime: 300000,
  });
}
