import { useQueries } from "@tanstack/react-query";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { StockQuote, PortfolioPerformance } from "@/lib/types";

export function usePortfolio() {
  const portfolios = usePortfolioStore((s) => s.portfolios);
  const activePortfolioId = usePortfolioStore((s) => s.activePortfolioId);
  const portfolio = portfolios.find((p) => p.id === activePortfolioId);

  const quotes = useQueries({
    queries: (portfolio?.positions || []).map((pos) => ({
      queryKey: ["stock-quote", pos.symbol],
      queryFn: async () => {
        const res = await fetch(`/api/stocks/quote/${pos.symbol}`);
        if (!res.ok) throw new Error("Failed");
        return res.json() as Promise<StockQuote>;
      },
      refetchInterval: 15000,
      staleTime: 10000,
    })),
  });

  const performance: PortfolioPerformance | null = portfolio ? (() => {
    let totalValue = 0;
    let totalCost = 0;
    let dayPnL = 0;

    const positions = portfolio.positions.map((pos, i) => {
      const quote = quotes[i]?.data;
      const currentPrice = quote?.price || pos.avgCost;
      const marketValue = currentPrice * pos.quantity;
      const cost = pos.avgCost * pos.quantity;
      const pnl = marketValue - cost;
      const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;
      const dayChange = quote?.change || 0;
      const dayChangePercent = quote?.changePercent || 0;

      totalValue += marketValue;
      totalCost += cost;
      dayPnL += dayChange * pos.quantity;

      return {
        ...pos,
        currentPrice,
        marketValue,
        pnl,
        pnlPercent,
        dayChange,
        dayChangePercent,
        weight: 0,
      };
    });

    positions.forEach((pos) => {
      pos.weight = totalValue > 0 ? (pos.marketValue / totalValue) * 100 : 0;
    });

    return {
      totalValue,
      totalCost,
      dayPnL,
      dayPnLPercent: totalValue > 0 ? (dayPnL / totalValue) * 100 : 0,
      totalPnL: totalValue - totalCost,
      totalPnLPercent: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
      positions,
    };
  })() : null;

  return { portfolio, performance, isLoading: quotes.some((q) => q.isLoading) };
}
