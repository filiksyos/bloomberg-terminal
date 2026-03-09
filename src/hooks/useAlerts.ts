import { useEffect } from "react";
import { useAlertStore } from "@/store/alertStore";
import { useSecurityStore } from "@/store/securityStore";
import { toast } from "sonner";

export function useAlerts() {
  const alerts = useAlertStore((s) => s.alerts);
  const triggerAlert = useAlertStore((s) => s.triggerAlert);
  const quotes = useSecurityStore((s) => s.quotes);

  useEffect(() => {
    const interval = setInterval(() => {
      alerts.forEach((alert) => {
        if (!alert.enabled || alert.triggered) return;
        const quote = quotes[alert.symbol];
        if (!quote) return;

        let shouldTrigger = false;
        switch (alert.condition) {
          case "above":
            shouldTrigger = quote.price >= alert.value;
            break;
          case "below":
            shouldTrigger = quote.price <= alert.value;
            break;
          case "pct_change_above":
            shouldTrigger = Math.abs(quote.changePercent) >= alert.value;
            break;
          case "pct_change_below":
            shouldTrigger = Math.abs(quote.changePercent) <= alert.value;
            break;
        }

        if (shouldTrigger) {
          triggerAlert(alert.id);
          toast(`Alert: ${alert.symbol} ${alert.condition} ${alert.value}`, {
            description: `Current price: $${quote.price.toFixed(2)}`,
          });
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [alerts, quotes, triggerAlert]);
}
