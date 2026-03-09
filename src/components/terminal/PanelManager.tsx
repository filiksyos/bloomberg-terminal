"use client";
import { Panel } from "./Panel";
import { useTerminalStore } from "@/store/terminalStore";
import type { PanelState } from "@/lib/types";

export function PanelManager() {
  const { layout, panels, activePanelId, fullscreenPanelId } = useTerminalStore();

  if (fullscreenPanelId) {
    const panel = panels.find((p) => p.id === fullscreenPanelId);
    if (panel) {
      return (
        <div className="flex-1 overflow-hidden">
          <Panel panelState={panel} isActive={true} />
        </div>
      );
    }
  }

  const gridClass = getGridClass(layout);
  const visiblePanels = getVisiblePanels(layout, panels);

  return (
    <div className={`flex-1 overflow-hidden ${gridClass}`}>
      {visiblePanels.map((panel) => (
        <Panel
          key={panel.id}
          panelState={panel}
          isActive={panel.id === activePanelId}
        />
      ))}
    </div>
  );
}

function getGridClass(layout: string): string {
  switch (layout) {
    case "quad":
      return "grid grid-cols-2 grid-rows-2";
    case "single":
      return "grid grid-cols-1 grid-rows-1";
    case "dual-horizontal":
      return "grid grid-cols-2 grid-rows-1";
    case "dual-vertical":
      return "grid grid-cols-1 grid-rows-2";
    case "triple-left":
      return "grid grid-cols-[2fr_1fr] grid-rows-2";
    case "triple-right":
      return "grid grid-cols-[1fr_2fr] grid-rows-2";
    default:
      return "grid grid-cols-2 grid-rows-2";
  }
}

function getVisiblePanels(layout: string, panels: PanelState[]) {
  switch (layout) {
    case "single":
      return panels.slice(0, 1);
    case "dual-horizontal":
    case "dual-vertical":
      return panels.slice(0, 2);
    case "triple-left":
    case "triple-right":
      return panels.slice(0, 3);
    default:
      return panels.slice(0, 4);
  }
}
