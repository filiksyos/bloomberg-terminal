import { NextResponse } from "next/server";
import { convertCurrency } from "@/lib/api/exchangerate";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const from = url.searchParams.get("from") || "USD";
    const to = url.searchParams.get("to") || "EUR";
    const amount = parseFloat(url.searchParams.get("amount") || "1");
    const result = await convertCurrency(from, to, amount);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
