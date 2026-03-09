"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { YieldCurvePoint } from "@/lib/types";

interface YieldCurveChartProps {
  data: YieldCurvePoint[];
  height?: number;
}

export function YieldCurveChart({ data, height = 250 }: YieldCurveChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
        <XAxis dataKey="maturity" stroke="#888" fontSize={10} />
        <YAxis
          stroke="#888"
          fontSize={10}
          domain={["auto", "auto"]}
          tickFormatter={(v) => `${v.toFixed(1)}%`}
        />
        <Tooltip
          contentStyle={{
            background: "#111",
            border: "1px solid #333",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
          }}
          labelStyle={{ color: "#fb8b1e" }}
          formatter={(value?: number) => [`${(value ?? 0).toFixed(3)}%`, "Yield"]}
        />
        <Line
          type="monotone"
          dataKey="yield"
          stroke="#fb8b1e"
          dot={{ fill: "#fb8b1e", r: 3 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
