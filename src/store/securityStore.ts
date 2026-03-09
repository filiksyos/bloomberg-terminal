import { create } from "zustand";
import type { Security, StockQuote } from "@/lib/types";

interface SecurityState {
  groupSecurities: Record<string, Security | null>;
  setGroupSecurity: (group: string, security: Security | null) => void;
  quotes: Record<string, StockQuote>;
  updateQuote: (symbol: string, quote: StockQuote) => void;
  updateQuotePrice: (symbol: string, price: number, timestamp: number) => void;
}

export const useSecurityStore = create<SecurityState>()((set) => ({
  groupSecurities: { A: null, B: null, C: null, D: null },
  setGroupSecurity: (group, security) =>
    set((state) => ({
      groupSecurities: { ...state.groupSecurities, [group]: security },
    })),

  quotes: {},
  updateQuote: (symbol, quote) =>
    set((state) => ({
      quotes: { ...state.quotes, [symbol]: quote },
    })),
  updateQuotePrice: (symbol, price, timestamp) =>
    set((state) => {
      const existing = state.quotes[symbol];
      if (!existing) return state;
      return {
        quotes: {
          ...state.quotes,
          [symbol]: {
            ...existing,
            price,
            change: price - existing.prevClose,
            changePercent: ((price - existing.prevClose) / existing.prevClose) * 100,
            timestamp,
          },
        },
      };
    }),
}));
