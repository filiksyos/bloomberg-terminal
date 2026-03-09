const BASE_URL = "https://finnhub.io/api/v1";

function getKey(): string {
  return process.env.FINNHUB_API_KEY || "";
}

async function finnhubFetch(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("token", getKey());
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`Finnhub ${endpoint}: ${res.status}`);
  return res.json();
}

export async function getQuote(symbol: string) {
  return finnhubFetch("/quote", { symbol });
}

export async function getProfile(symbol: string) {
  return finnhubFetch("/stock/profile2", { symbol });
}

export async function getCandles(symbol: string, resolution: string, from: number, to: number) {
  return finnhubFetch("/stock/candle", {
    symbol,
    resolution,
    from: from.toString(),
    to: to.toString(),
  });
}

export async function searchSymbol(query: string) {
  return finnhubFetch("/search", { q: query });
}

export async function getCompanyPeers(symbol: string) {
  return finnhubFetch("/stock/peers", { symbol });
}

export async function getRecommendations(symbol: string) {
  return finnhubFetch("/stock/recommendation", { symbol });
}

export async function getPriceTarget(symbol: string) {
  return finnhubFetch("/stock/price-target", { symbol });
}

export async function getEarnings(symbol: string) {
  return finnhubFetch("/stock/earnings", { symbol });
}

export async function getMarketNews(category: string = "general") {
  return finnhubFetch("/news", { category });
}

export async function getCompanyNews(symbol: string, from: string, to: string) {
  return finnhubFetch("/company-news", { symbol, from, to });
}

export async function getEconomicCalendar(from: string, to: string) {
  return finnhubFetch("/calendar/economic", { from, to });
}

export async function getForexRates() {
  return finnhubFetch("/forex/rates", { base: "USD" });
}

export async function getForexCandles(symbol: string, resolution: string, from: number, to: number) {
  return finnhubFetch("/forex/candle", {
    symbol,
    resolution,
    from: from.toString(),
    to: to.toString(),
  });
}

export async function getCryptoCandles(symbol: string, resolution: string, from: number, to: number) {
  return finnhubFetch("/crypto/candle", {
    symbol,
    resolution,
    from: from.toString(),
    to: to.toString(),
  });
}

export async function getBasicFinancials(symbol: string) {
  return finnhubFetch("/stock/metric", { symbol, metric: "all" });
}
