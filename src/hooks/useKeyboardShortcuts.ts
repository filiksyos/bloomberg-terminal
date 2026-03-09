import { useEffect } from "react";
import { useTerminalStore } from "@/store/terminalStore";

export function useKeyboardShortcuts() {
  const panels = useTerminalStore((s) => s.panels);
  const setActivePanelId = useTerminalStore((s) => s.setActivePanelId);
  const setFullscreenPanel = useTerminalStore((s) => s.setFullscreenPanel);
  const fullscreenPanelId = useTerminalStore((s) => s.fullscreenPanelId);
  const activePanelId = useTerminalStore((s) => s.activePanelId);
  const closeTab = useTerminalStore((s) => s.closeTab);
  const addTab = useTerminalStore((s) => s.addTab);
  const layout = useTerminalStore((s) => s.layout);
  const setLayout = useTerminalStore((s) => s.setLayout);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // "/" focuses command bar
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        const active = document.activeElement;
        if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA") return;
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>('[placeholder*="command"]');
        input?.focus();
        return;
      }

      // Escape blurs command bar
      if (e.key === "Escape") {
        (document.activeElement as HTMLElement)?.blur();
        return;
      }

      // Ctrl+1-4: Focus panel
      if (e.ctrlKey && !e.shiftKey && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        const idx = parseInt(e.key) - 1;
        if (panels[idx]) setActivePanelId(panels[idx].id);
        return;
      }

      // Ctrl+Shift+F or F11: Toggle fullscreen
      if ((e.ctrlKey && e.shiftKey && e.key === "F") || e.key === "F11") {
        e.preventDefault();
        setFullscreenPanel(fullscreenPanelId ? null : activePanelId);
        return;
      }

      // Ctrl+L: Cycle layout
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        const layouts = ["quad", "single", "dual-horizontal", "dual-vertical"] as const;
        const idx = layouts.indexOf(layout as typeof layouts[number]);
        setLayout(layouts[(idx + 1) % layouts.length]);
        return;
      }

      // Ctrl+W: Close active tab
      if (e.ctrlKey && e.key === "w") {
        e.preventDefault();
        const panel = panels.find((p) => p.id === activePanelId);
        if (panel) closeTab(panel.id, panel.activeTabId);
        return;
      }

      // Ctrl+T: New tab
      if (e.ctrlKey && e.key === "t") {
        e.preventDefault();
        addTab(activePanelId, "TOP", null);
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [panels, activePanelId, fullscreenPanelId, layout, setActivePanelId, setFullscreenPanel, closeTab, addTab, setLayout]);
}
