import { FUNCTION_REGISTRY } from "./constants";
import type { FunctionCode, CommandSuggestion } from "./types";

export interface ParsedCommand {
  type: "function" | "security_function" | "security" | "unknown";
  functionCode?: FunctionCode;
  securityQuery?: string;
  raw: string;
}

export function parseCommand(input: string): ParsedCommand {
  const raw = input.trim().toUpperCase();
  if (!raw) return { type: "unknown", raw };

  const exactFunction = FUNCTION_REGISTRY.find((f) => f.code === raw);
  if (exactFunction) {
    return { type: "function", functionCode: raw as FunctionCode, raw };
  }

  const parts = raw.split(/\s+/);
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    const funcMatch = FUNCTION_REGISTRY.find((f) => f.code === lastPart);
    if (funcMatch) {
      const securityQuery = parts.slice(0, -1).join(" ");
      return {
        type: "security_function",
        functionCode: lastPart as FunctionCode,
        securityQuery,
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
