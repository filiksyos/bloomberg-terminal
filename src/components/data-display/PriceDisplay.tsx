import { formatPrice, formatChange, formatPercent, getChangeColor } from "@/lib/formatters";

interface PriceDisplayProps {
  price: number;
  change: number;
  changePercent: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({ price, change, changePercent, currency = "USD", size = "md" }: PriceDisplayProps) {
  const changeColor = getChangeColor(change);
  const sizeClasses = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`font-bold text-bloomberg-white ${sizeClasses[size]}`}>
        {currency === "USD" ? "$" : ""}{formatPrice(price)}
      </span>
      <span className={`${changeColor} text-xs font-medium`}>
        {formatChange(change)}
      </span>
      <span className={`${changeColor} text-xs`}>
        ({formatPercent(changePercent)})
      </span>
    </div>
  );
}
