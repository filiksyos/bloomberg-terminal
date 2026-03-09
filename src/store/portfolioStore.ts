import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "@/lib/utils";
import type { Portfolio, Position } from "@/lib/types";

interface PortfolioState {
  portfolios: Portfolio[];
  activePortfolioId: string;
  createPortfolio: (name: string) => void;
  deletePortfolio: (id: string) => void;
  setActivePortfolio: (id: string) => void;
  addPosition: (portfolioId: string, position: Omit<Position, "id">) => void;
  removePosition: (portfolioId: string, positionId: string) => void;
  updatePosition: (portfolioId: string, positionId: string, updates: Partial<Position>) => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      portfolios: [{ id: "default", name: "My Portfolio", positions: [], createdAt: new Date().toISOString() }],
      activePortfolioId: "default",
      createPortfolio: (name) => {
        const id = nanoid();
        set((state) => ({
          portfolios: [...state.portfolios, { id, name, positions: [], createdAt: new Date().toISOString() }],
          activePortfolioId: id,
        }));
      },
      deletePortfolio: (id) =>
        set((state) => ({
          portfolios: state.portfolios.filter((p) => p.id !== id),
          activePortfolioId: state.activePortfolioId === id ? state.portfolios[0]?.id ?? "" : state.activePortfolioId,
        })),
      setActivePortfolio: (id) => set({ activePortfolioId: id }),
      addPosition: (portfolioId, position) =>
        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === portfolioId
              ? { ...p, positions: [...p.positions, { ...position, id: nanoid() }] }
              : p
          ),
        })),
      removePosition: (portfolioId, positionId) =>
        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === portfolioId
              ? { ...p, positions: p.positions.filter((pos) => pos.id !== positionId) }
              : p
          ),
        })),
      updatePosition: (portfolioId, positionId, updates) =>
        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === portfolioId
              ? { ...p, positions: p.positions.map((pos) => (pos.id === positionId ? { ...pos, ...updates } : pos)) }
              : p
          ),
        })),
    }),
    { name: "bloomberg-portfolios" }
  )
);
