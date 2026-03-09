import { NextResponse } from "next/server";
import { getCompanyNews } from "@/lib/api/finnhub";
import { format, subDays } from "date-fns";

export async function GET(_req: Request, { params }: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await params;
    const to = format(new Date(), "yyyy-MM-dd");
    const from = format(subDays(new Date(), 7), "yyyy-MM-dd");
    const data = await getCompanyNews(symbol.toUpperCase(), from, to);

    const articles = (data || []).slice(0, 30).map((a: Record<string, unknown>) => ({
      id: String(a.id || Math.random()),
      headline: a.headline || "",
      summary: a.summary || "",
      source: a.source || "",
      url: a.url || "",
      image: a.image || "",
      datetime: a.datetime || 0,
      category: a.category || "",
      related: a.related || symbol,
    }));

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
