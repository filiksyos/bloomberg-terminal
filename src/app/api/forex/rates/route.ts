import { NextResponse } from "next/server";
import { getLatestRates } from "@/lib/api/exchangerate";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const base = url.searchParams.get("base") || "USD";
    const data = await getLatestRates(base);
    return NextResponse.json({ base: data.base_code || base, rates: data.rates || {} });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
