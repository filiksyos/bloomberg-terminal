import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AlpacaOrder, AlpacaOrderRequest } from "@/lib/types";

export function useAlpacaOrders(status: string = "all") {
  return useQuery<AlpacaOrder[]>({
    queryKey: ["alpaca-orders", status],
    queryFn: async () => {
      const res = await fetch(`/api/trading/orders?status=${status}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    refetchInterval: 5000,
    staleTime: 3000,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: AlpacaOrderRequest) => {
      const res = await fetch("/api/trading/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to place order");
      }
      return res.json() as Promise<AlpacaOrder>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alpaca-orders"] });
      queryClient.invalidateQueries({ queryKey: ["alpaca-positions"] });
      queryClient.invalidateQueries({ queryKey: ["alpaca-account"] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await fetch(`/api/trading/orders/${orderId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to cancel order");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alpaca-orders"] });
      queryClient.invalidateQueries({ queryKey: ["alpaca-account"] });
    },
  });
}

export function useCancelAllOrders() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/trading/orders", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to cancel all orders");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alpaca-orders"] });
      queryClient.invalidateQueries({ queryKey: ["alpaca-account"] });
    },
  });
}
