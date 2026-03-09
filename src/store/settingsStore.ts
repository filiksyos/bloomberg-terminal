import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  finnhubKey: string;
  fmpKey: string;
  alphaVantageKey: string;
  fredKey: string;
  alpacaKeyId: string;
  alpacaSecretKey: string;
  setApiKey: (key: string, value: string) => void;
  refreshInterval: number;
  flashPrices: boolean;
  compactMode: boolean;
  soundEnabled: boolean;
  setRefreshInterval: (interval: number) => void;
  setFlashPrices: (enabled: boolean) => void;
  setCompactMode: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      finnhubKey: "",
      fmpKey: "",
      alphaVantageKey: "",
      fredKey: "",
      alpacaKeyId: "",
      alpacaSecretKey: "",
      setApiKey: (key, value) => set({ [key]: value }),
      refreshInterval: 15,
      flashPrices: true,
      compactMode: false,
      soundEnabled: true,
      setRefreshInterval: (interval) => set({ refreshInterval: interval }),
      setFlashPrices: (enabled) => set({ flashPrices: enabled }),
      setCompactMode: (enabled) => set({ compactMode: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
    }),
    { name: "bloomberg-settings" }
  )
);
