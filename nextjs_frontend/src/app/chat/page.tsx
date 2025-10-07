"use client";

import React, { useEffect, useRef, useState } from "react";
import AppShell from "@/components/AppShell";
import MessageBubble from "@/components/Chat/MessageBubble";
import Composer from "@/components/Chat/Composer";
import { api } from "@/lib/api";
import { sanitizeInput } from "@/lib/security";

/**
 * PUBLIC_INTERFACE
 * /chat – ChatGPT-like chat layout with:
 * - Centered, scrollable message panel
 * - Assistant and user bubble variants
 * - Sticky composer with quick actions and Enter-to-send behavior
 */
export default function ChatPage() {
  const [messages, setMessages] = useState<
    { role: "assistant" | "user" | "system"; content: string }[]
  >([
    { role: "assistant", content: "Hello! Ask a question about your uploaded materials." },
  ]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(text: string) {
    const cleaned = sanitizeInput(text).trim();
    if (!cleaned) return;
    setMessages((m) => [...m, { role: "user", content: cleaned }]);
    try {
      const res = await api.post<{ reply: string }>("/api/chat", { message: cleaned });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, there was an error. Please try again." },
      ]);
    }
  }

  function onAttach(files: File[]) {
    if (!files.length) return;
    setMessages((m) => [
      ...m,
      {
        role: "system",
        content: `Attached ${files.length} file(s): ${files.map((f) => f.name).join(", ")}`,
      },
    ]);
  }

  return (
    <AppShell>
      <section className="space-y-4">
        <div className="rounded-xl gradient-bg p-6 card">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Chat</h1>
          <p className="mt-2 text-gray-600">
            Engage in Socratic dialogue guided by your course materials.
          </p>
        </div>

        <div className="card p-0">
          <div
            role="log"
            aria-live="polite"
            aria-label="Chat transcript"
            className="max-h-[60vh] overflow-y-auto p-4 md:p-6"
          >
            <div className="chat-container mx-auto w-full flex flex-col gap-3">
              {messages.map((m, i) => (
                <MessageBubble key={i} role={m.role}>
                  {m.content}
                </MessageBubble>
              ))}

              {/* Example separator (could be date/time) */}
              {/* <div className="flex items-center"><span className="chat-separator">Today</span></div> */}

              <div ref={endRef} />
            </div>
          </div>
          <div className="px-4 md:px-6 pb-4">
            <Composer onSend={handleSend} onAttach={onAttach} />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
