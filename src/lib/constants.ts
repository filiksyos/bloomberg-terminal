import type { CommandSuggestion, IndexProxy } from "./types";

export const FUNCTION_REGISTRY: CommandSuggestion[] = [
  // Equity Analysis
  { code: "DES", name: "Description", description: "Company overview and key statistics", requiresSecurity: true, category: "Equity" },
  { code: "GP", name: "Graph/Price", description: "Interactive price chart with technical indicators", requiresSecurity: true, category: "Equity" },
  { code: "FA", name: "Financial Analysis", description: "Income statement, balance sheet, and cash flow", requiresSecurity: true, category: "Equity" },
  { code: "ANR", name: "Analyst Recommendations", description: "Analyst ratings, price targets, and consensus", requiresSecurity: true, category: "Equity" },
  { code: "DVD", name: "Dividends", description: "Dividend history and upcoming payments", requiresSecurity: true, category: "Equity" },
  { code: "ERN", name: "Earnings", description: "Earnings history, estimates, and surprises", requiresSecurity: true, category: "Equity" },
  { code: "COMP", name: "Comparable Companies", description: "Peer comparison and relative valuation", requiresSecurity: true, category: "Equity" },
  { code: "RV", name: "Relative Value", description: "Relative valuation metrics vs peers", requiresSecurity: true, category: "Equity" },

  { code: "BQ", name: "Bloomberg Quote", description: "Detailed quote with bid/ask, volume, and ranges", requiresSecurity: true, category: "Equity" },
  { code: "CN", name: "Company News", description: "Security-specific news and headlines", requiresSecurity: true, category: "Equity" },
  { code: "MGMT", name: "Management", description: "Key executives and board members", requiresSecurity: true, category: "Equity" },
  { code: "CACS", name: "Corporate Actions", description: "Dividends, splits, and corporate events", requiresSecurity: true, category: "Equity" },

  // News & Market
  { code: "TOP", name: "Top News", description: "Top market news and headlines", requiresSecurity: false, category: "News" },
  { code: "WEI", name: "World Equity Indices", description: "Global equity index performance", requiresSecurity: false, category: "Market" },
  { code: "MOST", name: "Most Active", description: "Most active stocks by volume and movers", requiresSecurity: false, category: "Market" },
  { code: "MOV", name: "Price Movement", description: "Historical price movement analysis", requiresSecurity: true, category: "Equity" },
  { code: "GIP", name: "Sector Performance", description: "S&P 500 sector performance comparison", requiresSecurity: false, category: "Market" },
  { code: "IPO", name: "IPO Calendar", description: "Recent and upcoming IPO listings", requiresSecurity: false, category: "Market" },
  { code: "SECF", name: "Security Finder", description: "Advanced security search and discovery", requiresSecurity: false, category: "Tools" },

  // Fixed Income
  { code: "WB", name: "World Bond Markets", description: "Global government bond yields", requiresSecurity: false, category: "Fixed Income" },
  { code: "CRVF", name: "Yield Curve", description: "Treasury yield curve visualization", requiresSecurity: false, category: "Fixed Income" },

  // Foreign Exchange
  { code: "FXCA", name: "FX Calculator", description: "Currency conversion calculator", requiresSecurity: false, category: "Forex" },
  { code: "FXMON", name: "FX Monitor", description: "Real-time foreign exchange rates", requiresSecurity: false, category: "Forex" },

  // Commodities
  { code: "CMDTY", name: "Commodities", description: "Commodity prices across energy, metals, agriculture", requiresSecurity: false, category: "Commodities" },

  // Economics
  { code: "ECO", name: "Economic Calendar", description: "Upcoming economic events and releases", requiresSecurity: false, category: "Economics" },
  { code: "ECST", name: "Economic Statistics", description: "Key economic indicators and data series", requiresSecurity: false, category: "Economics" },

  // Crypto
  { code: "CRYPTO", name: "Cryptocurrency", description: "Cryptocurrency prices and market data", requiresSecurity: false, category: "Crypto" },

  // Portfolio & Tools
  { code: "PORT", name: "Portfolio", description: "Portfolio manager and performance tracker", requiresSecurity: false, category: "Portfolio" },
  { code: "EQS", name: "Equity Screener", description: "Stock screener with custom filters", requiresSecurity: false, category: "Tools" },
  { code: "OMON", name: "Options Monitor", description: "Options chain and greeks analysis", requiresSecurity: true, category: "Tools" },
  { code: "HMAP", name: "Heat Map", description: "Market sector heat map visualization", requiresSecurity: false, category: "Tools" },
  { code: "ALRT", name: "Alerts", description: "Price and volume alert manager", requiresSecurity: false, category: "Tools" },
  { code: "IB", name: "Instant Bloomberg", description: "Chat and messaging", requiresSecurity: false, category: "Communication" },
  { code: "WATC", name: "Watchlist", description: "Custom security watchlist", requiresSecurity: false, category: "Tools" },

  // Trading
  { code: "TRADE", name: "Order Entry", description: "Place trades via Alpaca paper trading", requiresSecurity: true, category: "Trading" },
  { code: "OMS", name: "Order Management", description: "Open orders and order history", requiresSecurity: false, category: "Trading" },
  { code: "BLOTTER", name: "Trade Blotter", description: "Positions, P&L, and portfolio history", requiresSecurity: false, category: "Trading" },

  // System
  { code: "SET", name: "Settings", description: "Terminal settings and preferences", requiresSecurity: false, category: "System" },
  { code: "HELP", name: "Help", description: "Function codes reference and help", requiresSecurity: false, category: "System" },
];

export const INDEX_PROXIES: IndexProxy[] = [
  // Americas
  { etf: "SPY", name: "S&P 500", region: "americas" },
  { etf: "QQQ", name: "NASDAQ 100", region: "americas" },
  { etf: "DIA", name: "Dow Jones Industrial Average", region: "americas" },
  { etf: "IWM", name: "Russell 2000", region: "americas" },
  { etf: "EWC", name: "MSCI Canada", region: "americas" },
  { etf: "EWZ", name: "MSCI Brazil", region: "americas" },
  { etf: "EWW", name: "MSCI Mexico", region: "americas" },

  // EMEA
  { etf: "EWU", name: "MSCI United Kingdom", region: "emea" },
  { etf: "EWG", name: "MSCI Germany", region: "emea" },
  { etf: "EWQ", name: "MSCI France", region: "emea" },
  { etf: "EWI", name: "MSCI Italy", region: "emea" },
  { etf: "EWP", name: "MSCI Spain", region: "emea" },
  { etf: "EWL", name: "MSCI Switzerland", region: "emea" },
  { etf: "EWN", name: "MSCI Netherlands", region: "emea" },
  { etf: "EZA", name: "MSCI South Africa", region: "emea" },

  // APAC
  { etf: "EWJ", name: "MSCI Japan", region: "apac" },
  { etf: "EWY", name: "MSCI South Korea", region: "apac" },
  { etf: "EWT", name: "MSCI Taiwan", region: "apac" },
  { etf: "EWA", name: "MSCI Australia", region: "apac" },
  { etf: "EWH", name: "MSCI Hong Kong", region: "apac" },
  { etf: "EWS", name: "MSCI Singapore", region: "apac" },
  { etf: "INDA", name: "MSCI India", region: "apac" },
  { etf: "MCHI", name: "MSCI China", region: "apac" },
];

export const TREASURY_SERIES: { id: string; maturity: string; label: string }[] = [
  { id: "DGS1MO", maturity: "1M", label: "1 Month" },
  { id: "DGS3MO", maturity: "3M", label: "3 Month" },
  { id: "DGS6MO", maturity: "6M", label: "6 Month" },
  { id: "DGS1", maturity: "1Y", label: "1 Year" },
  { id: "DGS2", maturity: "2Y", label: "2 Year" },
  { id: "DGS3", maturity: "3Y", label: "3 Year" },
  { id: "DGS5", maturity: "5Y", label: "5 Year" },
  { id: "DGS7", maturity: "7Y", label: "7 Year" },
  { id: "DGS10", maturity: "10Y", label: "10 Year" },
  { id: "DGS20", maturity: "20Y", label: "20 Year" },
  { id: "DGS30", maturity: "30Y", label: "30 Year" },
];

export const ECONOMIC_INDICATORS: { seriesId: string; title: string; unit: string; frequency: string }[] = [
  { seriesId: "GDP", title: "Gross Domestic Product", unit: "Billions $", frequency: "Quarterly" },
  { seriesId: "UNRATE", title: "Unemployment Rate", unit: "%", frequency: "Monthly" },
  { seriesId: "CPIAUCSL", title: "Consumer Price Index", unit: "Index", frequency: "Monthly" },
  { seriesId: "FEDFUNDS", title: "Federal Funds Rate", unit: "%", frequency: "Monthly" },
  { seriesId: "DFF", title: "Federal Funds Effective Rate", unit: "%", frequency: "Daily" },
  { seriesId: "T10Y2Y", title: "10Y-2Y Treasury Spread", unit: "%", frequency: "Daily" },
  { seriesId: "PAYEMS", title: "Non-Farm Payrolls", unit: "Thousands", frequency: "Monthly" },
  { seriesId: "RSAFS", title: "Retail Sales", unit: "Millions $", frequency: "Monthly" },
  { seriesId: "INDPRO", title: "Industrial Production Index", unit: "Index", frequency: "Monthly" },
  { seriesId: "HOUST", title: "Housing Starts", unit: "Thousands", frequency: "Monthly" },
  { seriesId: "UMCSENT", title: "Consumer Sentiment (UMich)", unit: "Index", frequency: "Monthly" },
  { seriesId: "PCE", title: "Personal Consumption Expenditures", unit: "Billions $", frequency: "Monthly" },
  { seriesId: "PCEPILFE", title: "Core PCE Price Index", unit: "Index", frequency: "Monthly" },
  { seriesId: "M2SL", title: "M2 Money Supply", unit: "Billions $", frequency: "Monthly" },
  { seriesId: "WALCL", title: "Fed Balance Sheet", unit: "Millions $", frequency: "Weekly" },
];

export const MAJOR_FX_PAIRS: string[] = [
  "EURUSD", "GBPUSD", "USDJPY", "USDCHF",
  "AUDUSD", "USDCAD", "NZDUSD",
  "EURGBP", "EURJPY", "GBPJPY",
  "AUDJPY", "EURAUD", "EURCHF",
  "USDCNH", "USDHKD", "USDSGD",
  "USDMXN", "USDZAR", "USDINR",
];

export const FX_CURRENCIES: { code: string; name: string; symbol: string }[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "\u20AC" },
  { code: "GBP", name: "British Pound", symbol: "\u00A3" },
  { code: "JPY", name: "Japanese Yen", symbol: "\u00A5" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "CNH", name: "Chinese Yuan (Offshore)", symbol: "\u00A5" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "INR", name: "Indian Rupee", symbol: "\u20B9" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "KRW", name: "South Korean Won", symbol: "\u20A9" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$" },
  { code: "TRY", name: "Turkish Lira", symbol: "\u20BA" },
];

export const SECTORS: string[] = [
  "Technology",
  "Healthcare",
  "Financials",
  "Consumer Cyclical",
  "Consumer Defensive",
  "Industrials",
  "Energy",
  "Utilities",
  "Real Estate",
  "Basic Materials",
  "Communication Services",
];

export const MARKET_HOURS: {
  market: string;
  timezone: string;
  open: string;
  close: string;
  status: () => "pre-market" | "open" | "after-hours" | "closed";
}[] = [
  {
    market: "NYSE / NASDAQ",
    timezone: "America/New_York",
    open: "09:30",
    close: "16:00",
    status: () => {
      const now = new Date();
      const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
      const hours = et.getHours();
      const minutes = et.getMinutes();
      const time = hours * 60 + minutes;
      const day = et.getDay();
      if (day === 0 || day === 6) return "closed";
      if (time >= 570 && time < 960) return "open";
      if (time >= 240 && time < 570) return "pre-market";
      if (time >= 960 && time < 1200) return "after-hours";
      return "closed";
    },
  },
  {
    market: "London (LSE)",
    timezone: "Europe/London",
    open: "08:00",
    close: "16:30",
    status: () => {
      const now = new Date();
      const uk = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }));
      const hours = uk.getHours();
      const minutes = uk.getMinutes();
      const time = hours * 60 + minutes;
      const day = uk.getDay();
      if (day === 0 || day === 6) return "closed";
      if (time >= 480 && time < 990) return "open";
      return "closed";
    },
  },
  {
    market: "Tokyo (TSE)",
    timezone: "Asia/Tokyo",
    open: "09:00",
    close: "15:00",
    status: () => {
      const now = new Date();
      const jp = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
      const hours = jp.getHours();
      const minutes = jp.getMinutes();
      const time = hours * 60 + minutes;
      const day = jp.getDay();
      if (day === 0 || day === 6) return "closed";
      if (time >= 540 && time < 900) return "open";
      return "closed";
    },
  },
  {
    market: "Hong Kong (HKEX)",
    timezone: "Asia/Hong_Kong",
    open: "09:30",
    close: "16:00",
    status: () => {
      const now = new Date();
      const hk = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));
      const hours = hk.getHours();
      const minutes = hk.getMinutes();
      const time = hours * 60 + minutes;
      const day = hk.getDay();
      if (day === 0 || day === 6) return "closed";
      if (time >= 570 && time < 960) return "open";
      return "closed";
    },
  },
];

export const TIMEFRAME_CONFIG: { label: string; value: string; resolution: string; days: number }[] = [
  { label: "1D", value: "1D", resolution: "5", days: 1 },
  { label: "5D", value: "5D", resolution: "15", days: 5 },
  { label: "1M", value: "1M", resolution: "60", days: 30 },
  { label: "3M", value: "3M", resolution: "D", days: 90 },
  { label: "6M", value: "6M", resolution: "D", days: 180 },
  { label: "YTD", value: "YTD", resolution: "D", days: 0 },
  { label: "1Y", value: "1Y", resolution: "D", days: 365 },
  { label: "3Y", value: "3Y", resolution: "W", days: 1095 },
  { label: "5Y", value: "5Y", resolution: "W", days: 1825 },
  { label: "MAX", value: "MAX", resolution: "M", days: 0 },
];

export const SECTOR_ETFS: { etf: string; sector: string; color: string }[] = [
  { etf: "XLK", sector: "Technology", color: "#0068ff" },
  { etf: "XLV", sector: "Healthcare", color: "#00d26a" },
  { etf: "XLF", sector: "Financials", color: "#fb8b1e" },
  { etf: "XLY", sector: "Consumer Discretionary", color: "#ff433d" },
  { etf: "XLP", sector: "Consumer Staples", color: "#4af6c3" },
  { etf: "XLI", sector: "Industrials", color: "#ffd700" },
  { etf: "XLE", sector: "Energy", color: "#c97016" },
  { etf: "XLU", sector: "Utilities", color: "#888888" },
  { etf: "XLRE", sector: "Real Estate", color: "#9b59b6" },
  { etf: "XLB", sector: "Materials", color: "#e67e22" },
  { etf: "XLC", sector: "Communication", color: "#3498db" },
];

export const DEFAULT_WATCHLIST_SYMBOLS: string[] = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "NVDA",
  "META",
  "TSLA",
  "BRK.B",
  "JPM",
  "V",
  "UNH",
  "XOM",
  "JNJ",
  "WMT",
  "MA",
];
