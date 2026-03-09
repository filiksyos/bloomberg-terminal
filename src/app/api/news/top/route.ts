import { NextResponse } from "next/server";
import { getMarketNews } from "@/lib/api/finnhub";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || "general";
    const data = await getMarketNews(category);

    const articles = (data || []).slice(0, 50).map((a: Record<string, unknown>) => ({
      id: String(a.id || Math.random()),
      headline: a.headline || "",
      summary: a.summary || "",
      source: a.source || "",
      url: a.url || "",
      image: a.image || "",
      datetime: a.datetime || 0,
      category: a.category || category,
      related: a.related || "",
    }));

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
