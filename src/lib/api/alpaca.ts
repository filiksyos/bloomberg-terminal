import { checkRateLimit } from "@/lib/rateLimit";

function getBaseUrl(): string {
  const env = process.env.ALPACA_TRADING_ENV || "paper";
  return env === "live"
    ? "https://api.alpaca.markets"
    : "https://paper-api.alpaca.markets";
}

function getHeaders(): Record<string, string> {
  return {
    "APCA-API-KEY-ID": process.env.ALPACA_API_KEY_ID || "",
    "APCA-API-SECRET-KEY": process.env.ALPACA_API_SECRET_KEY || "",
    "Content-Type": "application/json",
  };
}

async function alpacaFetch(
  endpoint: string,
  options: { method?: string; body?: unknown; params?: Record<string, string> } = {}
) {
  if (!checkRateLimit("alpaca", 200, 60000)) {
    throw new Error("Alpaca rate limit exceeded (200/min)");
  }

  const url = new URL(`${getBaseUrl()}${endpoint}`);
  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    method: options.method || "GET",
    headers: getHeaders(),
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Alpaca ${endpoint}: ${res.status} - ${errorBody}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// Account
export async function getAccount() {
  return alpacaFetch("/v2/account");
}

// Positions
export async function getPositions() {
  return alpacaFetch("/v2/positions");
}

export async function getPosition(symbol: string) {
  return alpacaFetch(`/v2/positions/${encodeURIComponent(symbol)}`);
}

export async function closePosition(symbol: string) {
  return alpacaFetch(`/v2/positions/${encodeURIComponent(symbol)}`, { method: "DELETE" });
}

export async function closeAllPositions() {
  return alpacaFetch("/v2/positions", { method: "DELETE" });
}

// Orders
export async function getOrders(status: string = "all", limit: number = 100) {
  return alpacaFetch("/v2/orders", {
    params: { status, limit: limit.toString(), direction: "desc" },
  });
}

export async function getOrder(orderId: string) {
  return alpacaFetch(`/v2/orders/${orderId}`);
}

export async function placeOrder(order: {
  symbol: string;
  qty?: number;
  notional?: number;
  side: string;
  type: string;
  time_in_force: string;
  limit_price?: number;
  stop_price?: number;
}) {
  return alpacaFetch("/v2/orders", { method: "POST", body: order });
}

export async function cancelOrder(orderId: string) {
  return alpacaFetch(`/v2/orders/${orderId}`, { method: "DELETE" });
}

export async function cancelAllOrders() {
  return alpacaFetch("/v2/orders", { method: "DELETE" });
}

// Portfolio History
export async function getPortfolioHistory(period: string = "1M", timeframe: string = "1D") {
  return alpacaFetch("/v2/account/portfolio/history", {
    params: { period, timeframe },
  });
}
