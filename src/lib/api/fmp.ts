const BASE_URL = "https://financialmodelingprep.com/api/v3";

function getKey(): string {
  return process.env.FMP_API_KEY || "";
}

async function fmpFetch(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("apikey", getKey());
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`FMP ${endpoint}: ${res.status}`);
  return res.json();
}

export async function getIncomeStatement(symbol: string, period: string = "annual", limit: number = 5) {
  return fmpFetch(`/income-statement/${symbol}`, { period, limit: limit.toString() });
}

export async function getBalanceSheet(symbol: string, period: string = "annual", limit: number = 5) {
  return fmpFetch(`/balance-sheet-statement/${symbol}`, { period, limit: limit.toString() });
}

export async function getCashFlowStatement(symbol: string, period: string = "annual", limit: number = 5) {
  return fmpFetch(`/cash-flow-statement/${symbol}`, { period, limit: limit.toString() });
}

export async function getKeyMetrics(symbol: string, period: string = "annual", limit: number = 5) {
  return fmpFetch(`/key-metrics/${symbol}`, { period, limit: limit.toString() });
}

export async function getFinancialGrowth(symbol: string, period: string = "annual", limit: number = 5) {
  return fmpFetch(`/financial-growth/${symbol}`, { period, limit: limit.toString() });
}

export async function getCompanyProfile(symbol: string) {
  return fmpFetch(`/profile/${symbol}`);
}

export async function getStockScreener(filters: Record<string, string>) {
  return fmpFetch("/stock-screener", { ...filters, limit: "50" });
}

export async function getDividendHistory(symbol: string) {
  return fmpFetch(`/historical-price-full/stock_dividend/${symbol}`);
}

export async function getStockGainers() {
  return fmpFetch("/stock_market/gainers");
}

export async function getStockLosers() {
  return fmpFetch("/stock_market/losers");
}

export async function getStockMostActive() {
  return fmpFetch("/stock_market/actives");
}
