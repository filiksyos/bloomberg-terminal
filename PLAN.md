# Bloomberg Terminal Clone - Complete Implementation Plan

## Context

Build a full-featured Bloomberg Terminal clone as a Next.js web application. The real Bloomberg Terminal costs $25,000/year and provides comprehensive financial data, analytics, charting, news, and trading tools to financial professionals. This clone replicates the iconic amber-on-black interface, the command-line-driven navigation system, and all major function screens using free financial data APIs.

The project directory is empty — this is a greenfield build.

## Tech Stack

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Package Manager:** pnpm
- **Styling:** Tailwind CSS v4 + custom Bloomberg theme
- **UI Components:** shadcn/ui (customized for Bloomberg aesthetic)
- **State Management:** Zustand with localStorage persistence
- **Data Fetching:** TanStack Query v5
- **Charting:** lightweight-charts (TradingView) for candlestick/financial charts + Recharts for general charts
- **WebSocket:** Native WebSocket via Finnhub for real-time streaming
- **Animations:** Tailwind transitions (minimal — Bloomberg is not flashy)
- **Fonts:** JetBrains Mono (monospace, free, excellent for data-dense UI)
- **Utilities:** date-fns, numeral, clsx, tailwind-merge

## API Strategy

| API | Free Tier | Used For |
|-----|-----------|----------|
| **Finnhub** | 60 calls/min | Stocks, forex, crypto, news, WebSocket streaming, earnings, recommendations, peers |
| **Financial Modeling Prep (FMP)** | 250 calls/day | Financial statements, company profiles, screener, key metrics |
| **CoinGecko** | 30 calls/min | Crypto prices, market data, global stats |
| **FRED** | Unlimited | Treasury yields, economic indicators (GDP, CPI, unemployment, etc.) |
| **ExchangeRate-API** | Unlimited | FX conversion rates, cross-rate matrix |
| **Alpha Vantage** | 25 calls/day | Commodity prices (oil, gold, etc.) |

API keys go in `.env.local`. Server-side API routes proxy all calls (never expose keys to client).

---

## Project Structure

```
bloomberg-terminal/
├── .env.local
├── .env.example
├── .gitignore
├── CLAUDE.md
├── PLAN.md
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── postcss.config.mjs
├── components.json
├── public/
│   └── fonts/
│       ├── JetBrainsMono-Regular.woff2
│       ├── JetBrainsMono-Bold.woff2
│       └── JetBrainsMono-Medium.woff2
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       ├── stocks/
│   │       │   ├── quote/[symbol]/route.ts
│   │       │   ├── profile/[symbol]/route.ts
│   │       │   ├── candles/[symbol]/route.ts
│   │       │   ├── financials/[symbol]/route.ts
│   │       │   ├── peers/[symbol]/route.ts
│   │       │   ├── recommendations/[symbol]/route.ts
│   │       │   ├── earnings/[symbol]/route.ts
│   │       │   ├── dividends/[symbol]/route.ts
│   │       │   └── search/route.ts
│   │       ├── crypto/
│   │       │   ├── prices/route.ts
│   │       │   └── [id]/route.ts
│   │       ├── forex/
│   │       │   ├── rates/route.ts
│   │       │   └── convert/route.ts
│   │       ├── economic/
│   │       │   ├── calendar/route.ts
│   │       │   ├── indicators/[series]/route.ts
│   │       │   └── yields/route.ts
│   │       ├── commodities/
│   │       │   └── prices/route.ts
│   │       ├── news/
│   │       │   ├── top/route.ts
│   │       │   └── company/[symbol]/route.ts
│   │       ├── options/
│   │       │   └── chain/[symbol]/route.ts
│   │       ├── indices/
│   │       │   └── world/route.ts
│   │       └── screener/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/                    # shadcn components
│   │   ├── terminal/
│   │   │   ├── Terminal.tsx
│   │   │   ├── CommandBar.tsx
│   │   │   ├── StatusBar.tsx
│   │   │   ├── PanelManager.tsx
│   │   │   ├── Panel.tsx
│   │   │   └── FunctionRouter.tsx
│   │   ├── functions/
│   │   │   ├── DES.tsx
│   │   │   ├── GP.tsx
│   │   │   ├── FA.tsx
│   │   │   ├── ANR.tsx
│   │   │   ├── DVD.tsx
│   │   │   ├── ERN.tsx
│   │   │   ├── COMP.tsx
│   │   │   ├── RV.tsx
│   │   │   ├── TOP.tsx
│   │   │   ├── WEI.tsx
│   │   │   ├── MOST.tsx
│   │   │   ├── MOV.tsx
│   │   │   ├── WB.tsx
│   │   │   ├── CRVF.tsx
│   │   │   ├── FXCA.tsx
│   │   │   ├── FXMonitor.tsx
│   │   │   ├── CommodityDash.tsx
│   │   │   ├── ECO.tsx
│   │   │   ├── ECST.tsx
│   │   │   ├── CryptoDash.tsx
│   │   │   ├── PORT.tsx
│   │   │   ├── EQS.tsx
│   │   │   ├── OMON.tsx
│   │   │   ├── Heatmap.tsx
│   │   │   ├── Alerts.tsx
│   │   │   ├── IB.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── HELP.tsx
│   │   │   └── Watchlist.tsx
│   │   ├── charts/
│   │   │   ├── CandlestickChart.tsx
│   │   │   ├── LineChart.tsx
│   │   │   ├── AreaChart.tsx
│   │   │   ├── BarChartComponent.tsx
│   │   │   ├── SparklineChart.tsx
│   │   │   ├── YieldCurveChart.tsx
│   │   │   ├── TreemapChart.tsx
│   │   │   └── PieChartComponent.tsx
│   │   └── data-display/
│   │       ├── DataTable.tsx
│   │       ├── KeyValueGrid.tsx
│   │       ├── PriceDisplay.tsx
│   │       ├── MiniQuote.tsx
│   │       └── LoadingState.tsx
│   ├── hooks/
│   │   ├── useWebSocket.ts
│   │   ├── useStockQuote.ts
│   │   ├── useStockProfile.ts
│   │   ├── useCandles.ts
│   │   ├── useFinancials.ts
│   │   ├── usePeers.ts
│   │   ├── useRecommendations.ts
│   │   ├── useEarnings.ts
│   │   ├── useDividends.ts
│   │   ├── useCrypto.ts
│   │   ├── useForex.ts
│   │   ├── useEconomicData.ts
│   │   ├── useCommodities.ts
│   │   ├── useNews.ts
│   │   ├── useOptions.ts
│   │   ├── useIndices.ts
│   │   ├── useScreener.ts
│   │   ├── useAlerts.ts
│   │   ├── usePortfolio.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── store/
│   │   ├── terminalStore.ts
│   │   ├── securityStore.ts
│   │   ├── watchlistStore.ts
│   │   ├── portfolioStore.ts
│   │   ├── alertStore.ts
│   │   ├── settingsStore.ts
│   │   └── chatStore.ts
│   ├── lib/
│   │   ├── api/
│   │   │   ├── finnhub.ts
│   │   │   ├── coingecko.ts
│   │   │   ├── fred.ts
│   │   │   ├── exchangerate.ts
│   │   │   ├── fmp.ts
│   │   │   └── alphavantage.ts
│   │   ├── commands.ts
│   │   ├── indicators.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   ├── rateLimit.ts
│   │   └── utils.ts
│   └── providers/
│       ├── QueryProvider.tsx
│       └── WebSocketProvider.tsx
```

---

## Dependencies

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "zustand": "^5",
    "@tanstack/react-query": "^5",
    "lightweight-charts": "^4",
    "recharts": "^2",
    "numeral": "^2",
    "date-fns": "^4",
    "clsx": "^2",
    "tailwind-merge": "^2",
    "sonner": "^1",
    "lucide-react": "^0.460",
    "class-variance-authority": "^0.7",
    "@radix-ui/react-dialog": "^1",
    "@radix-ui/react-tabs": "^1",
    "@radix-ui/react-select": "^2",
    "@radix-ui/react-popover": "^1",
    "@radix-ui/react-scroll-area": "^1",
    "@radix-ui/react-switch": "^1",
    "@radix-ui/react-slider": "^1",
    "@radix-ui/react-separator": "^1",
    "@radix-ui/react-slot": "^1"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/numeral": "^2",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "postcss": "^8",
    "eslint": "^9",
    "eslint-config-next": "^15",
    "@types/node": "^22"
  }
}
```

---

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bb-black` | `#000000` | Main background |
| `--bb-dark` | `#0a0a0a` | Panel backgrounds |
| `--bb-panel` | `#111111` | Elevated panel bg |
| `--bb-panel-alt` | `#1a1a1a` | Alternating row bg |
| `--bb-border` | `#333333` | Borders, dividers |
| `--bb-amber` | `#ff8c00` | Primary accent, headers, active elements |
| `--bb-amber-dim` | `#cc7000` | Dimmed amber |
| `--bb-white` | `#e0e0e0` | Primary text |
| `--bb-muted` | `#888888` | Secondary text, timestamps |
| `--bb-green` | `#00d26a` | Positive change |
| `--bb-red` | `#ff3b3b` | Negative change |
| `--bb-blue` | `#4da6ff` | Links, info |
| `--bb-cyan` | `#00bcd4` | Source labels, usernames |
| `--bb-yellow` | `#ffd700` | Warnings, highlights |

### Typography

- **Font:** JetBrains Mono everywhere
- **Base size:** 12px (data-dense)
- **Heading in panels:** 13px bold, uppercase, amber
- **Data cells:** 12px regular, white
- **Muted/secondary:** 11px, muted gray
- **Price displays:** 16-20px bold for large callouts

### Spacing

- **Panel padding:** 8px
- **Cell padding:** 4px 8px
- **Row height:** 24px for data tables
- **Gap between sections:** 8px
- **Border:** 1px solid var(--bb-border)

### Component Styles

**Bloomberg Button (bb-btn):**
```css
.bb-btn {
  background: #1a1a1a;
  color: #e0e0e0;
  border: 1px solid #333;
  padding: 2px 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  cursor: pointer;
  text-transform: uppercase;
}
.bb-btn:hover { background: #333; }
.bb-btn-active { background: #ff8c00; color: #000; border-color: #ff8c00; }
```

**Bloomberg Input (bb-input):**
```css
.bb-input {
  background: #0a0a0a;
  color: #ff8c00;
  border: 1px solid #333;
  padding: 4px 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  caret-color: #ff8c00;
}
.bb-input:focus { border-color: #ff8c00; outline: none; }
```

**Bloomberg Table:**
```css
.bb-table { width: 100%; border-collapse: collapse; }
.bb-table th {
  background: #1a1a1a;
  color: #ff8c00;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: bold;
  padding: 4px 8px;
  text-align: left;
  border-bottom: 1px solid #333;
}
.bb-table td {
  padding: 3px 8px;
  font-size: 12px;
  border-bottom: 1px solid #1a1a1a;
  color: #e0e0e0;
}
.bb-table tr:nth-child(even) { background: #0a0a0a; }
.bb-table tr:hover { background: #1a1a1a; }
```

**Price Flash Animation:**
```css
@keyframes flash-green { 0% { background: rgba(0,210,106,0.3); } 100% { background: transparent; } }
@keyframes flash-red { 0% { background: rgba(255,59,59,0.3); } 100% { background: transparent; } }
.bb-flash-green { animation: flash-green 0.5s ease-out; }
.bb-flash-red { animation: flash-red 0.5s ease-out; }
```

---

## Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bloomberg: {
          black: "#000000",
          dark: "#0a0a0a",
          panel: "#111111",
          "panel-alt": "#1a1a1a",
          border: "#333333",
          amber: "#ff8c00",
          "amber-dim": "#cc7000",
          white: "#e0e0e0",
          muted: "#888888",
          green: "#00d26a",
          red: "#ff3b3b",
          blue: "#4da6ff",
          cyan: "#00bcd4",
          yellow: "#ffd700",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xxs: ["10px", "14px"],
        xs: ["11px", "16px"],
        sm: ["12px", "18px"],
        base: ["13px", "20px"],
        lg: ["16px", "24px"],
        xl: ["20px", "28px"],
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## globals.css

```css
@import "tailwindcss";

@font-face {
  font-family: "JetBrains Mono";
  src: url("/fonts/JetBrainsMono-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "JetBrains Mono";
  src: url("/fonts/JetBrainsMono-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "JetBrains Mono";
  src: url("/fonts/JetBrainsMono-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

:root {
  --bb-black: #000000;
  --bb-dark: #0a0a0a;
  --bb-panel: #111111;
  --bb-panel-alt: #1a1a1a;
  --bb-border: #333333;
  --bb-amber: #ff8c00;
  --bb-amber-dim: #cc7000;
  --bb-white: #e0e0e0;
  --bb-muted: #888888;
  --bb-green: #00d26a;
  --bb-red: #ff3b3b;
  --bb-blue: #4da6ff;
  --bb-cyan: #00bcd4;
  --bb-yellow: #ffd700;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  background: var(--bb-black);
  color: var(--bb-white);
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  overflow: hidden;
  user-select: none;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar styling */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bb-black); }
::-webkit-scrollbar-thumb { background: var(--bb-border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--bb-muted); }

/* Bloomberg component classes */
.bb-btn {
  background: var(--bb-panel-alt);
  color: var(--bb-white);
  border: 1px solid var(--bb-border);
  padding: 2px 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  cursor: pointer;
  text-transform: uppercase;
  transition: background 0.1s;
}
.bb-btn:hover { background: var(--bb-border); }
.bb-btn-active {
  background: var(--bb-amber) !important;
  color: var(--bb-black) !important;
  border-color: var(--bb-amber) !important;
  font-weight: 700;
}

.bb-input {
  background: var(--bb-dark);
  color: var(--bb-amber);
  border: 1px solid var(--bb-border);
  padding: 4px 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  caret-color: var(--bb-amber);
  outline: none;
  width: 100%;
}
.bb-input:focus { border-color: var(--bb-amber); }
.bb-input::placeholder { color: var(--bb-muted); }

.bb-table { width: 100%; border-collapse: collapse; }
.bb-table th {
  background: var(--bb-panel-alt);
  color: var(--bb-amber);
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  text-align: left;
  border-bottom: 1px solid var(--bb-border);
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
}
.bb-table td {
  padding: 3px 8px;
  font-size: 12px;
  border-bottom: 1px solid rgba(51,51,51,0.5);
  color: var(--bb-white);
  white-space: nowrap;
}
.bb-table tr:nth-child(even) { background: rgba(10,10,10,0.5); }
.bb-table tr:hover { background: var(--bb-panel-alt); }
.bb-table .num { text-align: right; font-variant-numeric: tabular-nums; }
.bb-table .positive { color: var(--bb-green); }
.bb-table .negative { color: var(--bb-red); }

.bb-section-header {
  color: var(--bb-amber);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 8px;
  background: var(--bb-panel-alt);
  border-bottom: 1px solid var(--bb-border);
}

@keyframes flash-green { 0% { background: rgba(0,210,106,0.3); } 100% { background: transparent; } }
@keyframes flash-red { 0% { background: rgba(255,59,59,0.3); } 100% { background: transparent; } }
.bb-flash-green { animation: flash-green 0.5s ease-out; }
.bb-flash-red { animation: flash-red 0.5s ease-out; }

@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
.bb-blink { animation: blink 1s step-end infinite; }

@keyframes loading-dots {
  0% { content: "."; }
  33% { content: ".."; }
  66% { content: "..."; }
}
```

---

## TypeScript Types (src/lib/types.ts)

```typescript
// ==================== Security Types ====================

export type SecurityType = "equity" | "crypto" | "forex" | "commodity" | "index" | "bond";

export interface Security {
  symbol: string;         // e.g., "AAPL", "BTC", "EUR/USD"
  name: string;           // e.g., "Apple Inc"
  type: SecurityType;
  exchange?: string;      // e.g., "NASDAQ"
  currency?: string;      // e.g., "USD"
}

// ==================== Stock Data Types ====================

export interface StockQuote {
  symbol: string;
  price: number;          // Current price (c)
  change: number;         // Change (d)
  changePercent: number;  // Change percent (dp)
  high: number;           // Day high (h)
  low: number;            // Day low (l)
  open: number;           // Day open (o)
  prevClose: number;      // Previous close (pc)
  timestamp: number;      // Unix timestamp (t)
}

export interface StockProfile {
  symbol: string;
  name: string;
  exchange: string;
  industry: string;
  sector: string;
  marketCap: number;
  description: string;
  website: string;
  logo: string;
  country: string;
  ipo: string;
  phone: string;
  employees: number;
  ceo: string;
}

export interface CandleData {
  time: number;    // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FinancialStatement {
  date: string;
  period: string;       // "FY" or "Q1", "Q2", etc.
  [key: string]: string | number;  // Dynamic financial line items
}

export interface KeyMetrics {
  symbol: string;
  date: string;
  peRatio: number;
  pbRatio: number;
  evToEbitda: number;
  debtToEquity: number;
  currentRatio: number;
  roe: number;
  roa: number;
  dividendYield: number;
  revenuePerShare: number;
  netIncomePerShare: number;
  freeCashFlowPerShare: number;
  bookValuePerShare: number;
  enterpriseValue: number;
  [key: string]: string | number;
}

export interface EarningsData {
  date: string;
  epsActual: number | null;
  epsEstimate: number | null;
  epsSurprise: number | null;
  epsSurprisePercent: number | null;
  revenueActual: number | null;
  revenueEstimate: number | null;
  quarter: number;
  year: number;
}

export interface DividendData {
  exDate: string;
  payDate: string;
  recordDate: string;
  amount: number;
  adjustedAmount: number;
  currency: string;
}

export interface RecommendationData {
  period: string;
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
}

export interface PriceTarget {
  targetHigh: number;
  targetLow: number;
  targetMean: number;
  targetMedian: number;
  lastUpdated: string;
}

export interface CompanyExecutive {
  name: string;
  position: string;
  age: number | null;
  yearBorn: number | null;
  compensation: number | null;
}

// ==================== Crypto Types ====================

export interface CryptoAsset {
  id: string;            // CoinGecko ID, e.g., "bitcoin"
  symbol: string;        // e.g., "btc"
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  totalVolume: number;
  priceChangePercentage24h: number;
  priceChangePercentage7d: number;
  sparklineIn7d: number[];
  high24h: number;
  low24h: number;
  circulatingSupply: number;
  totalSupply: number | null;
}

export interface CryptoGlobalData {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  ethDominance: number;
  activeCryptocurrencies: number;
  marketCapChangePercentage24h: number;
}

// ==================== Forex Types ====================

export interface ForexRate {
  pair: string;         // e.g., "EUR/USD"
  rate: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  timestamp: number;
}

export interface ForexConversion {
  from: string;
  to: string;
  rate: number;
  amount: number;
  result: number;
  timestamp: string;
}

// ==================== Economic Types ====================

export interface EconomicIndicator {
  seriesId: string;
  title: string;
  value: number;
  date: string;
  previousValue: number;
  unit: string;
  frequency: string;
}

export interface EconomicEvent {
  date: string;
  time: string;
  country: string;
  event: string;
  importance: 1 | 2 | 3;   // 1=low, 2=medium, 3=high
  actual: number | null;
  estimate: number | null;
  previous: number | null;
  unit: string;
}

export interface YieldCurvePoint {
  maturity: string;      // e.g., "1M", "3M", "1Y", "10Y"
  yield: number;
  change: number;
  previousYield: number;
}

// ==================== Commodity Types ====================

export interface CommodityPrice {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;         // e.g., "USD/bbl", "USD/oz"
  category: "energy" | "precious_metals" | "industrial_metals" | "agriculture";
}

// ==================== News Types ====================

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number;      // Unix timestamp
  category: string;
  related: string;       // Related ticker
}

// ==================== Options Types ====================

export interface OptionContract {
  contractSymbol: string;
  strike: number;
  expiration: string;
  type: "call" | "put";
  lastPrice: number;
  change: number;
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  delta: number | null;
  gamma: number | null;
  theta: number | null;
  vega: number | null;
  inTheMoney: boolean;
}

export interface OptionsChain {
  symbol: string;
  expirationDates: string[];
  selectedExpiration: string;
  calls: OptionContract[];
  puts: OptionContract[];
  underlyingPrice: number;
}

// ==================== Portfolio Types ====================

export interface Position {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  type: SecurityType;
}

export interface Portfolio {
  id: string;
  name: string;
  positions: Position[];
  createdAt: string;
}

export interface PortfolioPerformance {
  totalValue: number;
  totalCost: number;
  dayPnL: number;
  dayPnLPercent: number;
  totalPnL: number;
  totalPnLPercent: number;
  positions: (Position & {
    currentPrice: number;
    marketValue: number;
    pnl: number;
    pnlPercent: number;
    dayChange: number;
    dayChangePercent: number;
    weight: number;
  })[];
}

// ==================== Alert Types ====================

export type AlertCondition = "above" | "below" | "pct_change_above" | "pct_change_below" | "volume_above";

export interface Alert {
  id: string;
  symbol: string;
  condition: AlertCondition;
  value: number;
  enabled: boolean;
  triggered: boolean;
  triggeredAt: string | null;
  createdAt: string;
}

// ==================== Terminal/Panel Types ====================

export type LayoutMode = "quad" | "single" | "dual-horizontal" | "dual-vertical" | "triple-left" | "triple-right";

export type FunctionCode =
  | "DES" | "GP" | "FA" | "ANR" | "DVD" | "ERN" | "COMP" | "RV"
  | "TOP" | "WEI" | "MOST" | "MOV"
  | "WB" | "CRVF"
  | "FXCA" | "FXMON"
  | "CMDTY"
  | "ECO" | "ECST"
  | "CRYPTO"
  | "PORT"
  | "EQS"
  | "OMON"
  | "HMAP"
  | "ALRT"
  | "IB"
  | "SET"
  | "HELP"
  | "WATC";

export interface PanelTab {
  id: string;
  functionCode: FunctionCode;
  security: Security | null;
  title: string;
}

export interface PanelState {
  id: string;
  group: "A" | "B" | "C" | "D";   // Security linking group
  tabs: PanelTab[];
  activeTabId: string;
}

export interface CommandSuggestion {
  code: string;
  name: string;
  description: string;
  requiresSecurity: boolean;
  category: string;
}

// ==================== Chat Types ====================

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: "user" | "system" | "received";
}

// ==================== Screener Types ====================

export interface ScreenerFilters {
  marketCapMoreThan?: number;
  marketCapLowerThan?: number;
  priceMoreThan?: number;
  priceLowerThan?: number;
  betaMoreThan?: number;
  betaLowerThan?: number;
  volumeMoreThan?: number;
  dividendMoreThan?: number;
  sector?: string;
  exchange?: string;
  country?: string;
  limit?: number;
}

export interface ScreenerResult {
  symbol: string;
  companyName: string;
  marketCap: number;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  beta: number;
  lastAnnualDividend: number;
  exchange: string;
  country: string;
}

// ==================== Index Proxy Types ====================

export interface IndexProxy {
  etf: string;
  name: string;
  region: "americas" | "emea" | "apac";
}
```

---

## Constants (src/lib/constants.ts)

```typescript
import type { CommandSuggestion, IndexProxy, FunctionCode } from "./types";

// ==================== Command Registry ====================

export const FUNCTION_REGISTRY: CommandSuggestion[] = [
  // Security-specific functions
  { code: "DES", name: "Description", description: "Company overview and key data", requiresSecurity: true, category: "Equity" },
  { code: "GP", name: "Price Graph", description: "Interactive price chart with technicals", requiresSecurity: true, category: "Equity" },
  { code: "FA", name: "Financial Analysis", description: "Income statement, balance sheet, cash flow", requiresSecurity: true, category: "Equity" },
  { code: "ANR", name: "Analyst Recommendations", description: "Consensus ratings and price targets", requiresSecurity: true, category: "Equity" },
  { code: "DVD", name: "Dividends", description: "Dividend history and yield analysis", requiresSecurity: true, category: "Equity" },
  { code: "ERN", name: "Earnings", description: "Earnings history, estimates, surprises", requiresSecurity: true, category: "Equity" },
  { code: "COMP", name: "Comparable Companies", description: "Peer comparison table", requiresSecurity: true, category: "Equity" },
  { code: "RV", name: "Relative Valuation", description: "Valuation multiples vs peers", requiresSecurity: true, category: "Equity" },
  { code: "OMON", name: "Options Monitor", description: "Options chain with Greeks", requiresSecurity: true, category: "Derivatives" },
  { code: "MOV", name: "Price Movement", description: "Historical price movement analysis", requiresSecurity: true, category: "Equity" },

  // Market-wide functions (no security required)
  { code: "TOP", name: "Top News", description: "Top market news headlines", requiresSecurity: false, category: "News" },
  { code: "WEI", name: "World Equity Indices", description: "Global stock indices overview", requiresSecurity: false, category: "Markets" },
  { code: "MOST", name: "Most Active / Movers", description: "Top gainers, losers, most active", requiresSecurity: false, category: "Markets" },
  { code: "WB", name: "World Bonds", description: "Government bond yields and curves", requiresSecurity: false, category: "Fixed Income" },
  { code: "CRVF", name: "Yield Curves", description: "Interactive yield curve visualization", requiresSecurity: false, category: "Fixed Income" },
  { code: "FXCA", name: "FX Calculator", description: "Currency conversion and cross rates", requiresSecurity: false, category: "Forex" },
  { code: "FXMON", name: "FX Monitor", description: "Major currency pairs monitor", requiresSecurity: false, category: "Forex" },
  { code: "CMDTY", name: "Commodities", description: "Commodity prices dashboard", requiresSecurity: false, category: "Commodities" },
  { code: "ECO", name: "Economic Calendar", description: "Upcoming economic data releases", requiresSecurity: false, category: "Economics" },
  { code: "ECST", name: "Economic Statistics", description: "Key economic indicators with charts", requiresSecurity: false, category: "Economics" },
  { code: "CRYPTO", name: "Crypto Dashboard", description: "Cryptocurrency prices and market data", requiresSecurity: false, category: "Crypto" },
  { code: "PORT", name: "Portfolio Manager", description: "Track and manage portfolios", requiresSecurity: false, category: "Portfolio" },
  { code: "EQS", name: "Equity Screener", description: "Screen stocks by fundamentals", requiresSecurity: false, category: "Screening" },
  { code: "HMAP", name: "Market Heatmap", description: "Sector and stock heatmap", requiresSecurity: false, category: "Markets" },
  { code: "ALRT", name: "Alerts", description: "Price and volume alerts", requiresSecurity: false, category: "Tools" },
  { code: "IB", name: "Instant Bloomberg", description: "Messaging system", requiresSecurity: false, category: "Communication" },
  { code: "WATC", name: "Watchlist", description: "Security watchlists with live prices", requiresSecurity: false, category: "Tools" },
  { code: "SET", name: "Settings", description: "Terminal settings and API keys", requiresSecurity: false, category: "System" },
  { code: "HELP", name: "Help", description: "Function reference and shortcuts", requiresSecurity: false, category: "System" },
];

// ==================== Index Proxies ====================

export const INDEX_PROXIES: IndexProxy[] = [
  { etf: "SPY", name: "S&P 500", region: "americas" },
  { etf: "QQQ", name: "NASDAQ 100", region: "americas" },
  { etf: "DIA", name: "Dow Jones", region: "americas" },
  { etf: "IWM", name: "Russell 2000", region: "americas" },
  { etf: "EWZ", name: "Brazil Bovespa", region: "americas" },
  { etf: "EWW", name: "Mexico IPC", region: "americas" },
  { etf: "EWC", name: "Canada TSX", region: "americas" },
  { etf: "EWU", name: "UK FTSE 100", region: "emea" },
  { etf: "EWG", name: "Germany DAX", region: "emea" },
  { etf: "EWQ", name: "France CAC 40", region: "emea" },
  { etf: "EWI", name: "Italy FTSE MIB", region: "emea" },
  { etf: "EWP", name: "Spain IBEX 35", region: "emea" },
  { etf: "EWL", name: "Switzerland SMI", region: "emea" },
  { etf: "EZA", name: "South Africa", region: "emea" },
  { etf: "EWJ", name: "Japan Nikkei", region: "apac" },
  { etf: "FXI", name: "China", region: "apac" },
  { etf: "EWY", name: "South Korea", region: "apac" },
  { etf: "EWA", name: "Australia ASX", region: "apac" },
  { etf: "INDA", name: "India Nifty", region: "apac" },
  { etf: "EWT", name: "Taiwan", region: "apac" },
  { etf: "EWH", name: "Hong Kong", region: "apac" },
  { etf: "EWS", name: "Singapore", region: "apac" },
];

// ==================== FRED Series IDs ====================

export const TREASURY_SERIES: Record<string, string> = {
  "1M": "DGS1MO",
  "3M": "DGS3MO",
  "6M": "DGS6MO",
  "1Y": "DGS1",
  "2Y": "DGS2",
  "3Y": "DGS3",
  "5Y": "DGS5",
  "7Y": "DGS7",
  "10Y": "DGS10",
  "20Y": "DGS20",
  "30Y": "DGS30",
};

export const ECONOMIC_INDICATORS: Record<string, { seriesId: string; name: string; unit: string }> = {
  gdp: { seriesId: "A191RL1Q225SBEA", name: "GDP Growth Rate", unit: "%" },
  cpi: { seriesId: "CPIAUCSL", name: "CPI (All Items)", unit: "Index" },
  coreCpi: { seriesId: "CPILFESL", name: "Core CPI", unit: "Index" },
  unemployment: { seriesId: "UNRATE", name: "Unemployment Rate", unit: "%" },
  fedFunds: { seriesId: "FEDFUNDS", name: "Fed Funds Rate", unit: "%" },
  payrolls: { seriesId: "PAYEMS", name: "Nonfarm Payrolls", unit: "Thousands" },
  sentiment: { seriesId: "UMCSENT", name: "Consumer Sentiment", unit: "Index" },
  industrial: { seriesId: "INDPRO", name: "Industrial Production", unit: "Index" },
  retail: { seriesId: "RSAFS", name: "Retail Sales", unit: "Millions $" },
  housing: { seriesId: "HOUST", name: "Housing Starts", unit: "Thousands" },
  pce: { seriesId: "PCEPI", name: "PCE Price Index", unit: "Index" },
  claims: { seriesId: "ICSA", name: "Initial Jobless Claims", unit: "Claims" },
};

// ==================== FX Pairs ====================

export const MAJOR_FX_PAIRS = [
  "EUR/USD", "USD/JPY", "GBP/USD", "USD/CHF",
  "AUD/USD", "USD/CAD", "NZD/USD",
  "EUR/GBP", "EUR/JPY", "GBP/JPY",
];

export const FX_CURRENCIES = [
  "USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NZD",
  "CNY", "HKD", "SGD", "SEK", "NOK", "DKK", "INR", "BRL",
  "KRW", "ZAR", "MXN", "TRY", "PLN", "THB", "IDR", "MYR",
];

// ==================== Sectors ====================

export const SECTORS = [
  "Technology", "Healthcare", "Financial Services", "Consumer Cyclical",
  "Communication Services", "Industrials", "Consumer Defensive",
  "Energy", "Basic Materials", "Real Estate", "Utilities",
];

// ==================== Market Hours ====================

export const MARKET_HOURS = {
  nyse: { open: "09:30", close: "16:00", timezone: "America/New_York" },
  nasdaq: { open: "09:30", close: "16:00", timezone: "America/New_York" },
  preMarket: { open: "04:00", close: "09:30", timezone: "America/New_York" },
  afterHours: { open: "16:00", close: "20:00", timezone: "America/New_York" },
};

// ==================== Timeframe Mappings ====================

export const TIMEFRAME_CONFIG: Record<string, { resolution: string; daysBack: number; label: string }> = {
  "1D": { resolution: "5", daysBack: 1, label: "1 Day" },
  "5D": { resolution: "15", daysBack: 5, label: "5 Days" },
  "1M": { resolution: "60", daysBack: 30, label: "1 Month" },
  "3M": { resolution: "D", daysBack: 90, label: "3 Months" },
  "6M": { resolution: "D", daysBack: 180, label: "6 Months" },
  "YTD": { resolution: "D", daysBack: 0, label: "Year to Date" },
  "1Y": { resolution: "D", daysBack: 365, label: "1 Year" },
  "5Y": { resolution: "W", daysBack: 1825, label: "5 Years" },
  "MAX": { resolution: "M", daysBack: 7300, label: "Max" },
};

// ==================== Default Watchlist ====================

export const DEFAULT_WATCHLIST_SYMBOLS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA",
  "BRK.B", "JPM", "V", "UNH", "XOM", "JNJ", "WMT", "PG",
];
```

---

## Zustand Stores

### terminalStore.ts

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PanelState, PanelTab, FunctionCode, LayoutMode, Security } from "@/lib/types";
import { nanoid } from "@/lib/utils";

interface TerminalState {
  // Layout
  layout: LayoutMode;
  setLayout: (layout: LayoutMode) => void;

  // Panels
  panels: PanelState[];
  activePanelId: string;
  fullscreenPanelId: string | null;
  setActivePanelId: (id: string) => void;
  setFullscreenPanel: (id: string | null) => void;

  // Panel tab management
  addTab: (panelId: string, functionCode: FunctionCode, security: Security | null) => void;
  closeTab: (panelId: string, tabId: string) => void;
  setActiveTab: (panelId: string, tabId: string) => void;
  navigateToFunction: (panelId: string, functionCode: FunctionCode, security: Security | null) => void;

  // Command bar
  commandBarFocused: boolean;
  setCommandFocused: (focused: boolean) => void;
  commandHistory: string[];
  addCommandToHistory: (cmd: string) => void;
}

function createDefaultPanels(): PanelState[] {
  const groups: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];
  return groups.map((group) => {
    const tabId = nanoid();
    return {
      id: nanoid(),
      group,
      tabs: [{ id: tabId, functionCode: "TOP" as FunctionCode, security: null, title: "TOP" }],
      activeTabId: tabId,
    };
  });
}

export const useTerminalStore = create<TerminalState>()(
  persist(
    (set, get) => ({
      layout: "quad",
      setLayout: (layout) => set({ layout }),

      panels: createDefaultPanels(),
      activePanelId: "",  // Set on mount
      fullscreenPanelId: null,
      setActivePanelId: (id) => set({ activePanelId: id }),
      setFullscreenPanel: (id) => set({ fullscreenPanelId: id }),

      addTab: (panelId, functionCode, security) => {
        const tabId = nanoid();
        const title = security ? `${security.symbol} ${functionCode}` : functionCode;
        set((state) => ({
          panels: state.panels.map((p) =>
            p.id === panelId
              ? {
                  ...p,
                  tabs: [...p.tabs, { id: tabId, functionCode, security, title }],
                  activeTabId: tabId,
                }
              : p
          ),
        }));
      },

      closeTab: (panelId, tabId) => {
        set((state) => ({
          panels: state.panels.map((p) => {
            if (p.id !== panelId) return p;
            const newTabs = p.tabs.filter((t) => t.id !== tabId);
            if (newTabs.length === 0) {
              // Don't close last tab; reset to TOP
              const newTabId = nanoid();
              return {
                ...p,
                tabs: [{ id: newTabId, functionCode: "TOP" as FunctionCode, security: null, title: "TOP" }],
                activeTabId: newTabId,
              };
            }
            return {
              ...p,
              tabs: newTabs,
              activeTabId: p.activeTabId === tabId ? newTabs[newTabs.length - 1].id : p.activeTabId,
            };
          }),
        }));
      },

      setActiveTab: (panelId, tabId) => {
        set((state) => ({
          panels: state.panels.map((p) =>
            p.id === panelId ? { ...p, activeTabId: tabId } : p
          ),
        }));
      },

      navigateToFunction: (panelId, functionCode, security) => {
        set((state) => ({
          panels: state.panels.map((p) => {
            if (p.id !== panelId) return p;
            const activeTab = p.tabs.find((t) => t.id === p.activeTabId);
            if (!activeTab) return p;
            const title = security ? `${security.symbol} ${functionCode}` : functionCode;
            return {
              ...p,
              tabs: p.tabs.map((t) =>
                t.id === p.activeTabId ? { ...t, functionCode, security, title } : t
              ),
            };
          }),
        }));
      },

      commandBarFocused: false,
      setCommandFocused: (focused) => set({ commandBarFocused: focused }),
      commandHistory: [],
      addCommandToHistory: (cmd) => {
        set((state) => ({
          commandHistory: [cmd, ...state.commandHistory.filter((c) => c !== cmd)].slice(0, 50),
        }));
      },
    }),
    { name: "bloomberg-terminal", partialize: (state) => ({ layout: state.layout, commandHistory: state.commandHistory }) }
  )
);
```

### securityStore.ts

```typescript
import { create } from "zustand";
import type { Security, StockQuote } from "@/lib/types";

interface SecurityState {
  // Active securities per group
  groupSecurities: Record<string, Security | null>;  // "A" -> Security
  setGroupSecurity: (group: string, security: Security | null) => void;

  // Live quote cache (updated by WebSocket and polling)
  quotes: Record<string, StockQuote>;
  updateQuote: (symbol: string, quote: StockQuote) => void;
  updateQuotePrice: (symbol: string, price: number, timestamp: number) => void;
}

export const useSecurityStore = create<SecurityState>()((set) => ({
  groupSecurities: { A: null, B: null, C: null, D: null },
  setGroupSecurity: (group, security) =>
    set((state) => ({
      groupSecurities: { ...state.groupSecurities, [group]: security },
    })),

  quotes: {},
  updateQuote: (symbol, quote) =>
    set((state) => ({
      quotes: { ...state.quotes, [symbol]: quote },
    })),
  updateQuotePrice: (symbol, price, timestamp) =>
    set((state) => {
      const existing = state.quotes[symbol];
      if (!existing) return state;
      return {
        quotes: {
          ...state.quotes,
          [symbol]: {
            ...existing,
            price,
            change: price - existing.prevClose,
            changePercent: ((price - existing.prevClose) / existing.prevClose) * 100,
            timestamp,
          },
        },
      };
    }),
}));
```

### watchlistStore.ts

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "@/lib/utils";
import { DEFAULT_WATCHLIST_SYMBOLS } from "@/lib/constants";

interface Watchlist {
  id: string;
  name: string;
  symbols: string[];
}

interface WatchlistState {
  watchlists: Watchlist[];
  activeWatchlistId: string;
  createWatchlist: (name: string) => void;
  deleteWatchlist: (id: string) => void;
  setActiveWatchlist: (id: string) => void;
  addSymbol: (watchlistId: string, symbol: string) => void;
  removeSymbol: (watchlistId: string, symbol: string) => void;
  reorderSymbols: (watchlistId: string, symbols: string[]) => void;
}

const defaultWatchlist: Watchlist = {
  id: "default",
  name: "My Watchlist",
  symbols: DEFAULT_WATCHLIST_SYMBOLS,
};

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      watchlists: [defaultWatchlist],
      activeWatchlistId: "default",
      createWatchlist: (name) => {
        const id = nanoid();
        set((state) => ({
          watchlists: [...state.watchlists, { id, name, symbols: [] }],
          activeWatchlistId: id,
        }));
      },
      deleteWatchlist: (id) =>
        set((state) => ({
          watchlists: state.watchlists.filter((w) => w.id !== id),
          activeWatchlistId: state.activeWatchlistId === id ? state.watchlists[0]?.id ?? "" : state.activeWatchlistId,
        })),
      setActiveWatchlist: (id) => set({ activeWatchlistId: id }),
      addSymbol: (watchlistId, symbol) =>
        set((state) => ({
          watchlists: state.watchlists.map((w) =>
            w.id === watchlistId && !w.symbols.includes(symbol.toUpperCase())
              ? { ...w, symbols: [...w.symbols, symbol.toUpperCase()] }
              : w
          ),
        })),
      removeSymbol: (watchlistId, symbol) =>
        set((state) => ({
          watchlists: state.watchlists.map((w) =>
            w.id === watchlistId
              ? { ...w, symbols: w.symbols.filter((s) => s !== symbol) }
              : w
          ),
        })),
      reorderSymbols: (watchlistId, symbols) =>
        set((state) => ({
          watchlists: state.watchlists.map((w) =>
            w.id === watchlistId ? { ...w, symbols } : w
          ),
        })),
    }),
    { name: "bloomberg-watchlists" }
  )
);
```

### portfolioStore.ts

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "@/lib/utils";
import type { Portfolio, Position } from "@/lib/types";

interface PortfolioState {
  portfolios: Portfolio[];
  activePortfolioId: string;
  createPortfolio: (name: string) => void;
  deletePortfolio: (id: string) => void;
  setActivePortfolio: (id: string) => void;
  addPosition: (portfolioId: string, position: Omit<Position, "id">) => void;
  removePosition: (portfolioId: string, positionId: string) => void;
  updatePosition: (portfolioId: string, positionId: string, updates: Partial<Position>) => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      portfolios: [{ id: "default", name: "My Portfolio", positions: [], createdAt: new Date().toISOString() }],
      activePortfolioId: "default",
      createPortfolio: (name) => {
        const id = nanoid();
        set((state) => ({
          portfolios: [...state.portfolios, { id, name, positions: [], createdAt: new Date().toISOString() }],
          activePortfolioId: id,
        }));
      },
      deletePortfolio: (id) =>
        set((state) => ({
          portfolios: state.portfolios.filter((p) => p.id !== id),
          activePortfolioId: state.activePortfolioId === id ? state.portfolios[0]?.id ?? "" : state.activePortfolioId,
        })),
      setActivePortfolio: (id) => set({ activePortfolioId: id }),
      addPosition: (portfolioId, position) =>
        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === portfolioId
              ? { ...p, positions: [...p.positions, { ...position, id: nanoid() }] }
              : p
          ),
        })),
      removePosition: (portfolioId, positionId) =>
        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === portfolioId
              ? { ...p, positions: p.positions.filter((pos) => pos.id !== positionId) }
              : p
          ),
        })),
      updatePosition: (portfolioId, positionId, updates) =>
        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === portfolioId
              ? { ...p, positions: p.positions.map((pos) => (pos.id === positionId ? { ...pos, ...updates } : pos)) }
              : p
          ),
        })),
    }),
    { name: "bloomberg-portfolios" }
  )
);
```

### alertStore.ts

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "@/lib/utils";
import type { Alert, AlertCondition } from "@/lib/types";

interface AlertState {
  alerts: Alert[];
  createAlert: (symbol: string, condition: AlertCondition, value: number) => void;
  deleteAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  triggerAlert: (id: string) => void;
  clearTriggered: () => void;
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set) => ({
      alerts: [],
      createAlert: (symbol, condition, value) =>
        set((state) => ({
          alerts: [
            ...state.alerts,
            {
              id: nanoid(),
              symbol: symbol.toUpperCase(),
              condition,
              value,
              enabled: true,
              triggered: false,
              triggeredAt: null,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      deleteAlert: (id) => set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
      toggleAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
        })),
      triggerAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id ? { ...a, triggered: true, triggeredAt: new Date().toISOString(), enabled: false } : a
          ),
        })),
      clearTriggered: () =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.triggered ? { ...a, triggered: false } : a)),
        })),
    }),
    { name: "bloomberg-alerts" }
  )
);
```

### settingsStore.ts

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  // API keys (stored locally only)
  finnhubKey: string;
  fmpKey: string;
  alphaVantageKey: string;
  fredKey: string;
  setApiKey: (key: string, value: string) => void;

  // Display
  refreshInterval: number;       // seconds
  flashPrices: boolean;
  compactMode: boolean;
  soundEnabled: boolean;
  setRefreshInterval: (interval: number) => void;
  setFlashPrices: (enabled: boolean) => void;
  setCompactMode: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      finnhubKey: "",
      fmpKey: "",
      alphaVantageKey: "",
      fredKey: "",
      setApiKey: (key, value) => set({ [key]: value }),

      refreshInterval: 15,
      flashPrices: true,
      compactMode: false,
      soundEnabled: true,
      setRefreshInterval: (interval) => set({ refreshInterval: interval }),
      setFlashPrices: (enabled) => set({ flashPrices: enabled }),
      setCompactMode: (enabled) => set({ compactMode: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
    }),
    { name: "bloomberg-settings" }
  )
);
```

### chatStore.ts

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

interface ChatState {
  messages: ChatMessage[];
  addMessage: (content: string, sender: string, type: ChatMessage["type"]) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [
        {
          id: "welcome",
          sender: "SYSTEM",
          content: "Welcome to IB (Instant Bloomberg). This is a simulated messaging environment for demonstration purposes.",
          timestamp: new Date().toISOString(),
          type: "system",
        },
      ],
      addMessage: (content, sender, type) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { id: nanoid(), sender, content, timestamp: new Date().toISOString(), type },
          ],
        })),
      clearMessages: () =>
        set({
          messages: [
            {
              id: "welcome",
              sender: "SYSTEM",
              content: "Chat history cleared.",
              timestamp: new Date().toISOString(),
              type: "system",
            },
          ],
        }),
    }),
    { name: "bloomberg-chat" }
  )
);
```

---

## API Clients (src/lib/api/)

### finnhub.ts

```typescript
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

export async function getForexRates(exchange: string = "oanda") {
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
```

### coingecko.ts

```typescript
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
```

### fred.ts

```typescript
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
  // Fetch latest observation for each series in parallel
  const results = await Promise.all(
    seriesIds.map((id) => getSeriesObservations(id, limit, "desc"))
  );
  return seriesIds.reduce((acc, id, i) => {
    acc[id] = results[i];
    return acc;
  }, {} as Record<string, any>);
}
```

### exchangerate.ts

```typescript
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
```

### fmp.ts

```typescript
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
```

### alphavantage.ts

```typescript
const BASE_URL = "https://www.alphavantage.co/query";

function getKey(): string {
  return process.env.ALPHA_VANTAGE_API_KEY || "";
}

async function avFetch(params: Record<string, string>) {
  const url = new URL(BASE_URL);
  url.searchParams.set("apikey", getKey());
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } }); // Cache 24h
  if (!res.ok) throw new Error(`Alpha Vantage: ${res.status}`);
  return res.json();
}

export async function getCommodityPrice(commodity: string) {
  // commodity: "WTI", "BRENT", "NATURAL_GAS", "COPPER", "ALUMINUM", "WHEAT", "CORN", "COTTON", "SUGAR", "COFFEE"
  return avFetch({ function: commodity, interval: "monthly" });
}

export async function getTechnicalIndicator(symbol: string, indicator: string, timePeriod: string = "14") {
  return avFetch({
    function: indicator,  // "SMA", "EMA", "RSI", "MACD", etc.
    symbol,
    interval: "daily",
    time_period: timePeriod,
    series_type: "close",
  });
}
```

---

## API Route Handlers (src/app/api/)

Each route handler follows this pattern:

```typescript
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { symbol: string } }) {
  try {
    const { symbol } = params;
    // Call API client
    // Transform data
    // Return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
```

### Key Route Implementations

**stocks/quote/[symbol]/route.ts** — calls `finnhub.getQuote(symbol)`, maps response fields `{ c, d, dp, h, l, o, pc, t }` to `StockQuote` interface.

**stocks/profile/[symbol]/route.ts** — calls `finnhub.getProfile(symbol)` AND `fmp.getCompanyProfile(symbol)` in parallel, merges results (Finnhub for basic profile, FMP for detailed description/employees/CEO).

**stocks/candles/[symbol]/route.ts** — accepts `?resolution=D&from=...&to=...` query params. Calls `finnhub.getCandles(...)`. Response maps `{ o, h, l, c, v, t, s }` arrays into `CandleData[]`.

**stocks/financials/[symbol]/route.ts** — accepts `?statement=income|balance|cashflow&period=annual|quarter`. Calls the corresponding FMP function.

**stocks/peers/[symbol]/route.ts** — calls `finnhub.getCompanyPeers(symbol)`. Returns array of peer symbols.

**stocks/recommendations/[symbol]/route.ts** — calls `finnhub.getRecommendations(symbol)` AND `finnhub.getPriceTarget(symbol)` in parallel. Returns `{ recommendations: RecommendationData[], priceTarget: PriceTarget }`.

**stocks/earnings/[symbol]/route.ts** — calls `finnhub.getEarnings(symbol)`. Maps to `EarningsData[]`.

**stocks/dividends/[symbol]/route.ts** — calls `fmp.getDividendHistory(symbol)`. Maps `historical` array to `DividendData[]`.

**stocks/search/route.ts** — accepts `?q=...` query param. Calls `finnhub.searchSymbol(q)`. Returns `{ results: { symbol, description, type }[] }`.

**crypto/prices/route.ts** — calls `coingecko.getCoinsMarkets()`. Maps to `CryptoAsset[]`.

**crypto/[id]/route.ts** — calls `coingecko.getCoinData(id)`. Returns detailed coin data.

**forex/rates/route.ts** — calls `exchangerate.getLatestRates("USD")`. Returns rates object.

**forex/convert/route.ts** — accepts `?from=USD&to=EUR&amount=1000`. Calls `exchangerate.convertCurrency(...)`.

**economic/calendar/route.ts** — calls `finnhub.getEconomicCalendar(from, to)` with 30-day window. Maps to `EconomicEvent[]`.

**economic/indicators/[series]/route.ts** — calls `fred.getSeriesObservations(series, 100)`. Returns time series data.

**economic/yields/route.ts** — calls `fred.getMultipleSeries(Object.values(TREASURY_SERIES), 1)` to get latest yield for each maturity. Returns `YieldCurvePoint[]`.

**commodities/prices/route.ts** — returns hardcoded commodity list with cached data. Calls Alpha Vantage sparingly due to 25/day limit. Falls back to cached/mock data when limit exceeded.

**news/top/route.ts** — accepts `?category=general|forex|crypto|merger`. Calls `finnhub.getMarketNews(category)`. Maps to `NewsArticle[]`.

**news/company/[symbol]/route.ts** — calls `finnhub.getCompanyNews(symbol, from, to)` with 7-day lookback.

**indices/world/route.ts** — for each `INDEX_PROXIES` entry, calls `finnhub.getQuote(etf)` in parallel (batched). Returns array of index data with region grouping.

**screener/route.ts** — accepts POST with `ScreenerFilters` body. Calls `fmp.getStockScreener(filters)`. Returns `ScreenerResult[]`.

**options/chain/[symbol]/route.ts** — Note: Finnhub free tier has no options data. This route returns simulated/demo options chain data. If a paid API is configured later, it can be swapped in.

---

## Command System (src/lib/commands.ts)

```typescript
import { FUNCTION_REGISTRY } from "./constants";
import type { FunctionCode, Security, CommandSuggestion } from "./types";

export interface ParsedCommand {
  type: "function" | "security_function" | "security" | "unknown";
  functionCode?: FunctionCode;
  securityQuery?: string;
  raw: string;
}

// Parse user input from the command bar
export function parseCommand(input: string): ParsedCommand {
  const raw = input.trim().toUpperCase();
  if (!raw) return { type: "unknown", raw };

  // Check if input is a pure function code (e.g., "TOP", "HELP", "ECO")
  const exactFunction = FUNCTION_REGISTRY.find((f) => f.code === raw);
  if (exactFunction) {
    return { type: "function", functionCode: raw as FunctionCode, raw };
  }

  // Check for "SYMBOL FUNCTION" pattern (e.g., "AAPL GP", "MSFT FA")
  const parts = raw.split(/\s+/);
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    const funcMatch = FUNCTION_REGISTRY.find((f) => f.code === lastPart);
    if (funcMatch) {
      const securityQuery = parts.slice(0, -1).join(" ");
      return {
        type: "security_function",
        functionCode: lastPart as FunctionCode,
        securityQuery,
        raw,
      };
    }
  }

  // Check for "SYMBOL US Equity FUNCTION" Bloomberg-style (e.g., "AAPL US Equity GP")
  const equityMatch = raw.match(/^(.+?)\s+US\s+EQUITY\s+(\w+)$/);
  if (equityMatch) {
    const [, symbol, func] = equityMatch;
    const funcMatch = FUNCTION_REGISTRY.find((f) => f.code === func);
    if (funcMatch) {
      return {
        type: "security_function",
        functionCode: func as FunctionCode,
        securityQuery: symbol,
        raw,
      };
    }
  }

  // Treat as security search (e.g., "AAPL", "Apple")
  return { type: "security", securityQuery: raw, raw };
}

// Generate autocomplete suggestions
export function getSuggestions(input: string): CommandSuggestion[] {
  const query = input.trim().toUpperCase();
  if (!query) return FUNCTION_REGISTRY.slice(0, 10);

  return FUNCTION_REGISTRY.filter(
    (f) =>
      f.code.includes(query) ||
      f.name.toUpperCase().includes(query) ||
      f.description.toUpperCase().includes(query)
  ).slice(0, 10);
}
```

---

## Providers

### QueryProvider.tsx

```typescript
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            retry: 2,
            staleTime: 30000,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

### WebSocketProvider.tsx

```typescript
"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { useSecurityStore } from "@/store/securityStore";

interface WebSocketContextValue {
  subscribe: (symbol: string) => void;
  unsubscribe: (symbol: string) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  subscribe: () => {},
  unsubscribe: () => {},
  isConnected: false,
});

export function useWebSocketContext() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscribedSymbols = useRef(new Set<string>());
  const updateQuotePrice = useSecurityStore((s) => s.updateQuotePrice);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!apiKey) return;

    const ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // Re-subscribe existing symbols
      subscribedSymbols.current.forEach((symbol) => {
        ws.send(JSON.stringify({ type: "subscribe", symbol }));
      });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "trade" && data.data) {
        data.data.forEach((trade: { s: string; p: number; t: number }) => {
          updateQuotePrice(trade.s, trade.p, trade.t);
        });
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Auto-reconnect after 5 seconds
      setTimeout(() => {
        if (wsRef.current === ws) {
          // Will be re-created by useEffect cleanup/re-run
        }
      }, 5000);
    };

    ws.onerror = () => setIsConnected(false);

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [updateQuotePrice]);

  const subscribe = useCallback((symbol: string) => {
    subscribedSymbols.current.add(symbol);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "subscribe", symbol }));
    }
  }, []);

  const unsubscribe = useCallback((symbol: string) => {
    subscribedSymbols.current.delete(symbol);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "unsubscribe", symbol }));
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ subscribe, unsubscribe, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}
```

---

## Root Layout and Page

### layout.tsx

```typescript
import type { Metadata } from "next";
import { QueryProvider } from "@/providers/QueryProvider";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloomberg Terminal",
  description: "Bloomberg Terminal Clone",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <WebSocketProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#111111",
                  color: "#e0e0e0",
                  border: "1px solid #333333",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                },
              }}
            />
          </WebSocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

### page.tsx

```typescript
import { Terminal } from "@/components/terminal/Terminal";

export default function Home() {
  return <Terminal />;
}
```

---

## Core Terminal Components

### Terminal.tsx

The root component. Full viewport. No scrolling on body.

```
┌─[ COMMAND BAR ]──────────────────────────────────────────────────────────┐
│  BLOOMBERG> [____________________________________] [A] [B] [C] [D]       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─[ Panel 1 ]──────────────┐  ┌─[ Panel 2 ]──────────────┐            │
│  │ [Tab1] [Tab2]  [+] [⛶]   │  │ [Tab1]       [+] [⛶]     │            │
│  │                           │  │                           │            │
│  │   Function Content        │  │   Function Content        │            │
│  │                           │  │                           │            │
│  └───────────────────────────┘  └───────────────────────────┘            │
│  ┌─[ Panel 3 ]──────────────┐  ┌─[ Panel 4 ]──────────────┐            │
│  │ [Tab1]       [+] [⛶]     │  │ [Tab1]       [+] [⛶]     │            │
│  │                           │  │                           │            │
│  │   Function Content        │  │   Function Content        │            │
│  │                           │  │                           │            │
│  └───────────────────────────┘  └───────────────────────────┘            │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│  [STATUS BAR] NYSE: OPEN | 10:42:15 ET | WebSocket: ● | Finnhub 42/60  │
└──────────────────────────────────────────────────────────────────────────┘
```

Structure:
```tsx
"use client";
export function Terminal() {
  // Initialize activePanelId to first panel on mount
  // Set up keyboard shortcuts via useKeyboardShortcuts()
  return (
    <div className="h-screen w-screen flex flex-col bg-bloomberg-black overflow-hidden font-mono">
      <CommandBar />
      <PanelManager />
      <StatusBar />
    </div>
  );
}
```

### CommandBar.tsx

The iconic Bloomberg command line. Always visible at top.

**Layout:**
- Left: "BLOOMBERG" label in amber, bold
- Center: Input field with amber text on dark bg, full width
- Right: Security group buttons [A] [B] [C] [D]

**Behavior:**
1. User types text (could be function code, security ticker, or "TICKER FUNCTION")
2. As they type, an autocomplete dropdown appears below with matching functions and securities
3. Functions match from `FUNCTION_REGISTRY`
4. Securities match from `/api/stocks/search` (debounced 300ms)
5. On Enter (or "GO"), parse and execute the command:
   - Pure function code → navigate active panel's active tab to that function
   - "TICKER FUNCTION" → set security on the panel's group, then navigate to function
   - Pure ticker → search for ticker, if found set as security on active group, navigate to DES
6. Security group buttons [A]-[D] show which group is active (the active panel's group). Clicking sets the active panel to one with that group.
7. Escape clears input and blurs
8. Up/Down arrows navigate autocomplete suggestions
9. Command history accessible with up arrow when input is empty

**Autocomplete dropdown:**
- Dark panel bg, bordered
- Each row: `[CODE] - [Name] - [Description]` or `[SYMBOL] - [CompanyName] - [Exchange]`
- Highlighted row in amber bg
- Max 8 visible rows

**Key code:**
```tsx
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { parseCommand, getSuggestions } from "@/lib/commands";
import { useTerminalStore } from "@/store/terminalStore";
import { useSecurityStore } from "@/store/securityStore";
import { debounce } from "@/lib/utils";

export function CommandBar() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { activePanelId, panels, navigateToFunction, addCommandToHistory, commandHistory } = useTerminalStore();
  const { setGroupSecurity } = useSecurityStore();

  // On input change, update suggestions
  useEffect(() => {
    if (!input.trim()) {
      setShowDropdown(false);
      return;
    }
    const funcSuggestions = getSuggestions(input);
    setSuggestions(funcSuggestions);
    setShowDropdown(true);
    setSelectedIndex(0);
    // Also search securities (debounced)
    debouncedSearch(input);
  }, [input]);

  const debouncedSearch = useCallback(
    debounce(async (q: string) => {
      if (q.length < 2) return;
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSearchResults(data.results?.slice(0, 5) || []);
      } catch { setSearchResults([]); }
    }, 300),
    []
  );

  async function executeCommand() {
    const parsed = parseCommand(input);
    const activePanel = panels.find((p) => p.id === activePanelId);
    if (!activePanel) return;

    addCommandToHistory(input);

    if (parsed.type === "function" && parsed.functionCode) {
      navigateToFunction(activePanelId, parsed.functionCode, null);
    } else if (parsed.type === "security_function" && parsed.functionCode && parsed.securityQuery) {
      // Look up the security
      const security = await resolveSecurity(parsed.securityQuery);
      if (security) {
        setGroupSecurity(activePanel.group, security);
        navigateToFunction(activePanelId, parsed.functionCode, security);
      }
    } else if (parsed.type === "security" && parsed.securityQuery) {
      const security = await resolveSecurity(parsed.securityQuery);
      if (security) {
        setGroupSecurity(activePanel.group, security);
        navigateToFunction(activePanelId, "DES", security);
      }
    }

    setInput("");
    setShowDropdown(false);
  }

  async function resolveSecurity(query: string): Promise<Security | null> {
    try {
      const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.results?.length > 0) {
        const match = data.results[0];
        return {
          symbol: match.symbol,
          name: match.description,
          type: "equity",
          exchange: match.displaySymbol,
        };
      }
    } catch {}
    return null;
  }

  // Render: input with dropdown overlay
}
```

### PanelManager.tsx

Manages the grid of panels based on `layout` from terminalStore.

**Layout modes:**
- `quad`: 2x2 grid (CSS grid: `grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr`)
- `single`: 1 panel full width/height
- `dual-horizontal`: 2 panels side by side
- `dual-vertical`: 2 panels stacked
- `triple-left`: 1 large left + 2 small right
- `triple-right`: 2 small left + 1 large right

Each panel is rendered via `<Panel key={panel.id} panelState={panel} isActive={panel.id === activePanelId} />`.

Clicking on a panel sets it as active (amber border highlight vs dark border for inactive).

### Panel.tsx

Individual panel with tab bar and content area.

**Tab bar:** Row of tabs. Each tab shows its `title` (e.g., "AAPL DES" or "TOP"). Active tab has amber bottom border. Close button (x) on each tab. [+] button to add a new tab (opens function picker). [⛶] fullscreen toggle button.

**Tab content area:** Renders the appropriate function component via `FunctionRouter`.

**Security group badge:** Small colored letter (A/B/C/D) in the panel header corner showing which security group this panel belongs to.

**Active panel indicator:** When `isActive`, the panel border is amber. Inactive panels have dark border.

### FunctionRouter.tsx

Maps `FunctionCode` to the corresponding component:

```tsx
import dynamic from "next/dynamic";
import type { FunctionCode, Security } from "@/lib/types";

// Lazy-load all function components
const DES = dynamic(() => import("@/components/functions/DES").then(m => ({ default: m.DES })));
const GP = dynamic(() => import("@/components/functions/GP").then(m => ({ default: m.GP })));
// ... etc for all function components

const FUNCTION_MAP: Record<FunctionCode, React.ComponentType<{ security?: Security | null }>> = {
  DES, GP, FA, ANR, DVD, ERN, COMP, RV,
  TOP, WEI, MOST, MOV,
  WB, CRVF,
  FXCA, FXMON: FXMonitor,
  CMDTY: CommodityDash,
  ECO, ECST,
  CRYPTO: CryptoDash,
  PORT, EQS,
  OMON,
  HMAP: Heatmap,
  ALRT: Alerts,
  IB,
  SET: Settings,
  HELP,
  WATC: Watchlist,
};

export function FunctionRouter({ functionCode, security }: { functionCode: FunctionCode; security: Security | null }) {
  const Component = FUNCTION_MAP[functionCode];
  if (!Component) return <div className="text-bloomberg-red p-4">UNKNOWN FUNCTION: {functionCode}</div>;
  return <Component security={security} />;
}
```

### StatusBar.tsx

Bottom bar showing system status.

**Content (left to right):**
- Market status: "NYSE: OPEN" (green) or "NYSE: CLOSED" (red) based on current time vs `MARKET_HOURS`
- Current time in ET, updating every second
- WebSocket status: green dot if connected, red dot if disconnected
- Active layout mode
- Date

```tsx
"use client";
import { useState, useEffect } from "react";
import { useWebSocketContext } from "@/providers/WebSocketProvider";
import { useTerminalStore } from "@/store/terminalStore";
import { MARKET_HOURS } from "@/lib/constants";

export function StatusBar() {
  const [time, setTime] = useState(new Date());
  const { isConnected } = useWebSocketContext();
  const layout = useTerminalStore((s) => s.layout);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isMarketOpen = checkMarketOpen(time);

  return (
    <div className="h-6 bg-bloomberg-panel border-t border-bloomberg-border flex items-center px-3 gap-6 text-xxs font-mono shrink-0">
      <span className={isMarketOpen ? "text-bloomberg-green" : "text-bloomberg-red"}>
        NYSE: {isMarketOpen ? "OPEN" : "CLOSED"}
      </span>
      <span className="text-bloomberg-muted">
        {time.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour12: false })} ET
      </span>
      <span className="flex items-center gap-1">
        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-bloomberg-green" : "bg-bloomberg-red"}`} />
        <span className="text-bloomberg-muted">WS</span>
      </span>
      <span className="text-bloomberg-muted uppercase">{layout}</span>
      <span className="ml-auto text-bloomberg-muted">
        {time.toLocaleDateString("en-US", { timeZone: "America/New_York" })}
      </span>
    </div>
  );
}

function checkMarketOpen(now: Date): boolean {
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay();
  if (day === 0 || day === 6) return false;
  const hours = et.getHours();
  const minutes = et.getMinutes();
  const timeNum = hours * 60 + minutes;
  return timeNum >= 570 && timeNum < 960; // 9:30-16:00
}
```

---

## Data Display Primitives

### DataTable.tsx

Bloomberg-style sortable data table. Used throughout the app.

```tsx
interface DataTableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  format?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  highlightRow?: (row: T) => boolean;
  maxHeight?: string;
}
```

Renders using native `<table>` with `bb-table` CSS classes. Sticky header. Scrollable body in a `max-height` container. Click column headers to sort (ascending → descending → none). Sort indicator arrow in header.

### KeyValueGrid.tsx

2-column or 4-column grid of label:value pairs. Used in DES overview, settings, etc.

```tsx
interface KeyValueItem {
  label: string;
  value: React.ReactNode;
}

interface KeyValueGridProps {
  items: KeyValueItem[];
  columns?: 2 | 4;
}
```

Renders as a CSS grid with amber labels and white values.

### PriceDisplay.tsx

Large price display with change indicator.

```tsx
interface PriceDisplayProps {
  price: number;
  change: number;
  changePercent: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
}
```

Shows: `$191.56 +2.34 (+1.24%)` where change/percent are colored green/red.

### LoadingState.tsx

Bloomberg-style loading indicator: `"LOADING..."` in amber, centered, with blinking cursor.

### SparklineChart.tsx

Tiny inline SVG chart (width ~100px, height ~24px). Used in watchlists, indices, crypto tables.

Takes `data: number[]` and renders a polyline SVG. Color: green if last > first, red if last < first.

---

## Chart Components

### CandlestickChart.tsx

Uses `lightweight-charts` (TradingView's charting library). This is the primary financial chart.

```tsx
interface CandlestickChartProps {
  data: CandleData[];
  height?: number;
  indicators?: IndicatorOverlay[];
  onCrosshairMove?: (data: any) => void;
}
```

**Setup:**
1. Create chart with `createChart()` using Bloomberg dark theme:
   ```typescript
   const chart = createChart(containerRef.current, {
     width: containerWidth,
     height: props.height || 400,
     layout: { background: { color: "#000000" }, textColor: "#888888" },
     grid: { vertLines: { color: "#1a1a1a" }, horzLines: { color: "#1a1a1a" } },
     crosshair: { mode: CrosshairMode.Normal },
     rightPriceScale: { borderColor: "#333333" },
     timeScale: { borderColor: "#333333", timeVisible: true },
   });
   ```
2. Add candlestick series with custom colors:
   ```typescript
   const candleSeries = chart.addCandlestickSeries({
     upColor: "#00d26a",
     downColor: "#ff3b3b",
     borderUpColor: "#00d26a",
     borderDownColor: "#ff3b3b",
     wickUpColor: "#00d26a",
     wickDownColor: "#ff3b3b",
   });
   ```
3. Add volume histogram as a separate series at bottom
4. Handle resize with ResizeObserver
5. Cleanup on unmount

### LineChart.tsx, AreaChart.tsx, BarChartComponent.tsx

Recharts-based wrappers. Each applies Bloomberg dark theme:
```tsx
<ResponsiveContainer width="100%" height={height}>
  <RechartsLineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
    <XAxis dataKey="date" stroke="#888" fontSize={10} />
    <YAxis stroke="#888" fontSize={10} />
    <Tooltip
      contentStyle={{ background: "#111", border: "1px solid #333", fontFamily: "JetBrains Mono", fontSize: 11 }}
      labelStyle={{ color: "#ff8c00" }}
    />
    <Line type="monotone" dataKey="value" stroke="#ff8c00" dot={false} strokeWidth={1.5} />
  </RechartsLineChart>
</ResponsiveContainer>
```

### YieldCurveChart.tsx

Special Recharts line chart for yield curves. X-axis: maturities (1M, 3M, 6M, ... 30Y). Y-axis: yield %. Supports overlaying multiple curves in different colors (current, 1 month ago, 1 year ago).

### TreemapChart.tsx

Recharts Treemap for market heatmap. Each cell: ticker label + % change. Color scale from red to green.

### PieChartComponent.tsx

Recharts pie chart for portfolio allocation, crypto dominance, etc. Bloomberg dark theme with amber/cyan/blue/green color palette.

---

## Technical Indicators (src/lib/indicators.ts)

Client-side calculation of technical indicators:

```typescript
export function calculateSMA(data: number[], period: number): (number | null)[] {
  return data.map((_, i) => {
    if (i < period - 1) return null;
    const slice = data.slice(i - period + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
}

export function calculateEMA(data: number[], period: number): (number | null)[] {
  const k = 2 / (period + 1);
  const result: (number | null)[] = [];
  let ema: number | null = null;
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) { result.push(null); continue; }
    if (ema === null) {
      ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
    } else {
      ema = data[i] * k + ema * (1 - k);
    }
    result.push(ema);
  }
  return result;
}

export function calculateRSI(data: number[], period: number = 14): (number | null)[] {
  // Standard RSI with Wilder smoothing
  const result: (number | null)[] = [];
  let avgGain = 0, avgLoss = 0;
  for (let i = 0; i < data.length; i++) {
    if (i === 0) { result.push(null); continue; }
    const change = data[i] - data[i - 1];
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);
    if (i <= period) {
      avgGain += gain; avgLoss += loss;
      if (i === period) {
        avgGain /= period; avgLoss /= period;
        result.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
      } else { result.push(null); }
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      result.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
    }
  }
  return result;
}

export function calculateMACD(
  data: number[],
  fast: number = 12,
  slow: number = 26,
  signal: number = 9
): { macd: (number | null)[]; signal: (number | null)[]; histogram: (number | null)[] } {
  const fastEMA = calculateEMA(data, fast);
  const slowEMA = calculateEMA(data, slow);
  const macdLine = fastEMA.map((f, i) => (f !== null && slowEMA[i] !== null ? f - slowEMA[i]! : null));
  const macdValues = macdLine.filter((v): v is number => v !== null);
  const signalEMA = calculateEMA(macdValues, signal);
  // Align signal line back with full array
  let sigIdx = 0;
  const alignedSignal = macdLine.map((m) => {
    if (m === null) return null;
    return signalEMA[sigIdx++] ?? null;
  });
  const histogram = macdLine.map((m, i) => {
    const s = alignedSignal[i];
    return m !== null && s !== null ? m - s : null;
  });
  return { macd: macdLine, signal: alignedSignal, histogram };
}

export function calculateBollingerBands(
  data: number[],
  period: number = 20,
  stdDevMultiplier: number = 2
): { upper: (number | null)[]; middle: (number | null)[]; lower: (number | null)[] } {
  const sma = calculateSMA(data, period);
  const upper = sma.map((m, i) => {
    if (m === null) return null;
    const slice = data.slice(i - period + 1, i + 1);
    const std = Math.sqrt(slice.reduce((a, b) => a + (b - m) ** 2, 0) / period);
    return m + stdDevMultiplier * std;
  });
  const lower = sma.map((m, i) => {
    if (m === null) return null;
    const slice = data.slice(i - period + 1, i + 1);
    const std = Math.sqrt(slice.reduce((a, b) => a + (b - m) ** 2, 0) / period);
    return m - stdDevMultiplier * std;
  });
  return { upper, middle: sma, lower };
}
```

---

## Formatters (src/lib/formatters.ts)

```typescript
import numeral from "numeral";
import { format, formatDistanceToNow } from "date-fns";

export function formatPrice(value: number, decimals: number = 2): string {
  return numeral(value).format(`0,0.${"0".repeat(decimals)}`);
}

export function formatLargeNumber(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e12) return numeral(value).format("$0.00a").replace("t", "T");
  if (abs >= 1e9) return numeral(value).format("$0.00a").replace("b", "B");
  if (abs >= 1e6) return numeral(value).format("$0.00a").replace("m", "M");
  if (abs >= 1e3) return numeral(value).format("$0.00a").replace("k", "K");
  return numeral(value).format("$0,0.00");
}

export function formatPercent(value: number, decimals: number = 2): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatChange(value: number, decimals: number = 2): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}`;
}

export function formatVolume(value: number): string {
  if (value >= 1e9) return (value / 1e9).toFixed(1) + "B";
  if (value >= 1e6) return (value / 1e6).toFixed(1) + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(1) + "K";
  return value.toString();
}

export function formatDate(date: string | number): string {
  return format(new Date(date), "yyyy-MM-dd");
}

export function formatDateTime(date: string | number): string {
  return format(new Date(date), "yyyy-MM-dd HH:mm");
}

export function formatTime(date: string | number): string {
  return format(new Date(date), "HH:mm:ss");
}

export function formatRelativeTime(date: string | number): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getChangeColor(value: number): string {
  if (value > 0) return "text-bloomberg-green";
  if (value < 0) return "text-bloomberg-red";
  return "text-bloomberg-white";
}
```

---

## Utilities (src/lib/utils.ts)

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nanoid(length: number = 12): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

export function throttle<T extends (...args: any[]) => any>(fn: T, ms: number): T {
  let lastCall = 0;
  return ((...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
}
```

---

## Rate Limiting (src/lib/rateLimit.ts)

```typescript
const rateLimiters = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(apiName: string, maxCalls: number, windowMs: number): boolean {
  const now = Date.now();
  const limiter = rateLimiters.get(apiName);
  if (!limiter || now >= limiter.resetAt) {
    rateLimiters.set(apiName, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (limiter.count >= maxCalls) return false;
  limiter.count++;
  return true;
}

// Usage in routes:
// if (!checkRateLimit("finnhub", 50, 60000)) {
//   return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
// }
```

---

## Custom Hooks (src/hooks/)

All hooks follow TanStack Query pattern:

```typescript
// useStockQuote.ts
import { useQuery } from "@tanstack/react-query";
import type { StockQuote } from "@/lib/types";

export function useStockQuote(symbol: string | undefined) {
  return useQuery({
    queryKey: ["stock-quote", symbol],
    queryFn: async () => {
      const res = await fetch(`/api/stocks/quote/${symbol}`);
      if (!res.ok) throw new Error("Failed to fetch quote");
      return res.json() as Promise<StockQuote>;
    },
    enabled: !!symbol,
    refetchInterval: 15000,
    staleTime: 10000,
  });
}
```

**Complete hook list with refetch intervals:**

| Hook | API Route | Refetch |
|------|-----------|---------|
| `useStockQuote(symbol)` | `/api/stocks/quote/[symbol]` | 15s |
| `useStockProfile(symbol)` | `/api/stocks/profile/[symbol]` | 5min |
| `useCandles(symbol, res, from, to)` | `/api/stocks/candles/[symbol]` | 60s |
| `useFinancials(symbol, stmt, period)` | `/api/stocks/financials/[symbol]` | 10min |
| `usePeers(symbol)` | `/api/stocks/peers/[symbol]` | 5min |
| `useRecommendations(symbol)` | `/api/stocks/recommendations/[symbol]` | 10min |
| `useEarnings(symbol)` | `/api/stocks/earnings/[symbol]` | 10min |
| `useDividends(symbol)` | `/api/stocks/dividends/[symbol]` | 10min |
| `useCrypto()` | `/api/crypto/prices` | 30s |
| `useForex(base)` | `/api/forex/rates` | 60s |
| `useEconomicData(seriesId)` | `/api/economic/indicators/[series]` | 30min |
| `useCommodities()` | `/api/commodities/prices` | 1hr |
| `useNews(category)` | `/api/news/top` | 60s |
| `useCompanyNews(symbol)` | `/api/news/company/[symbol]` | 60s |
| `useOptions(symbol)` | `/api/options/chain/[symbol]` | 5min |
| `useIndices()` | `/api/indices/world` | 30s |
| `useScreener(filters)` | `/api/screener` | Manual only |
| `useYieldCurve()` | `/api/economic/yields` | 5min |
| `useSymbolSearch(query)` | `/api/stocks/search` | On-demand |

### useKeyboardShortcuts.ts

Global keyboard handler:
- `/` or `Escape` → focus/blur command bar
- `Ctrl+1/2/3/4` → focus panel 1/2/3/4
- `F11` or `Ctrl+Shift+F` → toggle fullscreen on active panel
- `Ctrl+L` → cycle layout modes
- `Ctrl+W` → close active tab
- `Ctrl+T` → new tab in active panel

### useAlerts.ts

Interval-based hook (10s) that checks all enabled alerts against live quotes from `securityStore`. When triggered, calls `alertStore.triggerAlert(id)` and shows a `sonner` toast.

### useWebSocket.ts

```typescript
import { useEffect } from "react";
import { useWebSocketContext } from "@/providers/WebSocketProvider";

export function useWebSocket(symbols: string[]) {
  const { subscribe, unsubscribe, isConnected } = useWebSocketContext();
  useEffect(() => {
    symbols.forEach(subscribe);
    return () => symbols.forEach(unsubscribe);
  }, [symbols.join(","), subscribe, unsubscribe]);
  return { isConnected };
}
```

---

## Function Components (src/components/functions/)

Every function component receives `{ security?: Security | null }`. If a function requires a security and none is provided, show: `"Enter a security in the command bar (e.g., AAPL)"` in amber text centered.

### DES.tsx — Description

Company overview page. The default function when a security is loaded.

**Layout:**
```
┌─[ AAPL US Equity — DESCRIPTION ]────────────────────────────────────┐
│ ┌─[ COMPANY INFO ]──────────────────────────────────────────────────┐│
│ │ Name: Apple Inc                    Exchange: NASDAQ               ││
│ │ Sector: Technology                 Industry: Consumer Electronics ││
│ │ Country: US                        IPO Date: 1980-12-12          ││
│ │ Website: apple.com                 Employees: 164,000            ││
│ │ CEO: Tim Cook                      Phone: +1-408-996-1010       ││
│ └───────────────────────────────────────────────────────────────────┘│
│ ┌─[ PRICE ]─────┐ ┌─[ KEY FINANCIALS ]──────────────────────────────┐│
│ │ $191.56       │ │ P/E     28.5  │ P/B    46.2  │ EV/EBITDA  22.1 ││
│ │ +2.34 (+1.24%)│ │ ROE   171.9%  │ ROA    33.6% │ Div Yld   0.54%││
│ │ H: 192.01     │ │ Mkt Cap $2.9T │ Beta    1.24 │ 52W H    $199  ││
│ │ L: 188.94     │ │ Rev   $394B   │ EPS   $6.42  │ 52W L    $164  ││
│ └───────────────┘ └──────────────────────────────────────────────────┘│
│ ┌─[ DESCRIPTION ]───────────────────────────────────────────────────┐│
│ │ Apple Inc. designs, manufactures, and markets smartphones,        ││
│ │ personal computers, tablets, wearables, and accessories...        ││
│ └───────────────────────────────────────────────────────────────────┘│
│ ┌─[ 6-MONTH CHART ]────────────────────────────────────────────────┐ │
│ │ (AreaChart, height 150px, amber line on dark bg)                  │ │
│ └───────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

**Data:** `useStockProfile(symbol)` + `useStockQuote(symbol)` + `useCandles(symbol, "D", 180 days)`. For key metrics, use Finnhub `getBasicFinancials` which returns 52-week high/low, beta, PE, etc.

### GP.tsx — Price Graph

Interactive charting with full technical analysis.

**Layout:**
```
┌─[ Timeframe: 1D 5D 1M 3M 6M YTD 1Y 5Y MAX ]─[ Type: Candle ▼ ]───┐
│ ┌─[ CHART AREA ]──────────────────────────────────────────────────┐  │
│ │                                                                  │  │
│ │  CandlestickChart (or LineChart based on type selection)         │  │
│ │  ~75% of panel height                                           │  │
│ │                                                                  │  │
│ │  Volume bars at bottom of chart (20% height)                    │  │
│ │                                                                  │  │
│ └──────────────────────────────────────────────────────────────────┘  │
│ ┌─[ INDICATORS ]─────────────────────────────────────────────────┐   │
│ │ [+ Add] [SMA 20 ×] [EMA 50 ×] [RSI 14 ×]                      │   │
│ └─────────────────────────────────────────────────────────────────┘   │
│ ┌─[ INFO ]──────────────────────────────────────────────────────┐    │
│ │ O: 189.22  H: 192.01  L: 188.94  C: 191.56  V: 54.2M        │    │
│ └────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

**State:**
- `timeframe`: selected timeframe (maps to resolution + date range via `TIMEFRAME_CONFIG`)
- `chartType`: "candle" | "line" | "area"
- `indicators`: array of `{ type: "SMA"|"EMA"|"RSI"|"MACD"|"BB", period: number }`
- `crosshairData`: OHLCV data at crosshair position (updated via chart callback)

**Indicators:** SMA/EMA overlay on price chart as colored lines. RSI and MACD render in a separate sub-area below the main chart (100px height). Bollinger Bands render as two lines with semi-transparent fill between them.

**"+ Add" indicator button:** Opens a popover with indicator type select and period input.

**Data:** `useCandles(symbol, resolution, from, to)` — `from` and `to` calculated from `TIMEFRAME_CONFIG[timeframe]`.

### FA.tsx — Financial Analysis

Tabbed financial statements.

**Sub-tabs:** Income Statement | Balance Sheet | Cash Flow | Key Metrics | Growth

**Period toggle:** Annual / Quarterly (two `bb-btn` buttons)

**Data layout:** DataTable where rows are line items and columns are fiscal years (most recent first). Numbers formatted with `formatLargeNumber()`. Growth rates colored green/red.

**Income Statement rows:** Revenue, Cost of Revenue, Gross Profit, Gross Margin, R&D, SG&A, Operating Expenses, Operating Income, Op Margin, Interest Expense, Income Before Tax, Tax, Net Income, Net Margin, EPS, Diluted EPS, Shares Outstanding

**Balance Sheet rows:** Cash & Equivalents, Short-term Investments, Total Current Assets, PP&E, Goodwill, Total Assets, Accounts Payable, Short-term Debt, Total Current Liabilities, Long-term Debt, Total Liabilities, Shareholders' Equity, Total Liab + Equity

**Cash Flow rows:** Net Income, Depreciation, Stock-based Comp, Change in Working Capital, Operating Cash Flow, CapEx, Free Cash Flow, Dividends Paid, Share Buybacks, Financing Cash Flow

**Key Metrics rows:** P/E, P/B, P/S, EV/EBITDA, EV/Revenue, Debt/Equity, Current Ratio, ROE, ROA, ROIC, Dividend Yield, Payout Ratio, Book Value/Share, FCF/Share

**Data:** `useFinancials(symbol, statementType, period)` — calls FMP endpoints.

### ANR.tsx — Analyst Recommendations

**Sections:**
1. **Consensus badge:** Large "BUY" / "HOLD" / "SELL" display (green/amber/red)
2. **Rating distribution:** Horizontal stacked bar chart showing strongBuy/buy/hold/sell/strongSell counts
3. **Price target:** Box showing Current Price, Target Mean, Target High, Target Low, Target Median — with a visual range bar
4. **History table:** DataTable of monthly rating distributions (last 12 months)

**Data:** `useRecommendations(symbol)` — fetches both recommendation trends and price target.

### DVD.tsx — Dividends

**Sections:**
1. **Yield display:** Large current yield %, annual dividend amount, payout ratio
2. **History table:** DataTable: Ex-Date, Record Date, Pay Date, Amount, Adjusted Amount
3. **Chart:** BarChartComponent of dividend amounts over time
4. **Growth:** 5-year dividend CAGR calculation

**Data:** `useDividends(symbol)`.

### ERN.tsx — Earnings

**Sections:**
1. **Earnings surprise chart:** BarChartComponent showing EPS estimate vs actual for past 8 quarters. Green bars = beat, red = miss.
2. **Table:** DataTable: Quarter, Date, EPS Estimate, EPS Actual, Surprise, Surprise %, Revenue Est, Revenue Actual
3. **Trend chart:** LineChart of EPS over time

**Data:** `useEarnings(symbol)`.

### COMP.tsx — Comparable Companies

Single large DataTable. Target company highlighted in amber at top. Peers below.

**Columns:** Symbol, Name, Price, Chg%, Mkt Cap, P/E, P/B, EV/EBITDA, Revenue, Net Margin, ROE, Div Yield, Beta

**Data flow:**
1. `usePeers(symbol)` → get peer symbol list
2. For each peer, fetch quote (Finnhub) and metrics (Finnhub basicFinancials) in parallel on the API route
3. The `/api/stocks/peers/[symbol]` route handles the fan-out

**Sorting:** Click column headers to sort.

### RV.tsx — Relative Valuation

Similar to COMP but focused on valuation multiples. Each metric has a horizontal bar visualization showing where the target company sits vs peer average and range.

**Metrics shown:** P/E, Forward P/E, P/B, P/S, EV/EBITDA, EV/Revenue, PEG Ratio

### TOP.tsx — Top News

Real-time news feed. No security required.

**Layout:**
- Top: Category tabs (General | Forex | Crypto | Merger)
- Main: List of news articles with timestamp, source, headline
- Bottom: Selected article detail pane

**Each row:** `HH:MM  [SOURCE]  Headline text...`
- Timestamp in muted gray
- Source in cyan (3-5 char abbreviation)
- Headline in white
- Hover highlights entire row

**Click behavior:** Select article → show summary in detail pane. Click URL → open in new tab.

**Auto-refresh:** Every 60 seconds via `useNews(category)`.

**Data:** `useNews(category)` calls Finnhub market news.

### WEI.tsx — World Equity Indices

Three regional sections (Americas, EMEA, Asia Pacific), each as a DataTable.

**Columns:** Index Name, Last, Change, Chg%, Day High, Day Low, Sparkline (7d)

**Data:** `useIndices()` — fetches quotes for all ETF proxies from `INDEX_PROXIES`. Groups by region.

**Sparkline:** Uses SparklineChart component with 7-day candle close data (fetch once, cache long).

### MOST.tsx — Most Active / Movers

**Sub-tabs:** Top Gainers | Top Losers | Most Active

**Columns:** #, Symbol, Name, Price, Change, Chg%, Volume

**Data:** FMP `getStockGainers()`, `getStockLosers()`, `getStockMostActive()` — top 25 results each. Cached on server for 5 minutes.

### MOV.tsx — Price Movement

Historical price movement analysis for a security.

**Sections:**
1. **Current price info:** PriceDisplay component
2. **Period returns table:** 1D, 5D, 1M, 3M, 6M, YTD, 1Y, 3Y, 5Y returns with colored percentages
3. **52-week range:** Visual bar showing current price position within 52-week high/low
4. **Volatility:** Show beta and historical volatility from Finnhub basicFinancials

**Data:** `useStockQuote(symbol)` + `useCandles(symbol, ...)` for period returns calculation.

### WB.tsx — World Bonds

Treasury yields and yield curve.

**Layout:**
```
┌─[ US TREASURY YIELDS ]─────────────────────────────────────────┐
│ Maturity   Yield    Change    Previous                          │
│ 1 Month    5.42%    +0.02     5.40%                            │
│ 3 Month    5.38%    -0.01     5.39%                            │
│ ...        ...      ...       ...                              │
│ 30 Year    4.45%    +0.02     4.43%                            │
├─────────────────────────────────────────────────────────────────┤
│ ┌─[ YIELD CURVE ]──────────────────────────────────────────────┐│
│ │ (YieldCurveChart: line from 1M to 30Y)                       ││
│ └──────────────────────────────────────────────────────────────┘│
│ ┌─[ KEY SPREADS ]──────────────────────────────────────────────┐│
│ │ 10Y-2Y: -0.34%  │  10Y-3M: -1.10%  │  30Y-5Y: +0.10%      ││
│ └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

**Data:** `useYieldCurve()` — fetches FRED series for all treasury maturities. Computes change from previous observation.

### CRVF.tsx — Yield Curves

Interactive yield curve visualization.

**Features:**
- Current yield curve (amber line)
- Toggle overlays: 1 month ago (blue), 1 year ago (muted gray)
- Inversion zones highlighted with red shading
- Tooltip showing exact yield at each maturity

**Data:** FRED series for current and historical dates.

### FXCA.tsx — FX Calculator

**Layout:**
```
Amount: [1,000.00] From: [USD ▼] To: [EUR ▼] [CONVERT]
Result: 923.45 EUR | Rate: 1 USD = 0.92345 EUR

┌─[ CROSS RATES MATRIX ]────────────────────────────────────┐
│         USD    EUR    GBP    JPY    CHF    CAD    AUD     │
│  USD    ---   0.923  0.791  149.5  0.878  1.357  1.523   │
│  EUR   1.083   ---   0.857  161.9  0.951  1.470  1.650   │
│  ...                                                      │
└────────────────────────────────────────────────────────────┘
```

**Data:** `useForex("USD")` — builds cross-rate matrix from base USD rates. Conversion uses ExchangeRate-API.

### FXMonitor.tsx — FX Monitor

DataTable of major FX pairs.

**Columns:** Pair, Rate, Change, Chg%, Day High, Day Low, Sparkline

**Data:** `useForex("USD")` — derives pair rates from base USD rates. For sparklines, fetch 7-day forex candles from Finnhub (if available in free tier; otherwise skip sparklines).

### CommodityDash.tsx — Commodity Dashboard

Four sections: Energy | Precious Metals | Industrial Metals | Agriculture

Each section is a card grid showing commodity name, price, change, change%, unit.

**Data:** `useCommodities()` — Alpha Vantage has a 25/day limit so cache aggressively. Supplement with Finnhub forex for XAU/USD (gold) and XAG/USD (silver). For other commodities, use cached/fallback data with "Last updated" timestamp.

**Commodity list:**
- Energy: WTI Crude Oil, Brent Crude, Natural Gas
- Precious Metals: Gold, Silver, Platinum
- Industrial Metals: Copper, Aluminum
- Agriculture: Wheat, Corn, Coffee, Sugar, Cotton

### ECO.tsx — Economic Calendar

Filterable DataTable of upcoming economic events.

**Columns:** Date/Time, Country, Event, Importance (1-3 dots), Previous, Estimate, Actual

**Filters:** Country dropdown, importance toggle (1/2/3), date range

**Color coding:** Actual > Estimate → green, Actual < Estimate → red, no actual → muted

**Data:** `useNews("eco")` via Finnhub economic calendar endpoint. 30-day forward window.

### ECST.tsx — Economic Statistics

Grid of economic indicator cards, each showing:
- Indicator name
- Latest value
- Previous value
- Change direction arrow (up/down)
- Mini sparkline (last 20 observations)

Click a card → expand to full AreaChart (300px height) showing complete history.

**Indicators:** From `ECONOMIC_INDICATORS` constant — GDP, CPI, Core CPI, Unemployment, Fed Funds, Payrolls, Consumer Sentiment, Industrial Production, Retail Sales, Housing Starts, PCE, Initial Claims.

**Data:** For each indicator, `useEconomicData(seriesId)` → FRED observations.

### CryptoDash.tsx — Crypto Dashboard

**Layout:**
```
┌─[ MARKET OVERVIEW ]─────────────────────────────────────────┐
│ Total Market Cap: $2.41T  │  24h Volume: $98.4B  │  BTC: 52%│
└─────────────────────────────────────────────────────────────┘
┌─[ TOP CRYPTOCURRENCIES ]────────────────────────────────────┐
│ #  Name       Symbol  Price     24h %   7d %   Mkt Cap  7d │
│ 1  Bitcoin    BTC     $67,234  +2.3%  +5.1%  $1.32T   ~~~ │
│ 2  Ethereum   ETH     $3,456   +1.8%  -0.3%  $415B    ~~~ │
│ ...top 50                                                    │
└──────────────────────────────────────────────────────────────┘
┌─[ DOMINANCE ]──────────┐ ┌─[ 24h MKT CAP ]──────────────┐
│ (PieChart BTC/ETH/Other)│ │ (AreaChart, market cap trend)│
└─────────────────────────┘ └──────────────────────────────┘
```

**Data:** `useCrypto()` → CoinGecko markets (top 50) + CoinGecko global data.

**Sparkline column:** SparklineChart using the `sparklineIn7d` array from CoinGecko.

### PORT.tsx — Portfolio Manager

**Layout:**
```
┌─[ Portfolio: My Portfolio ▼ ]──[ + New ]──[ Edit ]──[ Delete ]──┐
│ ┌─[ SUMMARY ]──────────────────────────────────────────────────┐│
│ │ Total Value: $124,567  │ Day P&L: +$1,234 (+1.0%)            ││
│ │ Total Cost: $110,234   │ Total P&L: +$14,333 (+13.0%)        ││
│ └──────────────────────────────────────────────────────────────┘│
│ ┌─[ POSITIONS ]────────────────────────────────────────────────┐│
│ │ Symbol Qty AvgCost Price   MktVal    P&L    P&L%  Weight    ││
│ │ AAPL   50  $145    $191.56 $9,578   +$2,328 +32%   7.7%    ││
│ │ ...                                                          ││
│ └──────────────────────────────────────────────────────────────┘│
│ ┌─[ ALLOCATION ]────────┐ ┌─[ PERFORMANCE ]─────────────────┐  │
│ │ (PieChart by holding)  │ │ (LineChart portfolio vs SPY)    │  │
│ └────────────────────────┘ └─────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**Add Position:** Dialog with fields: Symbol (autocomplete input), Quantity, Average Cost.

**Live data:** For each position, fetch current quote to compute market value, P&L, weights.

**Persistence:** All in `portfolioStore` (localStorage via Zustand persist).

**Performance chart:** Fetch daily close for each position over 1 year, compute portfolio value over time, overlay SPY as benchmark.

### EQS.tsx — Equity Screener

**Filters section:** Grid of filter inputs:
- Market Cap Min/Max (number inputs)
- Price Min/Max
- P/E range
- Beta range
- Volume Min
- Dividend Min
- Sector (dropdown from `SECTORS`)
- Exchange (dropdown: NYSE, NASDAQ, AMEX)
- Country (dropdown)
- [SCREEN] button (amber) and [RESET] button

**Results section:** DataTable with sortable columns: Symbol, Name, Price, Chg%, Mkt Cap, P/E, Sector, Industry, Volume, Beta, Dividend

**Data:** `useScreener(filters)` — POST to `/api/screener` with filter params. Manual trigger only (not auto-refetch).

### OMON.tsx — Options Monitor

Classic options chain layout.

**Expiration selector:** Dropdown of expiration dates.

**Layout:** Calls on left, Puts on right, Strikes in center column.

**Call columns:** Last, Chg, Bid, Ask, Vol, OI, IV, Delta
**Put columns:** Delta, IV, OI, Vol, Ask, Bid, Chg, Last

**ITM highlighting:** In-the-money rows have slightly brighter background.

**Note on data:** Finnhub free tier has limited options support. If unavailable, generate a simulated options chain based on the current stock price (Black-Scholes approximation with assumed IV of 30%).

### Heatmap.tsx — Market Heatmap

Treemap visualization of S&P 500 sectors.

**Implementation:**
1. Fetch top stocks per sector using FMP screener
2. Size cells by market cap
3. Color cells by % change using scale: red (-5%) → gray (0%) → green (+5%)
4. Each cell shows: ticker symbol + % change
5. Hover tooltip: full name, price, change, volume
6. Click → load security in command bar

**Color scale function:**
```typescript
function getHeatmapColor(changePercent: number): string {
  const clamped = Math.max(-5, Math.min(5, changePercent));
  if (clamped < 0) {
    const intensity = Math.abs(clamped) / 5;
    return `rgb(${Math.round(51 + intensity * 204)}, ${Math.round(51 - intensity * 51)}, ${Math.round(51 - intensity * 51)})`;
  } else {
    const intensity = clamped / 5;
    return `rgb(${Math.round(51 - intensity * 51)}, ${Math.round(51 + intensity * 159)}, ${Math.round(51 + intensity * 55)})`;
  }
}
```

### Alerts.tsx — Alert System

**Layout:**
```
┌─[ CREATE ALERT ]────────────────────────────────────────────┐
│ Symbol: [     ] Condition: [Above ▼] Value: [     ] [CREATE]│
└──────────────────────────────────────────────────────────────┘
┌─[ ACTIVE ALERTS ]───────────────────────────────────────────┐
│ Symbol  Condition    Value    Status     Created    Actions  │
│ AAPL    Above        $200    Watching   2/25/26    [✓] [✕]  │
│ MSFT    Below        $400    Watching   2/25/26    [✓] [✕]  │
└──────────────────────────────────────────────────────────────┘
┌─[ TRIGGERED ]───────────────────────────────────────────────┐
│ Symbol  Condition    Value    Triggered At                   │
│ NVDA    Above        $900    2/24/26 14:32                  │
└──────────────────────────────────────────────────────────────┘
```

**Conditions:** Above, Below, % Change Above, % Change Below, Volume Above

**Alert checking:** `useAlerts()` hook runs every 10 seconds, checks quotes from `securityStore` against alert conditions.

**Notification:** `sonner` toast + optional browser Notification API.

### IB.tsx — Instant Bloomberg (Chat)

Simulated messaging interface.

**Layout:** Message list (scrollable) + input bar at bottom.

**Message styling:**
- System messages: amber sender label, muted text
- User messages: cyan sender label, white text
- Timestamp in muted, HH:MM format

**Features:**
- Type message and press Enter to send
- Messages stored in `chatStore` (localStorage)
- Simulated bot responses for demo (e.g., typing "/price AAPL" returns a simulated quote)

### Watchlist.tsx — Watchlist Manager

**Layout:**
```
┌─[ Watchlist: My Watchlist ▼ ]──[ + New ]──[ Add: [     ] + ]───┐
│ Symbol  Name           Price    Change   Chg%    Volume  MktCap│
│ AAPL    Apple Inc      191.56   +2.34   +1.24%   54.2M  $2.87T│
│ MSFT    Microsoft      415.23   +3.12   +0.76%   22.1M  $3.09T│
│ ...                                                             │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Dropdown to switch watchlists
- Create new watchlist dialog
- Add symbol input with autocomplete
- Remove symbol (X button or right-click)
- Real-time price updates via WebSocket subscriptions
- Click symbol → set as active security → navigate to DES
- Price flash animation on updates (green/red flash)

### Settings.tsx — Settings Panel

**Sections:**
1. **API Keys:** Finnhub, FMP, Alpha Vantage, FRED — masked inputs with toggle reveal
2. **Display:** Compact mode toggle, Flash prices toggle
3. **Data:** Refresh interval slider (5s / 10s / 15s / 30s / 60s)
4. **Sound:** Enable/disable alert sounds
5. **Keyboard Shortcuts:** Reference table

### HELP.tsx — Help / Reference

Static reference page with:
1. **Function codes table:** DataTable of all functions from `FUNCTION_REGISTRY` with columns: Code, Name, Description, Requires Security
2. **Keyboard shortcuts:** Table of all shortcuts
3. **Command syntax guide:** How to use the command bar (examples)
4. **Security groups:** Explanation of A/B/C/D linking
5. **API status:** Show which API keys are configured

---

## Environment Variables

### .env.example
```
FINNHUB_API_KEY=
FMP_API_KEY=
ALPHA_VANTAGE_API_KEY=
FRED_API_KEY=
NEXT_PUBLIC_FINNHUB_API_KEY=
```

Note: `NEXT_PUBLIC_FINNHUB_API_KEY` is needed client-side for WebSocket connection. All other keys are server-side only.

### .env.local
User fills in their actual API keys here. This file is gitignored.

---

## Edge Cases and Error Handling

1. **No security selected:** Functions requiring security show amber prompt "Enter a security in the command bar"
2. **Invalid symbol:** API returns empty/error → show "SYMBOL NOT FOUND" in red
3. **Market closed:** Show last available data with "MARKET CLOSED" badge in status bar
4. **API rate limit exceeded:** Server returns 429 → client shows "DATA MAY BE STALE" warning, uses cached data from TanStack Query
5. **WebSocket disconnection:** Red indicator in StatusBar, auto-reconnect after 5s
6. **Empty financial data:** "NO FINANCIAL DATA AVAILABLE" for pre-revenue or non-US companies
7. **Missing fields in API response:** Use optional chaining and nullish coalescing throughout
8. **Very large/small numbers:** Formatters handle T/B/M/K suffixes automatically
9. **Crypto vs stock symbols:** Routing logic differentiates based on SecurityType
10. **localStorage full:** Catch quota exceeded in Zustand persist, degrade gracefully
11. **Browser tab backgrounded:** TanStack Query pauses refetch when window not focused, resumes on focus
12. **Resize events:** Charts use ResizeObserver for responsive sizing
13. **Network errors:** All API routes wrap in try/catch, return structured error JSON, client shows error state

---

## Build Order (Implementation Sequence)

### Phase 1: Project Setup
1. `pnpm create next-app@latest bloomberg-terminal --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
2. Install dependencies: `pnpm add zustand @tanstack/react-query lightweight-charts recharts numeral date-fns clsx tailwind-merge sonner lucide-react class-variance-authority @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-popover @radix-ui/react-scroll-area @radix-ui/react-switch @radix-ui/react-slider @radix-ui/react-separator @radix-ui/react-slot`
3. Install dev deps: `pnpm add -D @types/numeral`
4. Download JetBrains Mono woff2 fonts to `public/fonts/`
5. Configure `tailwind.config.ts` with Bloomberg theme
6. Write `globals.css` with all Bloomberg styles
7. Create `.env.example` and `.env.local`
8. Initialize shadcn/ui: `pnpm dlx shadcn@latest init` — configure for dark theme
9. Add shadcn components: button, input, dialog, tabs, select, popover, scroll-area, switch, slider, separator, badge, card

### Phase 2: Core Library
10. Create `src/lib/types.ts`
11. Create `src/lib/constants.ts`
12. Create `src/lib/utils.ts`
13. Create `src/lib/formatters.ts`
14. Create `src/lib/indicators.ts`
15. Create `src/lib/commands.ts`
16. Create `src/lib/rateLimit.ts`

### Phase 3: API Layer
17. Create `src/lib/api/finnhub.ts`
18. Create `src/lib/api/coingecko.ts`
19. Create `src/lib/api/fred.ts`
20. Create `src/lib/api/exchangerate.ts`
21. Create `src/lib/api/fmp.ts`
22. Create `src/lib/api/alphavantage.ts`
23. Create all API route handlers (stocks, crypto, forex, economic, commodities, news, indices, screener, options)

### Phase 4: State Management
24. Create all Zustand stores (terminal, security, watchlist, portfolio, alert, settings, chat)

### Phase 5: Providers and Layout
25. Create `src/providers/QueryProvider.tsx`
26. Create `src/providers/WebSocketProvider.tsx`
27. Create `src/app/layout.tsx`
28. Create `src/app/page.tsx`

### Phase 6: Terminal Shell
29. Create `Terminal.tsx`
30. Create `CommandBar.tsx`
31. Create `PanelManager.tsx`
32. Create `Panel.tsx`
33. Create `FunctionRouter.tsx`
34. Create `StatusBar.tsx`

### Phase 7: Data Display Primitives
35. Create `DataTable.tsx`
36. Create `KeyValueGrid.tsx`
37. Create `PriceDisplay.tsx`
38. Create `LoadingState.tsx`
39. Create `SparklineChart.tsx`

### Phase 8: Chart Components
40. Create `CandlestickChart.tsx`
41. Create `LineChart.tsx`
42. Create `AreaChart.tsx`
43. Create `BarChartComponent.tsx`
44. Create `YieldCurveChart.tsx`
45. Create `TreemapChart.tsx`
46. Create `PieChartComponent.tsx`

### Phase 9: Custom Hooks
47. Create all `use*.ts` hooks

### Phase 10: Function Components (build in this order)
48. `DES.tsx` — tests full data pipeline
49. `GP.tsx` — tests charting
50. `TOP.tsx` — tests news feed
51. `Watchlist.tsx` — tests real-time updates
52. `WEI.tsx` — tests multi-symbol fetching
53. `FA.tsx` — tests financial data tables
54. `ANR.tsx`, `DVD.tsx`, `ERN.tsx` — simpler security functions
55. `COMP.tsx`, `RV.tsx` — peer comparison
56. `MOST.tsx`, `MOV.tsx` — market movers
57. `WB.tsx`, `CRVF.tsx` — fixed income / FRED
58. `FXCA.tsx`, `FXMonitor.tsx` — forex
59. `CommodityDash.tsx` — commodities
60. `ECO.tsx`, `ECST.tsx` — economics
61. `CryptoDash.tsx` — crypto
62. `PORT.tsx` — portfolio
63. `EQS.tsx` — screener
64. `OMON.tsx` — options
65. `Heatmap.tsx` — heatmap
66. `Alerts.tsx` — alerts
67. `IB.tsx` — chat
68. `Settings.tsx` — settings
69. `HELP.tsx` — help reference

### Phase 11: Polish
70. `useKeyboardShortcuts.ts`
71. `useAlerts.ts` (background checking)
72. Final styling pass
73. Test all function components with live API data
74. Write `CLAUDE.md` project documentation
75. Create `.gitignore` (include `.env.local`, `node_modules`, `.next`, `.DS_Store`)
76. `git init && git add . && git commit -m "Initial commit: Bloomberg Terminal clone"`

---

## Verification

After building, verify the following:

1. **`pnpm dev` starts without errors** — app loads at localhost:3000
2. **Command bar works:** Type "AAPL" and press Enter → loads AAPL DES page with real data
3. **Navigation:** Type "GP" → switches to price graph with chart rendering
4. **Panel system:** Four panels visible in quad layout. Click to activate. Tabs work.
5. **Security linking:** Loading "AAPL" in Panel A (group A), then typing "FA" → shows AAPL financials
6. **Real-time:** Watchlist shows price updates via WebSocket (if NEXT_PUBLIC_FINNHUB_API_KEY set)
7. **All functions accessible:** Verify each function code renders its component
8. **Responsive charts:** Resize browser → charts resize smoothly
9. **Keyboard shortcuts:** Press "/" → command bar focuses. Ctrl+1 → panel 1 activates.
10. **Portfolio:** Add positions → values calculate correctly with live prices
11. **Screener:** Set filters → click SCREEN → results appear
12. **Economic data:** ECO shows calendar events. ECST shows indicator cards with sparklines.
13. **Crypto:** CRYPTO shows top 50 coins with sparklines and global data
14. **Settings:** API keys save to localStorage. Refresh interval changes work.
15. **Error handling:** Remove API key → appropriate error messages shown (not crashes)

---

## .gitignore

```
node_modules/
.next/
.env.local
.env*.local
.DS_Store
*.tsbuildinfo
next-env.d.ts
```

---

## CLAUDE.md (project-specific)

Create at project root after build:

```markdown
# Bloomberg Terminal Clone

## Tech Stack
- Next.js 15 (App Router), TypeScript, pnpm
- Tailwind CSS, shadcn/ui, Zustand, TanStack Query
- lightweight-charts, Recharts
- Finnhub, FMP, CoinGecko, FRED, ExchangeRate-API, Alpha Vantage

## Architecture
- `src/app/api/` — Server-side API route proxies (never expose keys to client)
- `src/lib/api/` — API client functions
- `src/store/` — Zustand stores with localStorage persistence
- `src/hooks/` — TanStack Query hooks for data fetching
- `src/components/terminal/` — Core terminal shell (CommandBar, PanelManager, Panel)
- `src/components/functions/` — Bloomberg function screens (DES, GP, FA, etc.)
- `src/components/charts/` — Chart components
- `src/components/data-display/` — Reusable data display primitives

## Key Patterns
- All API calls go through Next.js API routes (server-side only)
- TanStack Query handles caching, refetching, error states
- Zustand stores persist user data (watchlists, portfolios, alerts) to localStorage
- WebSocket via Finnhub for real-time stock price updates
- Command bar parses "TICKER FUNCTION" syntax (e.g., "AAPL GP")

## Commands
- `pnpm dev` — Start development server
- `pnpm build` — Production build
- `pnpm lint` — Run ESLint
```
