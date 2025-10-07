"use client";

import { useEffect, useRef, useState } from "react";
import { sanitizeInput } from "@/lib/security";
import { api } from "@/lib/api";
import MessageBubble from "./Chat/MessageBubble";

/**
 * PUBLIC_INTERFACE
 * Chat panel with messages and input. Uses /api/chat mock backend.
 */
export default function ChatPanel() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hello! Ask a question about your uploaded materials." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function onSend() {
    const cleaned = sanitizeInput(input).trim();
    if (!cleaned) return;
    setLoading(true);
    setMessages((m) => [...m, { role: "user", content: cleaned }]);

    try {
      const res = await api.post<{ reply: string }>("/api/chat", { message: cleaned });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, there was an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }

  return (
    <div className="card p-0">
      <div
        role="log"
        aria-live="polite"
        aria-label="Chat transcript"
        className="max-h-[60vh] overflow-y-auto p-4 md:p-6 flex flex-col gap-3"
      >
        <div className="chat-container mx-auto w-full flex flex-col gap-3">
          {messages.map((m, idx) => (
            <MessageBubble key={idx} role={m.role}>
              {m.content}
            </MessageBubble>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <div className="px-4 md:px-6 py-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <input
            aria-label="Type your message"
            placeholder="Ask a question..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-md border px-3 py-2 focus-ring"
          />
          <button
            onClick={onSend}
            disabled={loading}
            className="u-transition rounded-md bg-[var(--color-primary)] text-white px-4 py-2 hover:bg-blue-700 disabled:opacity-60 focus-ring"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
