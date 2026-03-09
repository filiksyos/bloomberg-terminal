"use client";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { formatTime } from "@/lib/formatters";
import type { Security } from "@/lib/types";

export function IB({ security }: { security?: Security | null }) {
  void security;
  const messages = useChatStore((s) => s.messages);
  const addMessage = useChatStore((s) => s.addMessage);
  const clearMessages = useChatStore((s) => s.clearMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage(input.trim(), "USER", "user");

    // Handle /price command
    if (input.trim().startsWith("/price ")) {
      const sym = input.trim().split(" ")[1]?.toUpperCase();
      if (sym) {
        fetch(`/api/stocks/quote/${sym}`)
          .then(res => res.json())
          .then((data: { price?: number; change?: number; changePercent?: number; high?: number; low?: number }) => {
            if (data.price) {
              const chg = data.change ?? 0;
              const chgPct = data.changePercent ?? 0;
              const hi = data.high ?? 0;
              const lo = data.low ?? 0;
              addMessage(
                `${sym}: $${data.price.toFixed(2)} | Chg: ${chg >= 0 ? "+" : ""}${chg.toFixed(2)} (${chgPct >= 0 ? "+" : ""}${chgPct.toFixed(2)}%) | H: $${hi.toFixed(2)} L: $${lo.toFixed(2)}`,
                "SYSTEM",
                "system"
              );
            } else {
              addMessage(`Symbol not found: ${sym}`, "SYSTEM", "system");
            }
          })
          .catch(() => addMessage(`Failed to fetch price for ${sym}`, "SYSTEM", "system"));
        setInput("");
        return; // Don't trigger normal auto-response
      }
    }

    // Simulated auto-response
    setTimeout(() => {
      const responses = [
        "Message received. This is a simulated IB environment.",
        "Bloomberg IB: Your message has been noted.",
        "Auto-reply: Thank you for your message. This is a demo.",
        "IB System: Message logged successfully.",
      ];
      addMessage(responses[Math.floor(Math.random() * responses.length)], "SYSTEM", "system");
    }, 1000);

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 p-1 border-b border-bloomberg-border shrink-0">
        <div className="bb-section-header flex-1">INSTANT BLOOMBERG</div>
        <button onClick={clearMessages} className="bb-btn text-[10px]">CLEAR</button>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-1 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 text-xs ${msg.type === "system" ? "text-bloomberg-cyan" : msg.type === "user" ? "text-bloomberg-white" : "text-bloomberg-green"}`}>
            <span className="text-bloomberg-muted text-[10px] shrink-0 w-16">{formatTime(msg.timestamp)}</span>
            <span className="font-bold shrink-0 text-bloomberg-amber">{msg.sender}</span>
            <span className="break-words">{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-bloomberg-border p-2 shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bb-input flex-1"
            placeholder="Type a message..."
          />
          <button onClick={handleSend} className="bb-btn bb-btn-active px-3">SEND</button>
        </div>
      </div>
    </div>
  );
}
