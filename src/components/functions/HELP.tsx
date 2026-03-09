"use client";
import { FUNCTION_REGISTRY } from "@/lib/constants";
import { useSettingsStore } from "@/store/settingsStore";
import type { Security } from "@/lib/types";

export function HELP({ security }: { security?: Security | null }) {
  void security;
  const { finnhubKey, fmpKey, alphaVantageKey, fredKey, alpacaKeyId } = useSettingsStore();

  const categories = [...new Set(FUNCTION_REGISTRY.map((f) => f.category))];

  const apiStatuses = [
    { name: "Finnhub", configured: !!finnhubKey },
    { name: "FMP (Financial Modeling Prep)", configured: !!fmpKey },
    { name: "Alpha Vantage", configured: !!alphaVantageKey },
    { name: "FRED", configured: !!fredKey },
    { name: "CoinGecko", configured: true },
    { name: "ExchangeRate-API", configured: true },
    { name: "Alpaca (Paper Trading)", configured: !!alpacaKeyId },
  ];

  return (
    <div className="p-1 space-y-1 overflow-auto h-full">
      <div className="bb-section-header">BLOOMBERG TERMINAL HELP</div>

      <div className="border border-bloomberg-border p-1">
        <div className="text-bloomberg-amber font-bold text-sm mb-2">Quick Start</div>
        <div className="space-y-1 text-xs text-bloomberg-white">
          <div><span className="text-bloomberg-cyan">1.</span> Type a ticker symbol (e.g., AAPL) in the command bar and press Enter to set the security.</div>
          <div><span className="text-bloomberg-cyan">2.</span> Type a function code (e.g., DES, GP, FA) to view that function for the selected security.</div>
          <div><span className="text-bloomberg-cyan">3.</span> Combine: type <span className="text-bloomberg-amber">AAPL DES</span> to go directly to Apple&apos;s description page.</div>
          <div><span className="text-bloomberg-cyan">4.</span> Use the layout buttons in the status bar to change panel arrangement.</div>
        </div>
      </div>

      <div className="border border-bloomberg-border p-1">
        <div className="text-bloomberg-amber font-bold text-sm mb-2">Keyboard Shortcuts</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div><span className="text-bloomberg-cyan">Ctrl+1/2/3/4</span> - Switch panels</div>
          <div><span className="text-bloomberg-cyan">/</span> - Focus command bar</div>
          <div><span className="text-bloomberg-cyan">Escape</span> - Clear command bar</div>
          <div><span className="text-bloomberg-cyan">Up/Down</span> - Navigate command history</div>
        </div>
      </div>

      <div className="border border-bloomberg-border p-1">
        <div className="text-bloomberg-amber font-bold text-sm mb-2">Security Groups</div>
        <div className="text-xs text-bloomberg-white space-y-1">
          <div>Panels are assigned to security groups: <span className="text-bloomberg-cyan">A</span>, <span className="text-bloomberg-cyan">B</span>, <span className="text-bloomberg-cyan">C</span>, <span className="text-bloomberg-cyan">D</span></div>
          <div>Loading a security in one panel automatically updates all panels in the same group.</div>
          <div>Use the group badge in each panel header to see which group a panel belongs to.</div>
        </div>
      </div>

      <div className="border border-bloomberg-border p-1">
        <div className="text-bloomberg-amber font-bold text-sm mb-2">API Status</div>
        <table className="bb-table">
          <thead>
            <tr><th>API Provider</th><th className="text-center">Status</th></tr>
          </thead>
          <tbody>
            {apiStatuses.map((api) => (
              <tr key={api.name}>
                <td className="text-bloomberg-white">{api.name}</td>
                <td className="text-center">
                  {api.configured ? (
                    <span className="text-bloomberg-green font-bold">CONFIGURED</span>
                  ) : (
                    <span className="text-bloomberg-red font-bold">NOT CONFIGURED</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {categories.map((cat) => {
        const funcs = FUNCTION_REGISTRY.filter((f) => f.category === cat);
        return (
          <div key={cat} className="border border-bloomberg-border">
            <div className="bb-section-header">{cat.toUpperCase()}</div>
            <table className="bb-table">
              <thead>
                <tr><th>Code</th><th>Name</th><th>Description</th><th className="text-center">Requires Security</th></tr>
              </thead>
              <tbody>
                {funcs.map((f) => (
                  <tr key={f.code}>
                    <td className="text-bloomberg-amber font-bold">{f.code}</td>
                    <td className="text-bloomberg-white">{f.name}</td>
                    <td className="text-bloomberg-muted">{f.description}</td>
                    <td className="text-center">{f.requiresSecurity ? <span className="text-bloomberg-cyan">Yes</span> : <span className="text-bloomberg-muted">No</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      <div className="text-[10px] text-bloomberg-muted px-1 py-2">
        Bloomberg Terminal Clone - Built with Next.js, TypeScript, and Tailwind CSS.
        Data provided by Finnhub, FMP, CoinGecko, FRED, ExchangeRate-API, and Alpha Vantage.
      </div>
    </div>
  );
}
