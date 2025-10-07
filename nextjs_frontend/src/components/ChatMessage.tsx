"use client";
import React from "react";

// PUBLIC_INTERFACE
export function ChatMessage({
  role,
  content,
  timestamp,
}: {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}) {
  const isAssistant = role === "assistant";
  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`bubble ${isAssistant ? "bubble-assistant" : "bubble-user"} max-w-[850px] motion-safe:bubble-in`}
      >
        {timestamp && <div className="msg-meta mb-1">{timestamp}</div>}
        <div className="prose-chat whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  );
}
