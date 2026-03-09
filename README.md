# Bloomberg Terminal Clone

A web-based Bloomberg Terminal clone with real-time market data, technical analysis, and paper trading. Built with Next.js 15, TypeScript, and Tailwind CSS.

![License](https://img.shields.io/badge/license-MIT-blue)

## Features

**39 function screens** covering the core Bloomberg Terminal workflow:

| Category | Functions |
|----------|-----------|
| **Equity Analysis** | DES (Description), GP (Graph/Price), FA (Financial Analysis), ANR (Analyst Recommendations), DVD (Dividends), ERN (Earnings), COMP (Comparables), RV (Relative Value), BQ (Bloomberg Quote), CN (Company News), MGMT (Management), MOV (Price Movement), CACS (Corporate Actions) |
| **Market Overview** | TOP (Top News), WEI (World Equity Indices), MOST (Most Active), GIP (Sector Performance), IPO (IPO Calendar), HMAP (Heat Map) |
| **Trading** | TRADE (Order Entry), OMS (Order Management), BLOTTER (Trade Blotter / Positions & P&L) |
| **Fixed Income** | WB (World Bond Markets), CRVF (Yield Curve) |
| **Foreign Exchange** | FXCA (FX Calculator), FXMON (FX Monitor) |
| **Commodities** | CMDTY (Commodity Dashboard -- energy, metals, agriculture) |
| **Crypto** | CRYPTO (Cryptocurrency prices and market data) |
| **Economics** | ECO (Economic Calendar), ECST (Economic Statistics) |
| **Portfolio & Tools** | PORT (Portfolio Manager), EQS (Equity Screener), OMON (Options Monitor), ALRT (Alerts), WATC (Watchlist), SECF (Security Finder) |
| **Communication** | IB (Instant Bloomberg chat) |
| **System** | SET (Settings), HELP (Function reference) |

**Terminal features:**
- Bloomberg-authentic UI with amber/cyan/blue color palette on black
- `TICKER FUNCTION` command syntax (e.g., `AAPL GP`, `MSFT FA`)
- Quad/single/dual/triple panel layouts with tab management
- Security group linking (A/B/C/D)
- F1-F12 function key bar for quick navigation
- Real-time price streaming via WebSocket (Finnhub)
- Alpaca paper trading integration with order entry, order management, and position tracking

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State**: Zustand v5 with persist middleware
- **Data Fetching**: TanStack Query v5
- **Charts**: lightweight-charts v5, Recharts
- **Real-time**: WebSocket (Finnhub)
- **Trading**: Alpaca Markets API (paper trading)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
git clone git@github.com:aravhawk/bloomberg-terminal.git
cd bloomberg-terminal
pnpm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Market Data (required)
FINNHUB_API_KEY=           # https://finnhub.io/register
FMP_API_KEY=               # https://site.financialmodelingprep.com/register
FRED_API_KEY=              # https://fred.stlouisfed.org/docs/api/api_key.html
ALPHA_VANTAGE_API_KEY=     # https://www.alphavantage.co/support/#api-key
NEXT_PUBLIC_FINNHUB_API_KEY=  # Same as FINNHUB_API_KEY (for WebSocket)

# Trading (optional)
ALPACA_API_KEY_ID=         # https://alpaca.markets (free paper trading)
ALPACA_API_SECRET_KEY=
ALPACA_TRADING_ENV=paper   # "paper" or "live"
```

CoinGecko and ExchangeRate-API are free with no key required.

### Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build
pnpm start
```

## Usage

Type commands in the command bar at the top:

| Command | Action |
|---------|--------|
| `AAPL` | Load Apple as the active security |
| `AAPL GP` | Open Apple's price chart |
| `FA` | Open Financial Analysis for the current security |
| `TRADE` | Open order entry for the current security |
| `OMS` | Open order management system |
| `BLOTTER` | Open trade blotter (positions & P&L) |
| `TOP` | Top market news |
| `CRYPTO` | Cryptocurrency dashboard |
| `CMDTY` | Commodities dashboard |
| `HELP` | Function reference |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` or `Escape` | Focus/blur command bar |
| `Ctrl+1/2/3/4` | Focus panel 1-4 |
| `Ctrl+L` | Cycle layout modes |
| `Ctrl+T` | New tab in active panel |
| `Ctrl+W` | Close active tab |

## License

[MIT](LICENSE)
