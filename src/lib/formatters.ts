import numeral from "numeral";
import { format, formatDistanceToNow } from "date-fns";

export function formatPrice(value: number, decimals: number = 2): string {
  return numeral(value).format(`0,0.${"0".repeat(decimals)}`);
}

export function formatLargeNumber(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e12) return numeral(value).format("$0.00a").toUpperCase();
  if (abs >= 1e9) return numeral(value).format("$0.00a").toUpperCase();
  if (abs >= 1e6) return numeral(value).format("$0.00a").toUpperCase();
  if (abs >= 1e3) return numeral(value).format("$0.00a").toUpperCase();
  return numeral(value).format("$0,0.00");
}

export function formatPercent(value: number, decimals: number = 2): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatChange(value: number, decimals: number = 2): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}`;
}

export function formatVolume(value: number): string {
  if (value >= 1e9) return (value / 1e9).toFixed(1) + "B";
  if (value >= 1e6) return (value / 1e6).toFixed(1) + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(1) + "K";
  return value.toString();
}

export function formatDate(date: string | number): string {
  return format(new Date(date), "yyyy-MM-dd");
}

export function formatDateTime(date: string | number): string {
  return format(new Date(date), "yyyy-MM-dd HH:mm");
}

export function formatTime(date: string | number): string {
  return format(new Date(date), "HH:mm:ss");
}

export function formatRelativeTime(date: string | number): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getChangeColor(value: number): string {
  if (value > 0) return "text-bloomberg-green";
  if (value < 0) return "text-bloomberg-red";
  return "text-bloomberg-white";
}
