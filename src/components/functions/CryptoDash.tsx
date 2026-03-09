"use client";
import { useQuery } from "@tanstack/react-query";
import { useCrypto } from "@/hooks/useCrypto";
import { LoadingState } from "@/components/data-display/LoadingState";
import { formatPrice, formatLargeNumber, formatPercent, getChangeColor } from "@/lib/formatters";
import { SparklineChart } from "@/components/data-display/SparklineChart";
import { PieChartComponent } from "@/components/charts/PieChartComponent";
import type { Security, CryptoGlobalData } from "@/lib/types";

export function CryptoDash({ security }: { security?: Security | null }) {
  void security;
  const { data: coins, isLoading } = useCrypto();

  const { data: globalData } = useQuery<CryptoGlobalData>({
    queryKey: ["crypto-global"],
    queryFn: async () => {
      const res = await fetch("/api/crypto/global");
      if (!res.ok) throw new Error("Failed to fetch global crypto data");
      return res.json();
    },
    staleTime: 60000,
  });

  if (isLoading) return <LoadingState />;

  const dominanceData = globalData
    ? [
        { name: "BTC", value: globalData.btcDominance, color: "#f7931a" },
        { name: "ETH", value: globalData.ethDominance, color: "#627eea" },
        {
          name: "Other",
          value: Math.max(0, 100 - globalData.btcDominance - globalData.ethDominance),
          color: "#888888",
        },
      ]
    : [];

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">CRYPTOCURRENCY MARKET</div>

      {/* Global Market Overview Banner */}
      {globalData && (
        <div className="border border-bloomberg-border p-1">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">Global Market Overview</div>
          <div className="grid grid-cols-4 gap-1">
            <div>
              <div className="text-[9px] text-bloomberg-muted">Total Market Cap</div>
              <div className="text-xs font-bold text-bloomberg-white">{formatLargeNumber(globalData.totalMarketCap)}</div>
              <div className={`text-[9px] ${getChangeColor(globalData.marketCapChangePercentage24h)}`}>
                {formatPercent(globalData.marketCapChangePercentage24h)} (24h)
              </div>
            </div>
            <div>
              <div className="text-[9px] text-bloomberg-muted">24h Volume</div>
              <div className="text-xs font-bold text-bloomberg-white">{formatLargeNumber(globalData.totalVolume)}</div>
            </div>
            <div>
              <div className="text-[9px] text-bloomberg-muted">BTC Dominance</div>
              <div className="text-xs font-bold text-bloomberg-white">{globalData.btcDominance.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-[9px] text-bloomberg-muted">Active Coins</div>
              <div className="text-xs font-bold text-bloomberg-white">{globalData.activeCryptocurrencies.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Top Movers */}
      {coins && coins.length > 0 && (
        <div className="grid grid-cols-2 gap-1">
          <div className="border border-bloomberg-border p-1">
            <div className="text-[9px] text-bloomberg-green font-bold uppercase mb-0.5">TOP GAINERS (24h)</div>
            {[...coins].sort((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h).slice(0, 5).map((c) => (
              <div key={c.id} className="flex justify-between text-[10px] py-px">
                <span className="text-bloomberg-amber font-bold uppercase">{c.symbol}</span>
                <span className="text-bloomberg-green">{formatPercent(c.priceChangePercentage24h)}</span>
              </div>
            ))}
          </div>
          <div className="border border-bloomberg-border p-1">
            <div className="text-[9px] text-bloomberg-red font-bold uppercase mb-0.5">TOP LOSERS (24h)</div>
            {[...coins].sort((a, b) => a.priceChangePercentage24h - b.priceChangePercentage24h).slice(0, 5).map((c) => (
              <div key={c.id} className="flex justify-between text-[10px] py-px">
                <span className="text-bloomberg-amber font-bold uppercase">{c.symbol}</span>
                <span className="text-bloomberg-red">{formatPercent(c.priceChangePercentage24h)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dominance Pie Chart */}
      {dominanceData.length > 0 && (
        <div className="border border-bloomberg-border p-1">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">Market Dominance</div>
          <PieChartComponent data={dominanceData} height={160} innerRadius={30} outerRadius={55} />
        </div>
      )}

      {/* Coin Table */}
      <div className="border border-bloomberg-border">
        <table className="bb-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Symbol</th>
              <th className="text-right">Price</th>
              <th className="text-right">24h %</th>
              <th className="text-right">7d %</th>
              <th className="text-right">Market Cap</th>
              <th className="text-right">Volume (24h)</th>
              <th className="text-center">7D Chart</th>
            </tr>
          </thead>
          <tbody>
            {(coins || []).map((coin) => (
              <tr key={coin.id}>
                <td className="text-bloomberg-muted">{coin.marketCapRank}</td>
                <td className="text-bloomberg-white">
                  <div className="flex items-center gap-1">
                    {coin.image && (
                      <img src={coin.image} alt="" className="w-4 h-4 rounded-full" />
                    )}
                    {coin.name}
                  </div>
                </td>
                <td className="text-bloomberg-amber font-bold uppercase">{coin.symbol}</td>
                <td className="text-right num">
                  ${formatPrice(coin.currentPrice, coin.currentPrice < 1 ? 6 : 2)}
                </td>
                <td className={`text-right num ${getChangeColor(coin.priceChangePercentage24h)}`}>
                  {formatPercent(coin.priceChangePercentage24h)}
                </td>
                <td className={`text-right num ${getChangeColor(coin.priceChangePercentage7d)}`}>
                  {formatPercent(coin.priceChangePercentage7d)}
                </td>
                <td className="text-right num">{formatLargeNumber(coin.marketCap)}</td>
                <td className="text-right num">{formatLargeNumber(coin.totalVolume)}</td>
                <td className="text-center">
                  {coin.sparklineIn7d?.length > 0 && (
                    <SparklineChart
                      data={coin.sparklineIn7d}
                      width={80}
                      height={24}
                      color={coin.priceChangePercentage7d >= 0 ? "#00c853" : "#ff1744"}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
