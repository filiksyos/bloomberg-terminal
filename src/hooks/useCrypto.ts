import { useQuery } from "@tanstack/react-query";
import type { CryptoAsset } from "@/lib/types";

export function useCrypto() {
  return useQuery({
    queryKey: ["crypto-prices"],
    queryFn: async () => {
      const res = await fetch("/api/crypto/prices");
      if (!res.ok) throw new Error("Failed to fetch crypto");
      return res.json() as Promise<CryptoAsset[]>;
    },
    refetchInterval: 30000,
    staleTime: 20000,
  });
}
