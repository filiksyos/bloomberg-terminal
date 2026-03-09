import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AlpacaPosition } from "@/lib/types";

export function useAlpacaPositions() {
  return useQuery<AlpacaPosition[]>({
    queryKey: ["alpaca-positions"],
    queryFn: async () => {
      const res = await fetch("/api/trading/positions");
      if (!res.ok) throw new Error("Failed to fetch positions");
      return res.json();
    },
    refetchInterval: 5000,
    staleTime: 3000,
  });
}

export function useAlpacaPosition(symbol: string | undefined) {
  return useQuery<AlpacaPosition | null>({
    queryKey: ["alpaca-position", symbol],
    queryFn: async () => {
      const res = await fetch(`/api/trading/positions/${symbol}`);
      if (!res.ok) {
        if (res.status === 500) return null;
        throw new Error("Failed to fetch position");
      }
      return res.json();
    },
    enabled: !!symbol,
    refetchInterval: 5000,
    staleTime: 3000,
  });
}

export function useClosePosition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (symbol: string) => {
      const res = await fetch(`/api/trading/positions/${symbol}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to close position");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alpaca-positions"] });
      queryClient.invalidateQueries({ queryKey: ["alpaca-account"] });
    },
  });
}

export function useCloseAllPositions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/trading/positions", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to close all positions");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alpaca-positions"] });
      queryClient.invalidateQueries({ queryKey: ["alpaca-account"] });
    },
  });
}
