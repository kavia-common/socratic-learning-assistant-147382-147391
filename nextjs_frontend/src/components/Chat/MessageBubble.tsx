"use client";

import React from "react";

/**
 * PUBLIC_INTERFACE
 * MessageBubble renders assistant and user bubble variants following ChatGPT-like spacing and typographic cues,
 * tuned for the Ocean Professional light theme.
 */
export default function MessageBubble({
  role,
  children,
}: {
  role: "assistant" | "user" | "system";
  children: React.ReactNode;
}) {
  const isAssistant = role === "assistant";
  const isSystem = role === "system";

  const classes =
    isSystem
      ? "bg-gray-50 border-l-4 border-blue-500 text-gray-700"
      : isAssistant
      ? "bg-blue-50 text-blue-900 border border-blue-100"
      : "bg-gray-100 text-gray-900 border border-gray-200 ml-auto";

  return (
    <div
      role="listitem"
      className={`max-w-[850px] w-fit rounded-lg px-4 py-3 leading-relaxed ${classes}`}
    >
      <div className="prose-sm prose-headings:mt-3 prose-p:my-3 prose-ul:my-3 prose-ol:my-3">
        {children}
      </div>
    </div>
  );
}
