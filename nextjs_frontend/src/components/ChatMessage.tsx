"use client";
import React from "react";

// PUBLIC_INTERFACE
export function ChatMessage({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isAssistant = role === "assistant";
  return (
    <div
      className={`max-w-[80%] rounded-lg px-3 py-2 ${
        isAssistant ? "bg-blue-50 text-blue-900" : "bg-gray-100 text-gray-900 ml-auto"
      }`}
    >
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}
