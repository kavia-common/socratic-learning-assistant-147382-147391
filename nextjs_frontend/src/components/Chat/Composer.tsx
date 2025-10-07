"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Paperclip, Mic, Send, Search, BookOpen, Loader2 } from "lucide-react";

/**
 * PUBLIC_INTERFACE
 * Composer component with enhanced interactions/micro-animations and a11y:
 * - Smooth auto-growing textarea with motion-safe transition
 * - Enter to send, Shift+Enter for newline (keyboard behavior preserved)
 * - Quick action chips with hover/press states and tooltips via aria-describedby
 * - Tactile send button press/release animation and aria-busy while sending
 * - Drag-over visual hint for attachments including inline label
 * - Inline "Sending..." indicator with aria-live for screen readers
 * - Respects prefers-reduced-motion via global .u-transition and motion-safe utilities
 */
export default function Composer({
  onSend,
  onAttach,
}: {
  onSend: (text: string) => void;
  onAttach?: (files: File[]) => void;
}) {
  const [value, setValue] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [sending, setSending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const tooltipIds = useMemo(
    () => ({
      attach: "tip-attach",
      search: "tip-search",
      study: "tip-study",
      voice: "tip-voice",
      send: "tip-send",
    }),
    []
  );

  // Smooth auto-grow with transition respecting reduced motion
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, Math.floor(window.innerHeight * 0.4));
    el.style.height = `${next}px`;
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  async function submit() {
    const text = value.trim();
    if (!text || sending) return;
    setSending(true);
    // Set aria-live will announce below; we optimistically clear input to mirror ChatGPT-like UX
    setValue("");
    try {
      await onSend(text);
    } finally {
      setSending(false);
    }
  }

  function onFilesSelected(list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list).filter((f) => /(pdf|ppt|pptx|txt|md|png|jpe?g)$/i.test(f.name));
    onAttach?.(arr);
  }

  // Shared quick action chip styles using theme tokens
  const chipClass =
    "u-transition px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-sm focus-ring inline-flex items-center gap-2";

  return (
    <div className="composer mt-4 pt-4 border-t">
      {/* Quick actions row with tooltips (aria-describedby) */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button
          className={chipClass}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach file"
          aria-describedby={tooltipIds.attach}
        >
          <Paperclip size={16} aria-hidden />
          Attach
        </button>
        <span id={tooltipIds.attach} role="tooltip" className="sr-only">
          Attach files (PDF, PPT, images)
        </span>

        <button
          className={chipClass}
          onClick={() => {
            textRef.current?.focus();
          }}
          aria-label="Search materials"
          aria-describedby={tooltipIds.search}
        >
          <Search size={16} aria-hidden />
          Search
        </button>
        <span id={tooltipIds.search} role="tooltip" className="sr-only">
          Search your uploaded materials
        </span>

        <button
          className={chipClass}
          onClick={() => {
            setValue((v) => (v ? v + "\n" : "") + "Help me study the key concepts related to...");
            textRef.current?.focus();
          }}
          aria-label="Study mode"
          aria-describedby={tooltipIds.study}
        >
          <BookOpen size={16} aria-hidden />
          Study
        </button>
        <span id={tooltipIds.study} role="tooltip" className="sr-only">
          Insert a study prompt
        </span>

        <button
          className={chipClass}
          onClick={() => {
            // Placeholder for voice recording; keep non-blocking
            window.alert("Voice input coming soon.");
          }}
          aria-label="Start voice input"
          aria-describedby={tooltipIds.voice}
        >
          <Mic size={16} aria-hidden />
          Voice
        </button>
        <span id={tooltipIds.voice} role="tooltip" className="sr-only">
          Start voice input (coming soon)
        </span>
      </div>

      {/* Input wrapper with drag-over hint and subtle elevation on focus/hover */}
      <div
        className={`inputWrap relative rounded-xl border bg-white p-2 flex items-end gap-2 u-transition ${
          dragOver ? "outline outline-2 outline-[var(--color-primary)]" : "hover:shadow-sm"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onFilesSelected(e.dataTransfer.files);
        }}
        aria-label="Message composer"
      >
        {/* Drag-over label */}
        {dragOver && (
          <div
            className="pointer-events-none absolute inset-0 rounded-xl bg-blue-50/70 border-2 border-dashed border-blue-500 flex items-center justify-center text-blue-700 text-sm"
            aria-hidden
          >
            Drop files to attach
          </div>
        )}

        <button
          className="u-transition h-9 w-9 rounded-md border border-[var(--border)] hover:bg-gray-50 active:translate-y-[0.5px] flex items-center justify-center focus-ring"
          aria-label="Attach file"
          onClick={() => fileInputRef.current?.click()}
          aria-describedby={tooltipIds.attach}
          title="Attach file"
        >
          <Paperclip size={16} aria-hidden />
        </button>

        <textarea
          ref={textRef}
          aria-label="Message the assistant"
          placeholder="Message the assistant…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none outline-none bg-transparent px-1 py-2 text-[15px] leading-6 u-transition motion-safe:transition-[height]"
          rows={1}
          style={{
            transition: "height var(--transition-base)",
          }}
        />

        {/* Send button with tactile press animation */}
        <button
          className={`u-transition h-9 w-9 rounded-full text-white flex items-center justify-center focus-ring ${
            value.trim() && !sending
              ? "bg-[var(--color-primary)] hover:bg-blue-700 active:translate-y-[1px]"
              : "bg-blue-400/60 cursor-not-allowed"
          }`}
          aria-label="Send message"
          aria-describedby={tooltipIds.send}

          onClick={submit}
          disabled={!value.trim() || sending}
          aria-busy={sending || undefined}
          title="Send"
        >
          {sending ? <Loader2 size={16} className="motion-safe:animate-spin" aria-hidden /> : <Send size={16} aria-hidden />}
        </button>
        <span id={tooltipIds.send} role="tooltip" className="sr-only">
          Send message
        </span>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.ppt,.pptx,.txt,.md,image/*"
          onChange={(e) => onFilesSelected(e.target.files)}
          aria-hidden
          tabIndex={-1}
        />
      </div>

      {/* Inline sending indicator with aria-live for assistive tech */}
      <div
        className="mt-2 text-center text-xs text-gray-600 min-h-[1.25rem]"
        aria-live="polite"
        aria-atomic="true"
      >
        {sending ? "Sending…" : " "}
      </div>

      <p className="mt-1 text-xs text-gray-500 text-center">
        By messaging the assistant, you agree to our{" "}
        <a className="underline" href="https://openai.com/terms" target="_blank" rel="noreferrer">
          Terms
        </a>{" "}
        and have read our{" "}
        <a className="underline" href="https://openai.com/privacy" target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
