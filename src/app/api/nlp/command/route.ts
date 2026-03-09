import { NextResponse } from "next/server";
import { FUNCTION_REGISTRY, TIMEFRAME_CONFIG } from "@/lib/constants";

const VALID_TIMEFRAME_VALUES = TIMEFRAME_CONFIG.map((t) => t.value).join(", ");

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "no_key" });
    }

    const { query } = await req.json();

    const commandList = FUNCTION_REGISTRY.map((entry) => {
      const suffix = entry.requiresSecurity
        ? ` — requires a security ticker prefix (e.g. AAPL ${entry.code})`
        : " — standalone, no ticker needed";
      const qualifierNote = entry.code === "GP" ? " — supports optional timeframe qualifier (e.g. AAPL GP 5Y)" : "";
      return `${entry.code}${suffix}${qualifierNote}: ${entry.description}`;
    }).join("\n");

    const systemPrompt = `You are a Bloomberg Terminal command parser. Output ONLY a valid Bloomberg command string. No explanation, no punctuation, no surrounding text.

Valid commands (output exactly one of these formats):
${commandList}

Qualifiers (optional, for GP/Graph only):
- Timeframe: ${VALID_TIMEFRAME_VALUES}
- Use when user asks for a chart over a period (e.g. "last 5 years", "5 day chart", "year to date")

Output format examples:
- AAPL GP (ticker + space + function code for security-required functions)
- AAPL GP 5Y (ticker + function + timeframe qualifier for chart time range)
- AAPL GP 1D (intraday / 1 day chart)
- FXCA (function code only for standalone functions)
- TOP (function code only)
- AAPL DES (ticker + space + function code)

Output only the command string, nothing else.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        error: "api_error",
        message: response.statusText,
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const command = typeof content === "string" ? content.trim() : "";

    let confidence = 0.9;
    const choice = data.choices?.[0];
    if (choice?.logprobs?.content && Array.isArray(choice.logprobs.content)) {
      const probs = choice.logprobs.content
        .map((t: { logprob?: number }) =>
          typeof t?.logprob === "number" ? Math.exp(t.logprob) : 0
        )
        .filter((p: number) => p > 0);
      if (probs.length > 0) {
        const avg = probs.reduce((a: number, b: number) => a + b, 0) / probs.length;
        confidence = Math.min(0.99, Math.max(0.5, avg));
      }
    }

    return NextResponse.json({ command, confidence });
  } catch (error) {
    return NextResponse.json({
      error: "api_error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
