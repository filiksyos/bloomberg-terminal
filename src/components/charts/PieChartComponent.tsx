"use client";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, type PieLabelRenderProps } from "recharts";

interface PieChartComponentProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

const COLORS = ["#fb8b1e", "#4af6c3", "#0068ff", "#00d26a", "#ffd700", "#ff433d", "#888888", "#c97016"];

export function PieChartComponent({ data, height = 250, innerRadius = 40, outerRadius = 80 }: PieChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          label={(props: PieLabelRenderProps) => `${props.name ?? ""} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`}
          labelLine={{ stroke: "#888" }}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#111",
            border: "1px solid #333",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
          }}
        />
        <Legend
          wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#888" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
