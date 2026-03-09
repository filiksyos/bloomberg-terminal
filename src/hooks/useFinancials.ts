import { useQuery } from "@tanstack/react-query";

export function useFinancials(symbol: string | undefined, statement: string, period: string) {
  return useQuery({
    queryKey: ["financials", symbol, statement, period],
    queryFn: async () => {
      const res = await fetch(
        `/api/stocks/financials/${symbol}?statement=${statement}&period=${period}`
      );
      if (!res.ok) throw new Error("Failed to fetch financials");
      return res.json();
    },
    enabled: !!symbol,
    staleTime: 600000,
  });
}
