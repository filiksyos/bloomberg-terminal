const BASE_URL = "https://api.stlouisfed.org/fred";

function getKey(): string {
  return process.env.FRED_API_KEY || "";
}

async function fredFetch(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", getKey());
  url.searchParams.set("file_type", "json");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`FRED ${endpoint}: ${res.status}`);
  return res.json();
}

export async function getSeriesObservations(
  seriesId: string,
  limit: number = 100,
  sortOrder: string = "desc"
) {
  return fredFetch("/series/observations", {
    series_id: seriesId,
    limit: limit.toString(),
    sort_order: sortOrder,
  });
}

export async function getSeriesInfo(seriesId: string) {
  return fredFetch("/series", { series_id: seriesId });
}

export async function getMultipleSeries(seriesIds: string[], limit: number = 1) {
  const results = await Promise.all(
    seriesIds.map((id) => getSeriesObservations(id, limit, "desc"))
  );
  return seriesIds.reduce((acc, id, i) => {
    acc[id] = results[i];
    return acc;
  }, {} as Record<string, unknown>);
}
