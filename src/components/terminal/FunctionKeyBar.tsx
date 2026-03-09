"use client";
import { useTerminalStore } from "@/store/terminalStore";
import type { FunctionCode } from "@/lib/types";

const FUNCTION_KEYS: { num: number; label: string; code: FunctionCode }[] = [
  { num: 1, label: "HELP", code: "HELP" },
  { num: 2, label: "NEWS", code: "TOP" },
  { num: 3, label: "WEI", code: "WEI" },
  { num: 4, label: "PORT", code: "PORT" },
  { num: 5, label: "CMDTY", code: "CMDTY" },
  { num: 6, label: "WB", code: "WB" },
  { num: 7, label: "EQS", code: "EQS" },
  { num: 8, label: "GP", code: "GP" },
  { num: 9, label: "FXMON", code: "FXMON" },
  { num: 10, label: "MOST", code: "MOST" },
  { num: 11, label: "CRYPTO", code: "CRYPTO" },
  { num: 12, label: "ECO", code: "ECO" },
];

export function FunctionKeyBar() {
  const activePanelId = useTerminalStore((s) => s.activePanelId);
  const panels = useTerminalStore((s) => s.panels);
  const navigateToFunction = useTerminalStore((s) => s.navigateToFunction);

  const handleClick = (code: FunctionCode) => {
    const panel = panels.find((p) => p.id === activePanelId);
    if (!panel) return;
    const activeTab = panel.tabs.find((t) => t.id === panel.activeTabId);
    navigateToFunction(activePanelId, code, activeTab?.security || null);
  };

  return (
    <div className="bb-fn-bar shrink-0">
      {FUNCTION_KEYS.map((fk) => (
        <div
          key={fk.num}
          className="bb-fn-key"
          onClick={() => handleClick(fk.code)}
        >
          <span className="fn-num">{fk.num})</span>
          <span className="fn-label">{fk.label}</span>
        </div>
      ))}
    </div>
  );
}
