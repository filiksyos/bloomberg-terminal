"use client";
import dynamic from "next/dynamic";
import type { FunctionCode, Security } from "@/lib/types";
import { LoadingState } from "@/components/data-display/LoadingState";

const Loading = () => <LoadingState />;

const DES = dynamic(() => import("@/components/functions/DES").then((m) => ({ default: m.DES })), { loading: Loading });
const GP = dynamic(() => import("@/components/functions/GP").then((m) => ({ default: m.GP })), { loading: Loading });
const FA = dynamic(() => import("@/components/functions/FA").then((m) => ({ default: m.FA })), { loading: Loading });
const ANR = dynamic(() => import("@/components/functions/ANR").then((m) => ({ default: m.ANR })), { loading: Loading });
const DVD = dynamic(() => import("@/components/functions/DVD").then((m) => ({ default: m.DVD })), { loading: Loading });
const ERN = dynamic(() => import("@/components/functions/ERN").then((m) => ({ default: m.ERN })), { loading: Loading });
const COMP = dynamic(() => import("@/components/functions/COMP").then((m) => ({ default: m.COMP })), { loading: Loading });
const RV = dynamic(() => import("@/components/functions/RV").then((m) => ({ default: m.RV })), { loading: Loading });
const TOP = dynamic(() => import("@/components/functions/TOP").then((m) => ({ default: m.TOP })), { loading: Loading });
const WEI = dynamic(() => import("@/components/functions/WEI").then((m) => ({ default: m.WEI })), { loading: Loading });
const MOST = dynamic(() => import("@/components/functions/MOST").then((m) => ({ default: m.MOST })), { loading: Loading });
const MOV = dynamic(() => import("@/components/functions/MOV").then((m) => ({ default: m.MOV })), { loading: Loading });
const WB = dynamic(() => import("@/components/functions/WB").then((m) => ({ default: m.WB })), { loading: Loading });
const CRVF = dynamic(() => import("@/components/functions/CRVF").then((m) => ({ default: m.CRVF })), { loading: Loading });
const FXCA = dynamic(() => import("@/components/functions/FXCA").then((m) => ({ default: m.FXCA })), { loading: Loading });
const FXMonitor = dynamic(() => import("@/components/functions/FXMonitor").then((m) => ({ default: m.FXMonitor })), { loading: Loading });
const CommodityDash = dynamic(() => import("@/components/functions/CommodityDash").then((m) => ({ default: m.CommodityDash })), { loading: Loading });
const ECO = dynamic(() => import("@/components/functions/ECO").then((m) => ({ default: m.ECO })), { loading: Loading });
const ECST = dynamic(() => import("@/components/functions/ECST").then((m) => ({ default: m.ECST })), { loading: Loading });
const CryptoDash = dynamic(() => import("@/components/functions/CryptoDash").then((m) => ({ default: m.CryptoDash })), { loading: Loading });
const PORT = dynamic(() => import("@/components/functions/PORT").then((m) => ({ default: m.PORT })), { loading: Loading });
const EQS = dynamic(() => import("@/components/functions/EQS").then((m) => ({ default: m.EQS })), { loading: Loading });
const OMON = dynamic(() => import("@/components/functions/OMON").then((m) => ({ default: m.OMON })), { loading: Loading });
const Heatmap = dynamic(() => import("@/components/functions/Heatmap").then((m) => ({ default: m.Heatmap })), { loading: Loading });
const Alerts = dynamic(() => import("@/components/functions/Alerts").then((m) => ({ default: m.Alerts })), { loading: Loading });
const IB = dynamic(() => import("@/components/functions/IB").then((m) => ({ default: m.IB })), { loading: Loading });
const Settings = dynamic(() => import("@/components/functions/Settings").then((m) => ({ default: m.Settings })), { loading: Loading });
const HELP = dynamic(() => import("@/components/functions/HELP").then((m) => ({ default: m.HELP })), { loading: Loading });
const Watchlist = dynamic(() => import("@/components/functions/Watchlist").then((m) => ({ default: m.Watchlist })), { loading: Loading });
const BQ = dynamic(() => import("@/components/functions/BQ").then((m) => ({ default: m.BQ })), { loading: Loading });
const CN = dynamic(() => import("@/components/functions/CN").then((m) => ({ default: m.CN })), { loading: Loading });
const MGMT = dynamic(() => import("@/components/functions/MGMT").then((m) => ({ default: m.MGMT })), { loading: Loading });
const GIP = dynamic(() => import("@/components/functions/GIP").then((m) => ({ default: m.GIP })), { loading: Loading });
const IPOScreen = dynamic(() => import("@/components/functions/IPO").then((m) => ({ default: m.IPO })), { loading: Loading });
const CACS = dynamic(() => import("@/components/functions/CACS").then((m) => ({ default: m.CACS })), { loading: Loading });
const SECF = dynamic(() => import("@/components/functions/SECF").then((m) => ({ default: m.SECF })), { loading: Loading });
const TRADE = dynamic(() => import("@/components/functions/TRADE").then((m) => ({ default: m.TRADE })), { loading: Loading });
const OMS = dynamic(() => import("@/components/functions/OMS").then((m) => ({ default: m.OMS })), { loading: Loading });
const BLOTTER = dynamic(() => import("@/components/functions/BLOTTER").then((m) => ({ default: m.BLOTTER })), { loading: Loading });

const FUNCTION_MAP: Record<FunctionCode, React.ComponentType<{ security?: Security | null }>> = {
  DES, GP, FA, ANR, DVD, ERN, COMP, RV,
  BQ, CN, MGMT, CACS,
  TOP, WEI, MOST, MOV, GIP, IPO: IPOScreen, SECF,
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
  TRADE,
  OMS,
  BLOTTER,
};

export function FunctionRouter({ functionCode, security }: { functionCode: FunctionCode; security: Security | null }) {
  const Component = FUNCTION_MAP[functionCode];
  if (!Component) return <div className="text-bloomberg-red p-4">UNKNOWN FUNCTION: {functionCode}</div>;
  return <Component security={security} />;
}
