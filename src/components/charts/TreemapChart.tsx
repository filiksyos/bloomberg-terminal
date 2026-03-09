"use client";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";

interface TreemapItem {
  name: string;
  size: number;
  changePercent: number;
  color: string;
}

interface TreemapChartProps {
  data: TreemapItem[];
  height?: number;
  onItemClick?: (item: TreemapItem) => void;
}

function getHeatmapColor(changePercent: number): string {
  const clamped = Math.max(-5, Math.min(5, changePercent));
  if (clamped < 0) {
    const intensity = Math.abs(clamped) / 5;
    return `rgb(${Math.round(51 + intensity * 204)}, ${Math.round(51 - intensity * 51)}, ${Math.round(51 - intensity * 51)})`;
  } else {
    const intensity = clamped / 5;
    return `rgb(${Math.round(51 - intensity * 51)}, ${Math.round(51 + intensity * 159)}, ${Math.round(51 + intensity * 55)})`;
  }
}

function CustomContent(props: Record<string, unknown>) {
  const { x, y, width, height, name, changePercent } = props as {
    x: number; y: number; width: number; height: number; name: string; changePercent: number;
  };
  if (width < 30 || height < 20) return null;
  const color = getHeatmapColor(changePercent || 0);
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} stroke="#000" strokeWidth={1} />
      {width > 40 && height > 25 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 5} textAnchor="middle" fill="#fff" fontSize={10} fontFamily="JetBrains Mono">
            {name}
          </text>
          <text x={x + width / 2} y={y + height / 2 + 8} textAnchor="middle" fill="#fff" fontSize={9} fontFamily="JetBrains Mono">
            {changePercent != null ? `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%` : ""}
          </text>
        </>
      )}
    </g>
  );
}

export function TreemapChart({ data, height = 400 }: TreemapChartProps) {
  const treemapData = [{
    name: "Market",
    children: data.map((d) => ({
      name: d.name,
      size: d.size,
      changePercent: d.changePercent,
      color: getHeatmapColor(d.changePercent),
    })),
  }];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Treemap
        data={treemapData}
        dataKey="size"
        aspectRatio={4 / 3}
        stroke="#000"
        content={<CustomContent />}
      >
        <Tooltip
          contentStyle={{
            background: "#111",
            border: "1px solid #333",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
          }}
        />
      </Treemap>
    </ResponsiveContainer>
  );
}

export { getHeatmapColor };
