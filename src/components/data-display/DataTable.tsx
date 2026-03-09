"use client";
import { useState, type ReactNode } from "react";

interface DataTableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  format?: (value: unknown, row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  highlightRow?: (row: T) => boolean;
  maxHeight?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  highlightRow,
  maxHeight = "100%",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function handleSort(key: string) {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else { setSortKey(null); setSortDir("asc"); }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const cmp = typeof aVal === "number" && typeof bVal === "number"
          ? aVal - bVal
          : String(aVal).localeCompare(String(bVal));
        return sortDir === "asc" ? cmp : -cmp;
      })
    : data;

  return (
    <div className="overflow-auto" style={{ maxHeight }}>
      <table className="bb-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width, textAlign: col.align || "left" }}
                className={col.sortable ? "cursor-pointer hover:text-bloomberg-white select-none" : ""}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.header}
                {sortKey === col.key && (
                  <span className="ml-1">{sortDir === "asc" ? "\u25B2" : "\u25BC"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              className={`${onRowClick ? "cursor-pointer" : ""} ${highlightRow?.(row) ? "!bg-bloomberg-amber/10" : ""}`}
            >
              {columns.map((col) => {
                const value = row[col.key];
                return (
                  <td
                    key={col.key}
                    style={{ textAlign: col.align || "left" }}
                    className={col.align === "right" ? "num" : ""}
                  >
                    {col.format ? col.format(value, row) : String(value ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center text-bloomberg-muted py-4">
                NO DATA AVAILABLE
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
