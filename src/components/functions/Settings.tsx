"use client";
import { useState } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import type { Security } from "@/lib/types";

export function Settings({ security }: { security?: Security | null }) {
  void security;
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const toggleKey = (key: string) => setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  const {
    finnhubKey, fmpKey, alphaVantageKey, fredKey, alpacaKeyId, alpacaSecretKey,
    setApiKey,
    refreshInterval, flashPrices, compactMode, soundEnabled,
    setRefreshInterval, setFlashPrices, setCompactMode, setSoundEnabled,
  } = useSettingsStore();

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">TERMINAL SETTINGS</div>

      <div className="border border-bloomberg-border p-3 space-y-3">
        <div className="text-bloomberg-amber font-bold text-sm">API Keys</div>
        <div className="text-[10px] text-bloomberg-muted mb-2">
          API keys are stored locally in your browser. They are not sent to any external server.
        </div>
        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-bloomberg-muted block mb-1">Finnhub API Key</label>
            <div className="flex gap-1">
              <input type={showKeys.finnhub ? "text" : "password"} value={finnhubKey} onChange={(e) => setApiKey("finnhubKey", e.target.value)} className="bb-input w-80" placeholder="Enter Finnhub API key..." />
              <button onClick={() => toggleKey("finnhub")} className="bb-btn text-[10px]">{showKeys.finnhub ? "HIDE" : "SHOW"}</button>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-bloomberg-muted block mb-1">FMP API Key</label>
            <div className="flex gap-1">
              <input type={showKeys.fmp ? "text" : "password"} value={fmpKey} onChange={(e) => setApiKey("fmpKey", e.target.value)} className="bb-input w-80" placeholder="Enter FMP API key..." />
              <button onClick={() => toggleKey("fmp")} className="bb-btn text-[10px]">{showKeys.fmp ? "HIDE" : "SHOW"}</button>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-bloomberg-muted block mb-1">Alpha Vantage API Key</label>
            <div className="flex gap-1">
              <input type={showKeys.alphaVantage ? "text" : "password"} value={alphaVantageKey} onChange={(e) => setApiKey("alphaVantageKey", e.target.value)} className="bb-input w-80" placeholder="Enter Alpha Vantage API key..." />
              <button onClick={() => toggleKey("alphaVantage")} className="bb-btn text-[10px]">{showKeys.alphaVantage ? "HIDE" : "SHOW"}</button>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-bloomberg-muted block mb-1">FRED API Key</label>
            <div className="flex gap-1">
              <input type={showKeys.fred ? "text" : "password"} value={fredKey} onChange={(e) => setApiKey("fredKey", e.target.value)} className="bb-input w-80" placeholder="Enter FRED API key..." />
              <button onClick={() => toggleKey("fred")} className="bb-btn text-[10px]">{showKeys.fred ? "HIDE" : "SHOW"}</button>
            </div>
          </div>
          <div className="border-t border-bloomberg-border pt-2 mt-2">
            <div className="text-bloomberg-amber font-bold text-[11px] mb-1">Alpaca Trading (Paper)</div>
          </div>
          <div>
            <label className="text-[10px] text-bloomberg-muted block mb-1">Alpaca API Key ID</label>
            <div className="flex gap-1">
              <input type={showKeys.alpacaKey ? "text" : "password"} value={alpacaKeyId} onChange={(e) => setApiKey("alpacaKeyId", e.target.value)} className="bb-input w-80" placeholder="Enter Alpaca API Key ID..." />
              <button onClick={() => toggleKey("alpacaKey")} className="bb-btn text-[10px]">{showKeys.alpacaKey ? "HIDE" : "SHOW"}</button>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-bloomberg-muted block mb-1">Alpaca Secret Key</label>
            <div className="flex gap-1">
              <input type={showKeys.alpacaSecret ? "text" : "password"} value={alpacaSecretKey} onChange={(e) => setApiKey("alpacaSecretKey", e.target.value)} className="bb-input w-80" placeholder="Enter Alpaca Secret Key..." />
              <button onClick={() => toggleKey("alpacaSecret")} className="bb-btn text-[10px]">{showKeys.alpacaSecret ? "HIDE" : "SHOW"}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-bloomberg-border p-3 space-y-3">
        <div className="text-bloomberg-amber font-bold text-sm">Display</div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <label className="text-xs text-bloomberg-white w-48">Refresh Interval (seconds)</label>
            <input type="number" value={refreshInterval} onChange={(e) => setRefreshInterval(parseInt(e.target.value) || 15)} className="bb-input w-20" min="5" max="300" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-bloomberg-white w-48">Flash Price Changes</label>
            <button onClick={() => setFlashPrices(!flashPrices)} className={`bb-btn text-[10px] ${flashPrices ? "bb-btn-active" : ""}`}>
              {flashPrices ? "ON" : "OFF"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-bloomberg-white w-48">Compact Mode</label>
            <button onClick={() => setCompactMode(!compactMode)} className={`bb-btn text-[10px] ${compactMode ? "bb-btn-active" : ""}`}>
              {compactMode ? "ON" : "OFF"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-bloomberg-white w-48">Sound Alerts</label>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className={`bb-btn text-[10px] ${soundEnabled ? "bb-btn-active" : ""}`}>
              {soundEnabled ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>

      <div className="border border-bloomberg-border p-3 space-y-3">
        <div className="text-bloomberg-amber font-bold text-sm">Keyboard Shortcuts</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div><span className="text-bloomberg-cyan">/ or Escape</span> -- Focus/blur command bar</div>
          <div><span className="text-bloomberg-cyan">Ctrl+1/2/3/4</span> -- Focus panel 1-4</div>
          <div><span className="text-bloomberg-cyan">Ctrl+L</span> -- Cycle layout modes</div>
          <div><span className="text-bloomberg-cyan">Ctrl+W</span> -- Close active tab</div>
          <div><span className="text-bloomberg-cyan">Ctrl+T</span> -- New tab in active panel</div>
          <div><span className="text-bloomberg-cyan">F11 / Ctrl+Shift+F</span> -- Toggle fullscreen</div>
        </div>
      </div>

      <div className="text-[10px] text-bloomberg-muted px-1">
        Settings are persisted locally in your browser via localStorage.
      </div>
    </div>
  );
}
