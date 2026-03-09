import { useQuery } from "@tanstack/react-query";

export function useRecommendations(symbol: string | undefined) {
  return useQuery({
    queryKey: ["recommendations", symbol],
    queryFn: async () => {
      const res = await fetch(`/api/stocks/recommendations/${symbol}`);
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      return res.json();
    },
    enabled: !!symbol,
    staleTime: 600000,
  });
}
