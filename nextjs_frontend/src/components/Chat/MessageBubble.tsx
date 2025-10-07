"use client";

import React from "react";

/**
 * PUBLIC_INTERFACE
 * MessageBubble renders assistant, user, and system variants with refined bubble shape, spacing,
 * and typography similar to ChatGPT while honoring the Ocean Professional theme.
 */
export default function MessageBubble({
  role,
  children,
  timestamp,
  name,
  avatar,
}: {
  role: "assistant" | "user" | "system";
  children: React.ReactNode;
  timestamp?: string;
  name?: string;
  avatar?: React.ReactNode;
}) {
  const isAssistant = role === "assistant";
  const isSystem = role === "system";

  // Alignment: user to right, assistant/system to left
  const align = isAssistant || isSystem ? "justify-start" : "justify-end";

  // Bubble visual classes
  const bubbleClass = isSystem
    ? "bubble bubble-system text-gray-700"
    : isAssistant
    ? "bubble bubble-assistant text-gray-900"
    : "bubble bubble-user text-gray-900";

  // Row wrapper: allow avatar/timestamp
  return (
    <div className={`flex ${align}`} role="listitem" aria-live={isAssistant ? "polite" : undefined}>
      {/* Avatar (optional, only show for assistant/system on left) */}
      {(isAssistant || isSystem) && (
        <div className="mr-2 mt-0.5 h-7 w-7 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold select-none" aria-hidden>
          {avatar ?? "SA"}
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[850px] bubble-in ${bubbleClass}`}>
        {/* Optional header: name + timestamp */}
        {(name || timestamp) && (
          <div className="mb-1 flex items-center gap-2">
            {name ? <span className="text-xs font-medium text-gray-700">{name}</span> : null}
            {timestamp ? <span className="msg-meta">{timestamp}</span> : null}
          </div>
        )}

        {/* Content */}
        <div className="prose-chat">
          {children}
        </div>
      </div>
    </div>
  );
}
