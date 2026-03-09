export type SecurityType = "equity" | "crypto" | "forex" | "commodity" | "index" | "bond";

export interface Security {
  symbol: string;
  name: string;
  type: SecurityType;
  exchange?: string;
  currency?: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  timestamp: number;
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
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FinancialStatement {
  date: string;
  period: string;
  [key: string]: string | number;
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

export interface CryptoAsset {
  id: string;
  symbol: string;
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

export interface ForexRate {
  pair: string;
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
  importance: 1 | 2 | 3;
  actual: number | null;
  estimate: number | null;
  previous: number | null;
  unit: string;
}

export interface YieldCurvePoint {
  maturity: string;
  yield: number;
  change: number;
  previousYield: number;
}

export interface CommodityPrice {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  unit: string;
  category: "energy" | "precious_metals" | "industrial_metals" | "agriculture";
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
  category: string;
  related: string;
}

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
  | "WATC"
  | "BQ" | "CN" | "MGMT" | "GIP" | "IPO" | "CACS" | "SECF"
  | "TRADE" | "OMS" | "BLOTTER";

export interface PanelTab {
  id: string;
  functionCode: FunctionCode;
  security: Security | null;
  title: string;
}

export interface PanelState {
  id: string;
  group: "A" | "B" | "C" | "D";
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

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: "user" | "system" | "received";
}

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

export interface IndexProxy {
  etf: string;
  name: string;
  region: "americas" | "emea" | "apac";
}

// --- Alpaca Trading Types ---

export type AlpacaOrderSide = "buy" | "sell";
export type AlpacaOrderType = "market" | "limit" | "stop" | "stop_limit";
export type AlpacaTimeInForce = "day" | "gtc" | "ioc" | "fok";
export type AlpacaOrderStatus =
  | "new"
  | "partially_filled"
  | "filled"
  | "done_for_day"
  | "canceled"
  | "expired"
  | "replaced"
  | "pending_cancel"
  | "pending_replace"
  | "accepted"
  | "pending_new"
  | "accepted_without_timestamp"
  | "stopped"
  | "rejected"
  | "suspended"
  | "calculated";

export interface AlpacaAccount {
  id: string;
  status: string;
  currency: string;
  buyingPower: number;
  cash: number;
  portfolioValue: number;
  equity: number;
  lastEquity: number;
  longMarketValue: number;
  shortMarketValue: number;
  daytradeCount: number;
  daytradingBuyingPower: number;
  patternDayTrader: boolean;
  tradingBlocked: boolean;
  transfersBlocked: boolean;
  accountBlocked: boolean;
}

export interface AlpacaPosition {
  assetId: string;
  symbol: string;
  exchange: string;
  assetClass: string;
  qty: number;
  side: string;
  avgEntryPrice: number;
  marketValue: number;
  costBasis: number;
  currentPrice: number;
  lastdayPrice: number;
  changeToday: number;
  unrealizedPl: number;
  unrealizedPlpc: number;
  unrealizedIntradayPl: number;
  unrealizedIntradayPlpc: number;
}

export interface AlpacaOrder {
  id: string;
  clientOrderId: string;
  symbol: string;
  qty: string | null;
  notional: string | null;
  filledQty: string;
  filledAvgPrice: string | null;
  side: AlpacaOrderSide;
  type: AlpacaOrderType;
  timeInForce: AlpacaTimeInForce;
  status: AlpacaOrderStatus;
  limitPrice: string | null;
  stopPrice: string | null;
  submittedAt: string;
  filledAt: string | null;
  canceledAt: string | null;
  expiredAt: string | null;
}

export interface AlpacaOrderRequest {
  symbol: string;
  qty?: number;
  notional?: number;
  side: AlpacaOrderSide;
  type: AlpacaOrderType;
  time_in_force: AlpacaTimeInForce;
  limit_price?: number;
  stop_price?: number;
}

export interface AlpacaPortfolioHistory {
  timestamp: number[];
  equity: number[];
  profitLoss: number[];
  profitLossPct: number[];
  baseValue: number;
  timeframe: string;
}
