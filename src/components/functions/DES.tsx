"use client";
import { useStockQuote } from "@/hooks/useStockQuote";
import { useStockProfile } from "@/hooks/useStockProfile";
import { useCandles } from "@/hooks/useCandles";
import { PriceDisplay } from "@/components/data-display/PriceDisplay";
import { KeyValueGrid } from "@/components/data-display/KeyValueGrid";
import { LoadingState } from "@/components/data-display/LoadingState";
import { AreaChart } from "@/components/charts/AreaChart";
import { formatLargeNumber, formatPercent, formatPrice } from "@/lib/formatters";
import type { Security } from "@/lib/types";

export function DES({ security }: { security?: Security | null }) {
  const symbol = security?.symbol;
  const { data: quote, isLoading: quoteLoading } = useStockQuote(symbol);
  const { data: profile, isLoading: profileLoading } = useStockProfile(symbol);

  const now = Math.floor(Date.now() / 1000);
  const from = now - 180 * 86400;
  const { data: candles } = useCandles(symbol, "D", from, now);

  if (!security) {
    return <div className="flex items-center justify-center h-full text-bloomberg-amber text-[11px]">Enter a security in the command bar (e.g., AAPL &lt;GO&gt;)</div>;
  }

  if (quoteLoading || profileLoading) return <LoadingState />;

  const chartData = (candles || []).map((c) => ({
    date: new Date(c.time * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: c.close,
  }));

  const companyInfo = [
    { label: "Name", value: profile?.name || symbol },
    { label: "Exchange", value: profile?.exchange || "" },
    { label: "Sector", value: profile?.sector || "" },
    { label: "Industry", value: profile?.industry || "" },
    { label: "Country", value: profile?.country || "" },
    { label: "IPO Date", value: profile?.ipo || "" },
    { label: "Website", value: profile?.website ? <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-bloomberg-blue hover:underline">{profile.website.replace(/https?:\/\/(www\.)?/, "")}</a> : "" },
    { label: "CEO", value: profile?.ceo || "" },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = profile as any;
  const keyFinancials = [
    { label: "P/E", value: p?.peRatio ? formatPrice(p.peRatio as number) : "--" },
    { label: "P/B", value: p?.pbRatio ? formatPrice(p.pbRatio as number) : "--" },
    { label: "EV/EBITDA", value: p?.evToEbitda ? formatPrice(p.evToEbitda as number) : "--" },
    { label: "Div Yield", value: p?.dividendYield ? formatPercent(p.dividendYield as number) : "--" },
    { label: "Mkt Cap", value: profile?.marketCap ? formatLargeNumber(profile.marketCap) : "--" },
    { label: "Beta", value: p?.beta ? (p.beta as number).toFixed(2) : "--" },
    { label: "52W High", value: p?.week52High ? `$${formatPrice(p.week52High as number)}` : "--" },
    { label: "52W Low", value: p?.week52Low ? `$${formatPrice(p.week52Low as number)}` : "--" },
    { label: "ROE", value: p?.roe ? formatPercent(p.roe as number) : "--" },
    { label: "ROA", value: p?.roa ? formatPercent(p.roa as number) : "--" },
    { label: "EPS", value: p?.eps ? `$${formatPrice(p.eps as number)}` : "--" },
    { label: "Rev Growth", value: p?.revenueGrowth ? formatPercent(p.revenueGrowth as number) : "--" },
  ];

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="border border-bloomberg-border p-1">
        <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">Company Information</div>
        <KeyValueGrid items={companyInfo} columns={4} />
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-1">
        <div className="border border-bloomberg-border p-1 min-w-[160px]">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">Price</div>
          {quote && (
            <div>
              <PriceDisplay price={quote.price} change={quote.change} changePercent={quote.changePercent} size="lg" />
              <div className="mt-0.5 text-[10px] text-bloomberg-muted space-y-0">
                <div>H: ${formatPrice(quote.high)}  L: ${formatPrice(quote.low)}</div>
                <div>O: ${formatPrice(quote.open)}  PC: ${formatPrice(quote.prevClose)}</div>
              </div>
            </div>
          )}
        </div>
        <div className="border border-bloomberg-border p-1">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">Key Financials</div>
          <KeyValueGrid items={keyFinancials} columns={4} />
        </div>
      </div>

      {profile?.description && (
        <div className="border border-bloomberg-border p-1">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">Business Description</div>
          <p className="text-[10px] text-bloomberg-white leading-tight">{profile.description}</p>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="border border-bloomberg-border p-1">
          <div className="text-[9px] text-bloomberg-amber font-bold uppercase mb-0.5">6-Month Price History</div>
          <AreaChart data={chartData} height={130} />
        </div>
      )}
    </div>
  );
}
