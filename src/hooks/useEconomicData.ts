import { useQuery } from "@tanstack/react-query";

export function useEconomicData(seriesId: string | undefined) {
  return useQuery({
    queryKey: ["economic", seriesId],
    queryFn: async () => {
      const res = await fetch(`/api/economic/indicators/${seriesId}`);
      if (!res.ok) throw new Error("Failed to fetch economic data");
      return res.json();
    },
    enabled: !!seriesId,
    staleTime: 1800000,
  });
}
