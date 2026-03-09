import type { ReactNode } from "react";

interface KeyValueItem {
  label: string;
  value: ReactNode;
}

interface KeyValueGridProps {
  items: KeyValueItem[];
  columns?: 2 | 4;
}

export function KeyValueGrid({ items, columns = 2 }: KeyValueGridProps) {
  return (
    <div className={`grid ${columns === 4 ? "grid-cols-4" : "grid-cols-2"} gap-x-3 gap-y-0 p-1`}>
      {items.map((item, i) => (
        <div key={i} className="flex justify-between gap-1 py-px">
          <span className="text-bloomberg-amber text-[9px] font-bold uppercase whitespace-nowrap">
            {item.label}
          </span>
          <span className="text-bloomberg-white text-[11px] text-right font-mono">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
