import { useQuery } from "@tanstack/react-query";

export function useForex(base: string = "USD") {
  return useQuery({
    queryKey: ["forex-rates", base],
    queryFn: async () => {
      const res = await fetch(`/api/forex/rates?base=${base}`);
      if (!res.ok) throw new Error("Failed to fetch forex");
      return res.json();
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
}
