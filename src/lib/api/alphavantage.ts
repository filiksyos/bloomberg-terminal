const BASE_URL = "https://www.alphavantage.co/query";

function getKey(): string {
  return process.env.ALPHA_VANTAGE_API_KEY || "";
}

async function avFetch(params: Record<string, string>) {
  const url = new URL(BASE_URL);
  url.searchParams.set("apikey", getKey());
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Alpha Vantage: ${res.status}`);
  return res.json();
}

export async function getCommodityPrice(commodity: string) {
  return avFetch({ function: commodity, interval: "monthly" });
}

export async function getTechnicalIndicator(symbol: string, indicator: string, timePeriod: string = "14") {
  return avFetch({
    function: indicator,
    symbol,
    interval: "daily",
    time_period: timePeriod,
    series_type: "close",
  });
}
