"use client";
import { useState, useEffect } from "react";
import { useWebSocketContext } from "@/providers/WebSocketProvider";
import { useTerminalStore } from "@/store/terminalStore";

export function StatusBar() {
  const [time, setTime] = useState(new Date());
  const { isConnected } = useWebSocketContext();
  const layout = useTerminalStore((s) => s.layout);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const markets = getMarketStatuses(time);

  return (
    <div className="h-5 bg-bloomberg-panel border-t border-bloomberg-border flex items-center px-2 gap-4 text-[9px] font-mono shrink-0">
      {markets.map((m) => (
        <span key={m.name} className={m.open ? "text-bloomberg-green" : "text-bloomberg-red"}>
          {m.name}: {m.open ? "OPEN" : "CLOSED"}
        </span>
      ))}
      <span className="text-bloomberg-muted">
        {time.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour12: false })} ET
      </span>
      <span className="flex items-center gap-1">
        <span className={`w-1 h-1 rounded-full ${isConnected ? "bg-bloomberg-green" : "bg-bloomberg-red"}`} />
        <span className="text-bloomberg-muted">{isConnected ? "LIVE" : "DISC"}</span>
      </span>
      <span className="text-bloomberg-muted uppercase">{layout}</span>
      <span className="ml-auto text-bloomberg-muted">
        {time.toLocaleDateString("en-US", { timeZone: "America/New_York", weekday: "short", month: "short", day: "numeric", year: "numeric" })}
      </span>
    </div>
  );
}

function getMarketStatuses(now: Date): { name: string; open: boolean }[] {
  return [
    { name: "NYSE", open: checkMarket(now, "America/New_York", 570, 960) },
    { name: "LSE", open: checkMarket(now, "Europe/London", 480, 990) },
    { name: "TSE", open: checkMarket(now, "Asia/Tokyo", 540, 900) },
    { name: "HKEX", open: checkMarket(now, "Asia/Hong_Kong", 570, 960) },
  ];
}

function checkMarket(now: Date, tz: string, openMin: number, closeMin: number): boolean {
  const local = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const day = local.getDay();
  if (day === 0 || day === 6) return false;
  const timeNum = local.getHours() * 60 + local.getMinutes();
  return timeNum >= openMin && timeNum < closeMin;
}
