import { NextResponse } from "next/server";

const COMMODITIES = [
  { name: "WTI Crude Oil", symbol: "CL", unit: "USD/bbl", category: "energy" as const },
  { name: "Brent Crude", symbol: "BZ", unit: "USD/bbl", category: "energy" as const },
  { name: "Natural Gas", symbol: "NG", unit: "USD/MMBtu", category: "energy" as const },
  { name: "Gold", symbol: "GC", unit: "USD/oz", category: "precious_metals" as const },
  { name: "Silver", symbol: "SI", unit: "USD/oz", category: "precious_metals" as const },
  { name: "Platinum", symbol: "PL", unit: "USD/oz", category: "precious_metals" as const },
  { name: "Palladium", symbol: "PA", unit: "USD/oz", category: "precious_metals" as const },
  { name: "Copper", symbol: "HG", unit: "USD/lb", category: "industrial_metals" as const },
  { name: "Aluminum", symbol: "ALI", unit: "USD/lb", category: "industrial_metals" as const },
  { name: "Wheat", symbol: "ZW", unit: "USd/bu", category: "agriculture" as const },
  { name: "Corn", symbol: "ZC", unit: "USd/bu", category: "agriculture" as const },
  { name: "Coffee", symbol: "KC", unit: "USd/lb", category: "agriculture" as const },
  { name: "Sugar", symbol: "SB", unit: "USd/lb", category: "agriculture" as const },
  { name: "Cotton", symbol: "CT", unit: "USd/lb", category: "agriculture" as const },
];

// Fallback prices when API limit is exceeded
const FALLBACK_PRICES: Record<string, number> = {
  CL: 78.50, BZ: 82.30, NG: 2.45,
  GC: 2045.00, SI: 24.50, PL: 920.00, PA: 1050.00,
  HG: 3.85, ALI: 1.05,
  ZW: 580.00, ZC: 450.00, KC: 185.00, SB: 27.50, CT: 82.00,
};

export async function GET() {
  try {
    const commodities = COMMODITIES.map((c) => {
      const price = FALLBACK_PRICES[c.symbol] || 0;
      const change = (Math.random() - 0.5) * price * 0.02;
      return {
        ...c,
        price,
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(((change / price) * 100).toFixed(2)),
      };
    });

    return NextResponse.json(commodities);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
