"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { parseCommand, getSuggestions } from "@/lib/commands";
import { useTerminalStore } from "@/store/terminalStore";
import { useSecurityStore } from "@/store/securityStore";
import { debounce } from "@/lib/utils";
import type { Security, CommandSuggestion } from "@/lib/types";

export function CommandBar() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<CommandSuggestion[]>([]);
  const [searchResults, setSearchResults] = useState<{ symbol: string; description: string; type: string }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const activePanelId = useTerminalStore((s) => s.activePanelId);
  const panels = useTerminalStore((s) => s.panels);
  const navigateToFunction = useTerminalStore((s) => s.navigateToFunction);
  const addCommandToHistory = useTerminalStore((s) => s.addCommandToHistory);
  const commandHistory = useTerminalStore((s) => s.commandHistory);
  const setActivePanelId = useTerminalStore((s) => s.setActivePanelId);
  const setCommandFocused = useTerminalStore((s) => s.setCommandFocused);
  const setGroupSecurity = useSecurityStore((s) => s.setGroupSecurity);

  const activePanel = panels.find((p) => p.id === activePanelId);

  const debouncedSearch = useCallback(
    debounce(async (q: string) => {
      if (q.length < 2) return;
      try {
        const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSearchResults(data.results?.slice(0, 5) || []);
      } catch {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (!input.trim()) {
      setShowDropdown(false);
      setSuggestions([]);
      setSearchResults([]);
      return;
    }
    const funcSuggestions = getSuggestions(input);
    setSuggestions(funcSuggestions);
    setShowDropdown(true);
    setSelectedIndex(0);
    debouncedSearch(input);
  }, [input, debouncedSearch]);

  async function resolveSecurity(query: string): Promise<Security | null> {
    try {
      const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.results?.length > 0) {
        const match = data.results[0];
        return {
          symbol: match.symbol,
          name: match.description || match.symbol,
          type: "equity",
          exchange: match.displaySymbol,
        };
      }
    } catch {}
    return null;
  }

  async function executeCommand() {
    if (!input.trim()) return;
    const parsed = parseCommand(input);
    if (!activePanel) return;

    addCommandToHistory(input);

    if (parsed.type === "function" && parsed.functionCode) {
      const currentTab = activePanel.tabs.find((t) => t.id === activePanel.activeTabId);
      navigateToFunction(activePanelId, parsed.functionCode, currentTab?.security || null);
    } else if (parsed.type === "security_function" && parsed.functionCode && parsed.securityQuery) {
      const security = await resolveSecurity(parsed.securityQuery);
      if (security) {
        setGroupSecurity(activePanel.group, security);
        navigateToFunction(activePanelId, parsed.functionCode, security);
      }
    } else if (parsed.type === "security" && parsed.securityQuery) {
      const security = await resolveSecurity(parsed.securityQuery);
      if (security) {
        setGroupSecurity(activePanel.group, security);
        navigateToFunction(activePanelId, "DES", security);
      }
    }

    setInput("");
    setShowDropdown(false);
    setHistoryIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const totalItems = suggestions.length + searchResults.length;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, totalItems - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!showDropdown && input === "" && commandHistory.length > 0) {
        const newIdx = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIdx);
        setInput(commandHistory[newIdx]);
        return;
      }
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showDropdown && totalItems > 0 && selectedIndex < suggestions.length) {
        const selected = suggestions[selectedIndex];
        setInput(selected.code);
        setShowDropdown(false);
        return;
      }
      executeCommand();
    } else if (e.key === "Escape") {
      setInput("");
      setShowDropdown(false);
      inputRef.current?.blur();
    } else if (e.key === "Tab" && showDropdown && suggestions.length > 0) {
      e.preventDefault();
      const selected = suggestions[selectedIndex];
      setInput(selected.code + " ");
    }
  }

  function selectSuggestion(code: string) {
    setInput(code);
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  return (
    <div className="relative bg-bloomberg-panel border-b border-bloomberg-border shrink-0">
      <div className="flex items-center h-7 px-2 gap-2">
        <span className="text-bloomberg-brand-green font-bold text-[10px] tracking-widest shrink-0">
          BLOOMBERG
        </span>
        <span className="text-bloomberg-brand-green shrink-0 text-[10px]">{">"}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setCommandFocused(true)}
          onBlur={() => setTimeout(() => { setCommandFocused(false); setShowDropdown(false); }, 200)}
          placeholder="Enter command or security..."
          className="flex-1 bg-transparent text-bloomberg-amber font-mono text-[11px] outline-none placeholder:text-bloomberg-muted caret-bloomberg-amber"
          autoComplete="off"
          spellCheck={false}
        />
        <span className="text-bloomberg-amber text-[9px] font-bold shrink-0 opacity-60">GO</span>
        <div className="flex gap-1 shrink-0">
          {(["A", "B", "C", "D"] as const).map((group) => (
            <button
              key={group}
              onClick={() => {
                const panel = panels.find((p) => p.group === group);
                if (panel) setActivePanelId(panel.id);
              }}
              className={`w-4 h-4 flex items-center justify-center text-[9px] font-bold border ${
                activePanel?.group === group
                  ? "bg-bloomberg-amber text-bloomberg-black border-bloomberg-amber"
                  : "bg-bloomberg-panel-alt text-bloomberg-muted border-bloomberg-border hover:border-bloomberg-amber"
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {showDropdown && (suggestions.length > 0 || searchResults.length > 0) && (
        <div className="absolute top-8 left-0 right-0 z-50 bg-bloomberg-panel border border-bloomberg-border max-h-64 overflow-y-auto shadow-lg">
          {suggestions.map((s, i) => (
            <div
              key={s.code}
              onMouseDown={() => selectSuggestion(s.code)}
              className={`flex items-center gap-3 px-3 py-1.5 cursor-pointer text-xs ${
                i === selectedIndex ? "bg-bloomberg-amber text-bloomberg-black" : "hover:bg-bloomberg-panel-alt"
              }`}
            >
              <span className="font-bold w-12">{s.code}</span>
              <span className={i === selectedIndex ? "text-bloomberg-black" : "text-bloomberg-white"}>{s.name}</span>
              <span className={`ml-auto ${i === selectedIndex ? "text-bloomberg-black/70" : "text-bloomberg-muted"}`}>
                {s.description}
              </span>
            </div>
          ))}
          {searchResults.length > 0 && (
            <>
              <div className="bb-section-header">Securities</div>
              {searchResults.map((r, i) => {
                const idx = suggestions.length + i;
                return (
                  <div
                    key={r.symbol}
                    onMouseDown={() => selectSuggestion(r.symbol)}
                    className={`flex items-center gap-3 px-3 py-1.5 cursor-pointer text-xs ${
                      idx === selectedIndex ? "bg-bloomberg-amber text-bloomberg-black" : "hover:bg-bloomberg-panel-alt"
                    }`}
                  >
                    <span className="font-bold w-12">{r.symbol}</span>
                    <span className={idx === selectedIndex ? "text-bloomberg-black" : "text-bloomberg-white"}>
                      {r.description}
                    </span>
                    <span className={`ml-auto ${idx === selectedIndex ? "text-bloomberg-black/70" : "text-bloomberg-muted"}`}>
                      {r.type}
                    </span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
