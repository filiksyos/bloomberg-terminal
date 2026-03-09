const BASE_URL = "https://api.coingecko.com/api/v3";

async function geckoFetch(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { accept: "application/json" },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`CoinGecko ${endpoint}: ${res.status}`);
  return res.json();
}

export async function getCoinsMarkets(vsCurrency: string = "usd", perPage: number = 50) {
  return geckoFetch("/coins/markets", {
    vs_currency: vsCurrency,
    order: "market_cap_desc",
    per_page: perPage.toString(),
    page: "1",
    sparkline: "true",
    price_change_percentage: "24h,7d",
  });
}

export async function getCoinData(id: string) {
  return geckoFetch(`/coins/${id}`, {
    localization: "false",
    tickers: "false",
    community_data: "false",
    developer_data: "false",
  });
}

export async function getGlobalData() {
  return geckoFetch("/global");
}
