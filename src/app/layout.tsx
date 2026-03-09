import type { Metadata } from "next";
import { QueryProvider } from "@/providers/QueryProvider";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloomberg Terminal",
  description: "Bloomberg Terminal Clone",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <WebSocketProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#111111",
                  color: "#e0e0e0",
                  border: "1px solid #333333",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                },
              }}
            />
          </WebSocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
