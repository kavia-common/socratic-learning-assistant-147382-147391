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
  isNew = false,
}: {
  role: "assistant" | "user" | "system";
  children: React.ReactNode;
  timestamp?: string;
  name?: string;
  avatar?: React.ReactNode;
  /** When true, applies an enter animation (motion-safe) */
  isNew?: boolean;
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

  // Motion-safe enter animation classes
  const enterClass = isNew ? (role === "user" ? "msg-enter-user" : "msg-enter") : "";

  // Row wrapper: allow avatar/timestamp
  return (
    <div
      className={`flex ${align}`}
      role="listitem"
      aria-live={isAssistant ? "polite" : undefined}
      data-role={role}
      data-new={isNew ? "true" : "false"}
    >
      {(isAssistant || isSystem) && (
        <div
          className="mr-2 mt-0.5 h-7 w-7 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold select-none"
          aria-hidden
        >
          {avatar ?? "SA"}
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[850px] ${bubbleClass} ${enterClass}`}>
        {(name || timestamp) && (
          <div className="mb-1 flex items-center gap-2">
            {name ? <span className="text-xs font-medium text-gray-700">{name}</span> : null}
            {timestamp ? <span className="msg-meta">{timestamp}</span> : null}
          </div>
        )}

        {/* Content */}
        <div className="prose-chat whitespace-pre-wrap">
          {children}
        </div>
      </div>
    </div>
  );
}
