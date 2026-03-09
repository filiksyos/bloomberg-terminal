const BASE_URL = "https://open.er-api.com/v6/latest";

export async function getLatestRates(base: string = "USD") {
  const res = await fetch(`${BASE_URL}/${base}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`ExchangeRate API: ${res.status}`);
  return res.json();
}

export async function convertCurrency(from: string, to: string, amount: number) {
  const data = await getLatestRates(from);
  const rate = data.rates[to];
  if (!rate) throw new Error(`No rate found for ${from}/${to}`);
  return {
    from,
    to,
    rate,
    amount,
    result: amount * rate,
    timestamp: data.time_last_update_utc,
  };
}
