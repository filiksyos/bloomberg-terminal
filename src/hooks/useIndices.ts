import { useQuery } from "@tanstack/react-query";

export function useIndices() {
  return useQuery({
    queryKey: ["world-indices"],
    queryFn: async () => {
      const res = await fetch("/api/indices/world");
      if (!res.ok) throw new Error("Failed to fetch indices");
      return res.json();
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });
}
