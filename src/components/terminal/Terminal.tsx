"use client";
import { useEffect } from "react";
import { CommandBar } from "./CommandBar";
import { FunctionKeyBar } from "./FunctionKeyBar";
import { PanelManager } from "./PanelManager";
import { StatusBar } from "./StatusBar";
import { useTerminalStore } from "@/store/terminalStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export function Terminal() {
  const { panels, setActivePanelId } = useTerminalStore();
  useKeyboardShortcuts();

  useEffect(() => {
    if (panels.length > 0 && !useTerminalStore.getState().activePanelId) {
      setActivePanelId(panels[0].id);
    }
  }, [panels, setActivePanelId]);

  return (
    <div className="h-screen w-screen flex flex-col bg-bloomberg-black overflow-hidden font-mono">
      <CommandBar />
      <FunctionKeyBar />
      <PanelManager />
      <StatusBar />
    </div>
  );
}
