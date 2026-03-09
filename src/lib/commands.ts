import { FUNCTION_REGISTRY, TIMEFRAME_CONFIG, SECTORS } from "./constants";
import type { FunctionCode, CommandSuggestion, CommandQualifiers } from "./types";

/** Valid timeframe qualifiers for GP (Graph/Price) and other chart functions */
export const VALID_TIMEFRAMES = new Set(TIMEFRAME_CONFIG.map((t) => t.value));

/** Valid movers type qualifiers for MOST */
const VALID_MOVERS_TYPES = new Set(["gainers", "losers", "actives"]);

/** Valid exchange qualifiers for EQS */
const VALID_EXCHANGES = new Set(["NYSE", "NASDAQ", "AMEX"]);

/** Valid country qualifiers for EQS */
const VALID_COUNTRIES = new Set(["US", "CA", "GB", "DE", "FR", "JP", "CN", "HK"]);

const SECTOR_UPPER = new Map(SECTORS.map((s) => [s.toUpperCase(), s]));

function parseQualifierForFunction(funcCode: string, qualPart: string): CommandQualifiers | undefined {
  if (funcCode === "GP" && VALID_TIMEFRAMES.has(qualPart)) {
    return { timeframe: qualPart };
  }
  if (funcCode === "MOST" && VALID_MOVERS_TYPES.has(qualPart.toLowerCase())) {
    return { moversType: qualPart.toLowerCase() as "gainers" | "losers" | "actives" };
  }
  if (funcCode === "EQS") {
    if (SECTOR_UPPER.has(qualPart)) return { sector: SECTOR_UPPER.get(qualPart) };
    if (VALID_EXCHANGES.has(qualPart)) return { exchange: qualPart };
    if (VALID_COUNTRIES.has(qualPart)) return { country: qualPart };
    const limitNum = parseInt(qualPart, 10);
    if (!isNaN(limitNum) && limitNum >= 1 && limitNum <= 200) return { limit: limitNum };
  }
  return undefined;
}

export interface ParsedCommand {
  type: "function" | "security_function" | "security" | "unknown";
  functionCode?: FunctionCode;
  securityQuery?: string;
  qualifiers?: CommandQualifiers;
  raw: string;
}

export function parseCommand(input: string): ParsedCommand {
  const raw = input.trim().toUpperCase();
  if (!raw) return { type: "unknown", raw };

  const parts = raw.split(/\s+/);

  const exactFunction = FUNCTION_REGISTRY.find((f) => f.code === raw);
  if (exactFunction) {
    return { type: "function", functionCode: raw as FunctionCode, raw };
  }

  // FUNCTION QUALIFIER (e.g. GP 5Y, MOST gainers, EQS Technology) when security is in context
  if (parts.length === 2) {
    const [funcPart, qualPart] = parts;
    const funcMatch = FUNCTION_REGISTRY.find((f) => f.code === funcPart);
    if (funcMatch) {
      const qualifiers = parseQualifierForFunction(funcPart, qualPart);
      if (qualifiers) {
        return {
          type: "function",
          functionCode: funcPart as FunctionCode,
          qualifiers,
          raw,
        };
      }
    }
  }

  if (parts.length >= 2) {
    let funcPart: string;
    let securityQuery: string;
    let qualifiers: CommandQualifiers | undefined;

    const lastPart = parts[parts.length - 1];
    const secondLast = parts.length >= 3 ? parts[parts.length - 2] : "";

    // Check for qualifier: TICKER FUNCTION QUALIFIER (e.g. AAPL GP 5Y, AAPL MOST gainers, AAPL EQS Technology)
    if (parts.length >= 3 && secondLast) {
      const funcMatch = FUNCTION_REGISTRY.find((f) => f.code === secondLast);
      const parsedQualifiers = funcMatch ? parseQualifierForFunction(secondLast, lastPart) : undefined;
      if (funcMatch && parsedQualifiers) {
        funcPart = secondLast;
        securityQuery = parts.slice(0, -2).join(" ");
        qualifiers = parsedQualifiers;
      } else {
        funcPart = lastPart;
        securityQuery = parts.slice(0, -1).join(" ");
      }
    } else {
      funcPart = lastPart;
      securityQuery = parts.slice(0, -1).join(" ");
    }

    const funcMatch = FUNCTION_REGISTRY.find((f) => f.code === funcPart);
    if (funcMatch) {
      return {
        type: "security_function",
        functionCode: funcPart as FunctionCode,
        securityQuery,
        qualifiers,
        raw,
      };
    }
  }

  const equityMatch = raw.match(/^(.+?)\s+US\s+EQUITY\s+(\w+)$/);
  if (equityMatch) {
    const [, symbol, func] = equityMatch;
    const funcMatch = FUNCTION_REGISTRY.find((f) => f.code === func);
    if (funcMatch) {
      return {
        type: "security_function",
        functionCode: func as FunctionCode,
        securityQuery: symbol,
        raw,
      };
    }
  }

  return { type: "security", securityQuery: raw, raw };
}

export function getSuggestions(input: string): CommandSuggestion[] {
  const query = input.trim().toUpperCase();
  if (!query) return FUNCTION_REGISTRY.slice(0, 10);

  return FUNCTION_REGISTRY.filter(
    (f) =>
      f.code.includes(query) ||
      f.name.toUpperCase().includes(query) ||
      f.description.toUpperCase().includes(query)
  ).slice(0, 10);
}
