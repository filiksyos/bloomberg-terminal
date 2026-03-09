import { useQuery } from "@tanstack/react-query";
import type { AlpacaAccount } from "@/lib/types";

export function useAlpacaAccount() {
  return useQuery<AlpacaAccount>({
    queryKey: ["alpaca-account"],
    queryFn: async () => {
      const res = await fetch("/api/trading/account");
      if (!res.ok) throw new Error("Failed to fetch Alpaca account");
      return res.json();
    },
    refetchInterval: 15000,
    staleTime: 10000,
  });
}
