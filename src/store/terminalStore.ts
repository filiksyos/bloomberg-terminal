import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PanelState, FunctionCode, LayoutMode, Security } from "@/lib/types";
import { nanoid } from "@/lib/utils";

interface TerminalState {
  layout: LayoutMode;
  setLayout: (layout: LayoutMode) => void;
  panels: PanelState[];
  activePanelId: string;
  fullscreenPanelId: string | null;
  setActivePanelId: (id: string) => void;
  setFullscreenPanel: (id: string | null) => void;
  addTab: (panelId: string, functionCode: FunctionCode, security: Security | null) => void;
  closeTab: (panelId: string, tabId: string) => void;
  setActiveTab: (panelId: string, tabId: string) => void;
  navigateToFunction: (panelId: string, functionCode: FunctionCode, security: Security | null) => void;
  commandBarFocused: boolean;
  setCommandFocused: (focused: boolean) => void;
  commandHistory: string[];
  addCommandToHistory: (cmd: string) => void;
}

function createDefaultPanels(): PanelState[] {
  const groups: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];
  return groups.map((group) => {
    const tabId = nanoid();
    return {
      id: nanoid(),
      group,
      tabs: [{ id: tabId, functionCode: "TOP" as FunctionCode, security: null, title: "TOP" }],
      activeTabId: tabId,
    };
  });
}

export const useTerminalStore = create<TerminalState>()(
  persist(
    (set) => ({
      layout: "quad",
      setLayout: (layout) => set({ layout }),

      panels: createDefaultPanels(),
      activePanelId: "",
      fullscreenPanelId: null,
      setActivePanelId: (id) => set({ activePanelId: id }),
      setFullscreenPanel: (id) => set({ fullscreenPanelId: id }),

      addTab: (panelId, functionCode, security) => {
        const tabId = nanoid();
        const title = security ? `${security.symbol} ${functionCode}` : functionCode;
        set((state) => ({
          panels: state.panels.map((p) =>
            p.id === panelId
              ? {
                  ...p,
                  tabs: [...p.tabs, { id: tabId, functionCode, security, title }],
                  activeTabId: tabId,
                }
              : p
          ),
        }));
      },

      closeTab: (panelId, tabId) => {
        set((state) => ({
          panels: state.panels.map((p) => {
            if (p.id !== panelId) return p;
            const newTabs = p.tabs.filter((t) => t.id !== tabId);
            if (newTabs.length === 0) {
              const newTabId = nanoid();
              return {
                ...p,
                tabs: [{ id: newTabId, functionCode: "TOP" as FunctionCode, security: null, title: "TOP" }],
                activeTabId: newTabId,
              };
            }
            return {
              ...p,
              tabs: newTabs,
              activeTabId: p.activeTabId === tabId ? newTabs[newTabs.length - 1].id : p.activeTabId,
            };
          }),
        }));
      },

      setActiveTab: (panelId, tabId) => {
        set((state) => ({
          panels: state.panels.map((p) =>
            p.id === panelId ? { ...p, activeTabId: tabId } : p
          ),
        }));
      },

      navigateToFunction: (panelId, functionCode, security) => {
        set((state) => ({
          panels: state.panels.map((p) => {
            if (p.id !== panelId) return p;
            const activeTab = p.tabs.find((t) => t.id === p.activeTabId);
            if (!activeTab) return p;
            const title = security ? `${security.symbol} ${functionCode}` : functionCode;
            return {
              ...p,
              tabs: p.tabs.map((t) =>
                t.id === p.activeTabId ? { ...t, functionCode, security, title } : t
              ),
            };
          }),
        }));
      },

      commandBarFocused: false,
      setCommandFocused: (focused) => set({ commandBarFocused: focused }),
      commandHistory: [],
      addCommandToHistory: (cmd) => {
        set((state) => ({
          commandHistory: [cmd, ...state.commandHistory.filter((c) => c !== cmd)].slice(0, 50),
        }));
      },
    }),
    { name: "bloomberg-terminal", partialize: (state) => ({ layout: state.layout, commandHistory: state.commandHistory }) }
  )
);
