import { formatPrice, formatPercent, getChangeColor } from "@/lib/formatters";

interface MiniQuoteProps {
  symbol: string;
  price: number;
  changePercent: number;
}

export function MiniQuote({ symbol, price, changePercent }: MiniQuoteProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-bloomberg-amber font-bold">{symbol}</span>
      <span className="text-bloomberg-white">${formatPrice(price)}</span>
      <span className={getChangeColor(changePercent)}>{formatPercent(changePercent)}</span>
    </div>
  );
}
