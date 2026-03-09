import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "@/lib/utils";
import { DEFAULT_WATCHLIST_SYMBOLS } from "@/lib/constants";

interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
}

interface WatchlistState {
  watchlists: Watchlist[];
  activeWatchlistId: string;
  createWatchlist: (name: string) => void;
  deleteWatchlist: (id: string) => void;
  setActiveWatchlist: (id: string) => void;
  addSymbol: (watchlistId: string, symbol: string) => void;
  removeSymbol: (watchlistId: string, symbol: string) => void;
  reorderSymbols: (watchlistId: string, symbols: string[]) => void;
}

const defaultWatchlist: Watchlist = {
  id: "default",
  name: "My Watchlist",
  symbols: DEFAULT_WATCHLIST_SYMBOLS,
};

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      watchlists: [defaultWatchlist],
      activeWatchlistId: "default",
      createWatchlist: (name) => {
        const id = nanoid();
        set((state) => ({
          watchlists: [...state.watchlists, { id, name, symbols: [] }],
          activeWatchlistId: id,
        }));
      },
      deleteWatchlist: (id) =>
        set((state) => ({
          watchlists: state.watchlists.filter((w) => w.id !== id),
          activeWatchlistId: state.activeWatchlistId === id ? state.watchlists[0]?.id ?? "" : state.activeWatchlistId,
        })),
      setActiveWatchlist: (id) => set({ activeWatchlistId: id }),
      addSymbol: (watchlistId, symbol) =>
        set((state) => ({
          watchlists: state.watchlists.map((w) =>
            w.id === watchlistId && !w.symbols.includes(symbol.toUpperCase())
              ? { ...w, symbols: [...w.symbols, symbol.toUpperCase()] }
              : w
          ),
        })),
      removeSymbol: (watchlistId, symbol) =>
        set((state) => ({
          watchlists: state.watchlists.map((w) =>
            w.id === watchlistId
              ? { ...w, symbols: w.symbols.filter((s) => s !== symbol) }
              : w
          ),
        })),
      reorderSymbols: (watchlistId, symbols) =>
        set((state) => ({
          watchlists: state.watchlists.map((w) =>
            w.id === watchlistId ? { ...w, symbols } : w
          ),
        })),
    }),
    { name: "bloomberg-watchlists" }
  )
);
