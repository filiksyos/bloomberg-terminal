import { useQuery } from "@tanstack/react-query";
import type { CommodityPrice } from "@/lib/types";

export function useCommodities() {
  return useQuery({
    queryKey: ["commodities"],
    queryFn: async () => {
      const res = await fetch("/api/commodities/prices");
      if (!res.ok) throw new Error("Failed to fetch commodities");
      return res.json() as Promise<CommodityPrice[]>;
    },
    staleTime: 3600000,
  });
}
