import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "@/lib/utils";
import type { Alert, AlertCondition } from "@/lib/types";

interface AlertState {
  alerts: Alert[];
  createAlert: (symbol: string, condition: AlertCondition, value: number) => void;
  deleteAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  triggerAlert: (id: string) => void;
  clearTriggered: () => void;
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set) => ({
      alerts: [],
      createAlert: (symbol, condition, value) =>
        set((state) => ({
          alerts: [
            ...state.alerts,
            {
              id: nanoid(),
              symbol: symbol.toUpperCase(),
              condition,
              value,
              enabled: true,
              triggered: false,
              triggeredAt: null,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      deleteAlert: (id) => set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
      toggleAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
        })),
      triggerAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id ? { ...a, triggered: true, triggeredAt: new Date().toISOString(), enabled: false } : a
          ),
        })),
      clearTriggered: () =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.triggered ? { ...a, triggered: false } : a)),
        })),
    }),
    { name: "bloomberg-alerts" }
  )
);
