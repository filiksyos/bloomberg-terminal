import { NextResponse } from "next/server";
import { getCompanyPeers, getQuote, getBasicFinancials } from "@/lib/api/finnhub";

export async function GET(_req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const sym = symbol.toUpperCase();
    const peers = await getCompanyPeers(sym);
    const peerList = (peers || []).filter((p: string) => p !== sym).slice(0, 10);

    const peerData = await Promise.all(
      peerList.map(async (peer: string) => {
        try {
          const [quote, metrics] = await Promise.all([
            getQuote(peer),
            getBasicFinancials(peer),
          ]);
          const m = metrics?.metric || {};
          return {
            symbol: peer,
            price: quote.c,
            change: quote.d,
            changePercent: quote.dp,
            marketCap: m["marketCapitalization"] || 0,
            peRatio: m["peNormalizedAnnual"] || 0,
            pbRatio: m["pbAnnual"] || 0,
            dividendYield: m["dividendYieldIndicatedAnnual"] || 0,
            beta: m["beta"] || 0,
            roe: m["roeTTM"] || 0,
            week52High: m["52WeekHigh"] || 0,
            week52Low: m["52WeekLow"] || 0,
          };
        } catch {
          return { symbol: peer, price: 0, change: 0, changePercent: 0 };
        }
      })
    );

    return NextResponse.json({ peers: peerList, peerData });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
