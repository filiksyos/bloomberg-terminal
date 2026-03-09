"use client";
import { useEffect, useRef } from "react";
import { createChart, type IChartApi, type ISeriesApi, CrosshairMode, ColorType, CandlestickSeries, HistogramSeries, LineSeries, type Time } from "lightweight-charts";
import type { CandleData } from "@/lib/types";
import { calculateSMA, calculateEMA, calculateBollingerBands } from "@/lib/indicators";

export interface IndicatorConfig {
  type: "SMA" | "EMA" | "RSI" | "MACD" | "BB";
  period: number;
  color?: string;
}

interface CandlestickChartProps {
  data: CandleData[];
  height?: number;
  indicators?: IndicatorConfig[];
  onCrosshairMove?: (data: { time: number; open: number; high: number; low: number; close: number; volume: number } | null) => void;
}

const DEFAULT_COLORS: Record<string, string> = {
  SMA: "#2196F3",
  EMA: "#FF9800",
  BB_MIDDLE: "#673AB7",
  BB_BAND: "rgba(103,58,183,0.5)",
};

export function CandlestickChart({ data, height = 400, indicators = [], onCrosshairMove }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const indicatorSeriesRef = useRef<ISeriesApi<"Line">[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "#000000" },
        textColor: "#888888",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
      },
      grid: {
        vertLines: { color: "#1a1a1a" },
        horzLines: { color: "#1a1a1a" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: "#333333" },
      timeScale: {
        borderColor: "#333333",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#00d26a",
      downColor: "#ff3b3b",
      borderUpColor: "#00d26a",
      borderDownColor: "#ff3b3b",
      wickUpColor: "#00d26a",
      wickDownColor: "#ff3b3b",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    if (onCrosshairMove) {
      chart.subscribeCrosshairMove((param) => {
        if (!param.time || !param.seriesData) {
          onCrosshairMove(null);
          return;
        }
        const candleData = param.seriesData.get(candleSeries) as { open: number; high: number; low: number; close: number } | undefined;
        if (candleData) {
          onCrosshairMove({
            time: param.time as number,
            ...candleData,
            volume: 0,
          });
        }
      });
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) chart.applyOptions({ width: entry.contentRect.width });
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [height, onCrosshairMove]);

  // Update candle + volume data
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || !data.length) return;

    const candleData = data.map((d) => ({
      time: d.time as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    const volumeData = data.map((d) => ({
      time: d.time as Time,
      value: d.volume,
      color: d.close >= d.open ? "rgba(0,210,106,0.3)" : "rgba(255,59,59,0.3)",
    }));

    candleSeriesRef.current.setData(candleData);
    volumeSeriesRef.current.setData(volumeData);
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  // Update indicator overlays
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !data.length) return;

    // Remove old indicator series
    for (const series of indicatorSeriesRef.current) {
      try {
        chart.removeSeries(series);
      } catch {
        // series may already be removed
      }
    }
    indicatorSeriesRef.current = [];

    // Only process overlay indicators (SMA, EMA, BB)
    const overlayIndicators = indicators.filter((ind) => ind.type === "SMA" || ind.type === "EMA" || ind.type === "BB");

    for (const indicator of overlayIndicators) {
      if (indicator.type === "SMA") {
        const values = calculateSMA(data, indicator.period);
        const lineData = data
          .map((d, i) => (values[i] !== null ? { time: d.time as Time, value: values[i]! } : null))
          .filter((d): d is { time: Time; value: number } => d !== null);

        const series = chart.addSeries(LineSeries, {
          color: indicator.color || DEFAULT_COLORS.SMA,
          lineWidth: 1,
          priceScaleId: "right",
        });
        series.setData(lineData);
        indicatorSeriesRef.current.push(series);
      } else if (indicator.type === "EMA") {
        const values = calculateEMA(data, indicator.period);
        const lineData = data
          .map((d, i) => (values[i] !== null ? { time: d.time as Time, value: values[i]! } : null))
          .filter((d): d is { time: Time; value: number } => d !== null);

        const series = chart.addSeries(LineSeries, {
          color: indicator.color || DEFAULT_COLORS.EMA,
          lineWidth: 1,
          priceScaleId: "right",
        });
        series.setData(lineData);
        indicatorSeriesRef.current.push(series);
      } else if (indicator.type === "BB") {
        const bb = calculateBollingerBands(data, indicator.period);

        // Upper band
        const upperData = data
          .map((d, i) => (bb.upper[i] !== null ? { time: d.time as Time, value: bb.upper[i]! } : null))
          .filter((d): d is { time: Time; value: number } => d !== null);
        const upperSeries = chart.addSeries(LineSeries, {
          color: indicator.color || DEFAULT_COLORS.BB_BAND,
          lineWidth: 1,
          priceScaleId: "right",
        });
        upperSeries.setData(upperData);
        indicatorSeriesRef.current.push(upperSeries);

        // Middle band
        const middleData = data
          .map((d, i) => (bb.middle[i] !== null ? { time: d.time as Time, value: bb.middle[i]! } : null))
          .filter((d): d is { time: Time; value: number } => d !== null);
        const middleSeries = chart.addSeries(LineSeries, {
          color: DEFAULT_COLORS.BB_MIDDLE,
          lineWidth: 1,
          priceScaleId: "right",
        });
        middleSeries.setData(middleData);
        indicatorSeriesRef.current.push(middleSeries);

        // Lower band
        const lowerData = data
          .map((d, i) => (bb.lower[i] !== null ? { time: d.time as Time, value: bb.lower[i]! } : null))
          .filter((d): d is { time: Time; value: number } => d !== null);
        const lowerSeries = chart.addSeries(LineSeries, {
          color: indicator.color || DEFAULT_COLORS.BB_BAND,
          lineWidth: 1,
          priceScaleId: "right",
        });
        lowerSeries.setData(lowerData);
        indicatorSeriesRef.current.push(lowerSeries);
      }
    }
  }, [data, indicators]);

  return <div ref={containerRef} className="w-full" />;
}
