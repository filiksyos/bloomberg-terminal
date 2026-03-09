import { useEffect } from "react";
import { useWebSocketContext } from "@/providers/WebSocketProvider";

export function useWebSocket(symbols: string[]) {
  const { subscribe, unsubscribe, isConnected } = useWebSocketContext();
  useEffect(() => {
    symbols.forEach(subscribe);
    return () => symbols.forEach(unsubscribe);
  }, [symbols.join(","), subscribe, unsubscribe]);
  return { isConnected };
}
