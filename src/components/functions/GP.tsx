"use client";
import { useState, useMemo } from "react";
import { useCandles } from "@/hooks/useCandles";
import { CandlestickChart, type IndicatorConfig } from "@/components/charts/CandlestickChart";
import { LineChart } from "@/components/charts/LineChart";
import { AreaChart } from "@/components/charts/AreaChart";
import { LoadingState } from "@/components/data-display/LoadingState";
import { TIMEFRAME_CONFIG } from "@/lib/constants";
import { formatPrice, formatVolume } from "@/lib/formatters";
import { calculateRSI, calculateMACD } from "@/lib/indicators";
import type { Security, CandleData } from "@/lib/types";
import {
  ResponsiveContainer,
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts";

type ChartType = "candle" | "line" | "area";
type IndicatorType = "SMA" | "EMA" | "RSI" | "MACD" | "BB";

const DEFAULT_PERIODS: Record<IndicatorType, number> = {
  SMA: 20,
  EMA: 50,
  RSI: 14,
  MACD: 12,
  BB: 20,
};

const INDICATOR_COLORS: Record<IndicatorType, string> = {
  SMA: "#2196F3",
  EMA: "#FF9800",
  RSI: "#E91E63",
  MACD: "#00BCD4",
  BB: "#673AB7",
};

export function GP({ security }: { security?: Security | null }) {
  const [timeframe, setTimeframe] = useState("3M");
  const [crosshairData, setCrosshairData] = useState<{ open: number; high: number; low: number; close: number; volume: number } | null>(null);
  const [chartType, setChartType] = useState<ChartType>("candle");
  const [indicators, setIndicators] = useState<IndicatorConfig[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIndicatorType, setNewIndicatorType] = useState<IndicatorType>("SMA");
  const [newIndicatorPeriod, setNewIndicatorPeriod] = useState(DEFAULT_PERIODS.SMA);

  const symbol = security?.symbol;
  const config = TIMEFRAME_CONFIG.find((t) => t.value === timeframe) || TIMEFRAME_CONFIG[3];

  const now = Math.floor(Date.now() / 1000);
  const from = useMemo(() => {
    if (timeframe === "YTD") {
      return Math.floor(new Date(new Date().getFullYear(), 0, 1).getTime() / 1000);
    }
    return now - config.days * 86400;
  }, [timeframe, now, config.days]);

  const { data: candles, isLoading } = useCandles(symbol, config.resolution, from, now);

  // Transform candle data for LineChart / AreaChart
  const lineData = useMemo(() => {
    return (candles || []).map((c) => ({
      date: new Date(c.time * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: c.close,
    }));
  }, [candles]);

  // RSI data for sub-chart
  const rsiIndicator = indicators.find((ind) => ind.type === "RSI");
  const rsiData = useMemo(() => {
    if (!rsiIndicator || !candles || candles.length === 0) return null;
    const values = calculateRSI(candles, rsiIndicator.period);
    return candles.map((c, i) => ({
      date: new Date(c.time * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      rsi: values[i],
    })).filter((d) => d.rsi !== null);
  }, [candles, rsiIndicator]);

  // MACD data for sub-chart
  const macdIndicator = indicators.find((ind) => ind.type === "MACD");
  const macdData = useMemo(() => {
    if (!macdIndicator || !candles || candles.length === 0) return null;
    const result = calculateMACD(candles, macdIndicator.period);
    return candles.map((c, i) => ({
      date: new Date(c.time * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      macd: result.macdLine[i],
      signal: result.signalLine[i],
      histogram: result.histogram[i],
    })).filter((d) => d.macd !== null || d.signal !== null || d.histogram !== null);
  }, [candles, macdIndicator]);

  // Overlay indicators only (SMA, EMA, BB) - passed to CandlestickChart
  const overlayIndicators = useMemo(() => {
    return indicators.filter((ind) => ind.type === "SMA" || ind.type === "EMA" || ind.type === "BB");
  }, [indicators]);

  const handleAddIndicator = () => {
    setIndicators((prev) => [
      ...prev,
      { type: newIndicatorType, period: newIndicatorPeriod, color: INDICATOR_COLORS[newIndicatorType] },
    ]);
    setShowAddForm(false);
    setNewIndicatorType("SMA");
    setNewIndicatorPeriod(DEFAULT_PERIODS.SMA);
  };

  const handleRemoveIndicator = (index: number) => {
    setIndicators((prev) => prev.filter((_, i) => i !== index));
  };

  if (!security) {
    return <div className="flex items-center justify-center h-full text-bloomberg-amber text-[11px]">Enter a security in the command bar (e.g., AAPL &lt;GO&gt;)</div>;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar row: timeframe + chart type + indicators */}
      <div className="flex items-center gap-0.5 px-1 py-0.5 border-b border-bloomberg-border shrink-0 flex-wrap">
        {TIMEFRAME_CONFIG.map(({ value: tf }) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`bb-btn text-[9px] px-1.5 py-0 ${timeframe === tf ? "bb-btn-active" : ""}`}
          >
            {tf}
          </button>
        ))}

        <span className="w-px h-3 bg-bloomberg-border mx-0.5" />

        {(["candle", "line", "area"] as const).map((ct) => (
          <button
            key={ct}
            onClick={() => setChartType(ct)}
            className={`bb-btn text-[9px] px-1.5 py-0 uppercase ${chartType === ct ? "bb-btn-active" : ""}`}
          >
            {ct}
          </button>
        ))}

        <span className="w-px h-3 bg-bloomberg-border mx-0.5" />

        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="bb-btn text-[9px] px-1.5 py-0"
        >
          +IND
        </button>
      </div>

      {/* Add indicator form */}
      {showAddForm && (
        <div className="flex items-center gap-2 px-2 py-1 border-b border-bloomberg-border bg-bloomberg-panel shrink-0">
          <select
            value={newIndicatorType}
            onChange={(e) => {
              const t = e.target.value as IndicatorType;
              setNewIndicatorType(t);
              setNewIndicatorPeriod(DEFAULT_PERIODS[t]);
            }}
            className="bg-black border border-bloomberg-border text-white text-[10px] px-1 py-0.5 font-mono"
          >
            <option value="SMA">SMA</option>
            <option value="EMA">EMA</option>
            <option value="RSI">RSI</option>
            <option value="MACD">MACD</option>
            <option value="BB">BB</option>
          </select>
          <label className="text-[10px] text-bloomberg-muted">Period:</label>
          <input
            type="number"
            value={newIndicatorPeriod}
            onChange={(e) => setNewIndicatorPeriod(Number(e.target.value))}
            min={1}
            max={200}
            className="bg-black border border-bloomberg-border text-white text-[10px] px-1 py-0.5 w-14 font-mono"
          />
          <button onClick={handleAddIndicator} className="bb-btn text-[10px] px-2 py-0.5 bb-btn-active">
            Add
          </button>
          <button onClick={() => setShowAddForm(false)} className="bb-btn text-[10px] px-2 py-0.5">
            Cancel
          </button>
        </div>
      )}

      {/* Active indicators tags */}
      {indicators.length > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 border-b border-bloomberg-border shrink-0 flex-wrap">
          {indicators.map((ind, i) => (
            <span
              key={`${ind.type}-${ind.period}-${i}`}
              className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 border border-bloomberg-border rounded font-mono"
              style={{ color: ind.color || INDICATOR_COLORS[ind.type] }}
            >
              {ind.type}({ind.period})
              <button
                onClick={() => handleRemoveIndicator(i)}
                className="text-bloomberg-muted hover:text-white ml-0.5"
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Main chart area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {isLoading ? (
          <LoadingState />
        ) : candles && candles.length > 0 ? (
          <div className="flex flex-col">
            {/* Main chart */}
            {chartType === "candle" ? (
              <CandlestickChart
                data={candles}
                height={rsiData || macdData ? 300 : 400}
                indicators={overlayIndicators}
                onCrosshairMove={setCrosshairData}
              />
            ) : chartType === "line" ? (
              <LineChart
                data={lineData}
                dataKey="value"
                color="#fb8b1e"
                height={rsiData || macdData ? 300 : 400}
              />
            ) : (
              <AreaChart
                data={lineData}
                height={rsiData || macdData ? 300 : 400}
              />
            )}

            {/* RSI sub-chart */}
            {rsiData && rsiData.length > 0 && (
              <div className="border-t border-bloomberg-border">
                <div className="text-[10px] text-bloomberg-muted px-2 py-0.5 font-mono">
                  RSI({rsiIndicator!.period})
                </div>
                <ResponsiveContainer width="100%" height={100}>
                  <RechartsLine data={rsiData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis dataKey="date" stroke="#888" fontSize={9} tickLine={false} hide />
                    <YAxis stroke="#888" fontSize={9} tickLine={false} width={40} domain={[0, 100]} ticks={[0, 30, 50, 70, 100]} />
                    <Tooltip
                      contentStyle={{ background: "#111", border: "1px solid #333", fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}
                      labelStyle={{ color: "#fb8b1e" }}
                    />
                    <ReferenceLine y={70} stroke="#ff3b3b" strokeDasharray="3 3" strokeOpacity={0.6} />
                    <ReferenceLine y={30} stroke="#00d26a" strokeDasharray="3 3" strokeOpacity={0.6} />
                    <Line type="monotone" dataKey="rsi" stroke="#E91E63" dot={false} strokeWidth={1} />
                  </RechartsLine>
                </ResponsiveContainer>
              </div>
            )}

            {/* MACD sub-chart */}
            {macdData && macdData.length > 0 && (
              <div className="border-t border-bloomberg-border">
                <div className="text-[10px] text-bloomberg-muted px-2 py-0.5 font-mono">
                  MACD({macdIndicator!.period})
                </div>
                <ResponsiveContainer width="100%" height={100}>
                  <ComposedChart data={macdData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                    <XAxis dataKey="date" stroke="#888" fontSize={9} tickLine={false} hide />
                    <YAxis stroke="#888" fontSize={9} tickLine={false} width={40} />
                    <Tooltip
                      contentStyle={{ background: "#111", border: "1px solid #333", fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}
                      labelStyle={{ color: "#fb8b1e" }}
                    />
                    <Bar dataKey="histogram" fill="#555" />
                    <Line type="monotone" dataKey="macd" stroke="#00BCD4" dot={false} strokeWidth={1} />
                    <Line type="monotone" dataKey="signal" stroke="#FF9800" dot={false} strokeWidth={1} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-bloomberg-muted text-sm">NO CHART DATA</div>
        )}
      </div>

      {/* OHLCV info bar */}
      <div className="flex items-center gap-3 px-1 py-0.5 border-t border-bloomberg-border text-[10px] shrink-0 bg-bloomberg-panel">
        {crosshairData ? (
          <>
            <span><span className="text-bloomberg-amber">O:</span> {formatPrice(crosshairData.open)}</span>
            <span><span className="text-bloomberg-amber">H:</span> {formatPrice(crosshairData.high)}</span>
            <span><span className="text-bloomberg-amber">L:</span> {formatPrice(crosshairData.low)}</span>
            <span><span className="text-bloomberg-amber">C:</span> {formatPrice(crosshairData.close)}</span>
            {crosshairData.volume > 0 && <span><span className="text-bloomberg-amber">V:</span> {formatVolume(crosshairData.volume)}</span>}
          </>
        ) : candles && candles.length > 0 ? (
          <>
            <span><span className="text-bloomberg-amber">O:</span> {formatPrice(candles[candles.length - 1].open)}</span>
            <span><span className="text-bloomberg-amber">H:</span> {formatPrice(candles[candles.length - 1].high)}</span>
            <span><span className="text-bloomberg-amber">L:</span> {formatPrice(candles[candles.length - 1].low)}</span>
            <span><span className="text-bloomberg-amber">C:</span> {formatPrice(candles[candles.length - 1].close)}</span>
            <span><span className="text-bloomberg-amber">V:</span> {formatVolume(candles[candles.length - 1].volume)}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
