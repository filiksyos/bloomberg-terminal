"use client";
import { ResponsiveContainer, AreaChart as RechartsArea, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface AreaChartProps {
  data: { date: string; value: number; [key: string]: unknown }[];
  height?: number;
  dataKey?: string;
  color?: string;
}

export function AreaChart({ data, height = 200, dataKey = "value", color = "#fb8b1e" }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsArea data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
        <XAxis dataKey="date" stroke="#888" fontSize={10} tickLine={false} />
        <YAxis stroke="#888" fontSize={10} tickLine={false} width={60} />
        <Tooltip
          contentStyle={{
            background: "#111",
            border: "1px solid #333",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
          }}
          labelStyle={{ color: "#fb8b1e" }}
        />
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fill={`url(#gradient-${dataKey})`}
          strokeWidth={1.5}
        />
      </RechartsArea>
    </ResponsiveContainer>
  );
}
