"use client";
import { ResponsiveContainer, LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface LineChartProps {
  data: { date: string; value: number; [key: string]: unknown }[];
  height?: number;
  dataKey?: string;
  color?: string;
  showGrid?: boolean;
}

export function LineChart({ data, height = 300, dataKey = "value", color = "#fb8b1e", showGrid = true }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLine data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />}
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
        <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} strokeWidth={1.5} />
      </RechartsLine>
    </ResponsiveContainer>
  );
}
