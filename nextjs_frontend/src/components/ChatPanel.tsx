"use client";

import { useEffect, useRef, useState } from "react";
import { sanitizeInput } from "@/lib/security";
import { api } from "@/lib/api";

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
    <div className="card p-4 md:p-6">
      <div
        role="log"
        aria-label="Chat transcript"
        className="h-[50vh] overflow-y-auto space-y-3 border-b pb-4"
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] rounded-lg px-3 py-2 ${
              m.role === "assistant"
                ? "bg-blue-50 text-blue-900"
                : "bg-gray-100 text-gray-900 ml-auto"
            }`}
          >
            <p className="text-sm leading-relaxed">{m.content}</p>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="pt-4 flex items-center gap-2">
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
          className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 disabled:opacity-60 focus-ring"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
