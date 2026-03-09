"use client";
import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { useSecurityStore } from "@/store/securityStore";

interface WebSocketContextValue {
  subscribe: (symbol: string) => void;
  unsubscribe: (symbol: string) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  subscribe: () => {},
  unsubscribe: () => {},
  isConnected: false,
});

export function useWebSocketContext() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscribedSymbols = useRef(new Set<string>());
  const updateQuotePrice = useSecurityStore((s) => s.updateQuotePrice);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!apiKey) return;

    function connect() {
      const ws = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        subscribedSymbols.current.forEach((symbol) => {
          ws.send(JSON.stringify({ type: "subscribe", symbol }));
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "trade" && data.data) {
            data.data.forEach((trade: { s: string; p: number; t: number }) => {
              updateQuotePrice(trade.s, trade.p, trade.t);
            });
          }
        } catch {}
      };

      ws.onclose = () => {
        setIsConnected(false);
        reconnectTimeout.current = setTimeout(connect, 5000);
      };

      ws.onerror = () => setIsConnected(false);
    }

    connect();

    return () => {
      clearTimeout(reconnectTimeout.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [updateQuotePrice]);

  const subscribe = useCallback((symbol: string) => {
    subscribedSymbols.current.add(symbol);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "subscribe", symbol }));
    }
  }, []);

  const unsubscribe = useCallback((symbol: string) => {
    subscribedSymbols.current.delete(symbol);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "unsubscribe", symbol }));
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ subscribe, unsubscribe, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}
