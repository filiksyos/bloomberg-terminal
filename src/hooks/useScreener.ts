import { useQuery } from "@tanstack/react-query";
import type { ScreenerFilters, ScreenerResult } from "@/lib/types";

export function useScreener(filters: ScreenerFilters | null) {
  return useQuery({
    queryKey: ["screener", filters],
    queryFn: async () => {
      const res = await fetch("/api/screener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      if (!res.ok) throw new Error("Failed to screen stocks");
      return res.json() as Promise<ScreenerResult[]>;
    },
    enabled: !!filters,
  });
}
