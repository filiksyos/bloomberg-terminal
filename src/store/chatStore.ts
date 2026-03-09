import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";

interface ChatState {
  messages: ChatMessage[];
  addMessage: (content: string, sender: string, type: ChatMessage["type"]) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [
        {
          id: "welcome",
          sender: "SYSTEM",
          content: "Welcome to IB (Instant Bloomberg). This is a simulated messaging environment for demonstration purposes.",
          timestamp: new Date().toISOString(),
          type: "system",
        },
      ],
      addMessage: (content, sender, type) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { id: nanoid(), sender, content, timestamp: new Date().toISOString(), type },
          ],
        })),
      clearMessages: () =>
        set({
          messages: [
            {
              id: "welcome",
              sender: "SYSTEM",
              content: "Chat history cleared.",
              timestamp: new Date().toISOString(),
              type: "system",
            },
          ],
        }),
    }),
    { name: "bloomberg-chat" }
  )
);
