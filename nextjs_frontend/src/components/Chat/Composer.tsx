"use client";

import React, { useEffect, useRef, useState } from "react";
import { Paperclip, Mic, Send, Search, BookOpen } from "lucide-react";

/**
 * PUBLIC_INTERFACE
 * Composer component with:
 * - Auto-growing textarea
 * - Enter to send, Shift+Enter for newline
 * - Attach, Search, Study quick action chips
 * - Voice button placeholder
 * - Drag-over highlighting
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, window.innerHeight * 0.4) + "px";
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
  }

  function onFilesSelected(list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list).filter((f) => /(pdf|ppt|pptx|txt|md|png|jpe?g)$/i.test(f.name));
    onAttach?.(arr);
  }

  return (
    <div className="composer mt-4 pt-4 border-t">
      {/* Quick actions row */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button
          className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm focus-ring inline-flex items-center gap-2"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach file"
        >
          <Paperclip size={16} /> Attach
        </button>
        <button
          className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm focus-ring inline-flex items-center gap-2"
          onClick={() => {
            // Placeholder: focus text for now.
            textRef.current?.focus();
          }}
          aria-label="Search materials"
        >
          <Search size={16} /> Search
        </button>
        <button
          className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm focus-ring inline-flex items-center gap-2"
          onClick={() => {
            // Placeholder: insert study hint
            setValue((v) => (v ? v + "\n" : "") + "Help me study the key concepts related to...");
            textRef.current?.focus();
          }}
          aria-label="Study mode"
        >
          <BookOpen size={16} /> Study
        </button>
        <button
          className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm focus-ring inline-flex items-center gap-2"
          onClick={() => {
            // Placeholder for voice recording
            alert("Voice input coming soon.");
          }}
          aria-label="Start voice input"
        >
          <Mic size={16} /> Voice
        </button>
      </div>

      {/* Input wrapper */}
      <div
        className={`inputWrap rounded-xl border bg-white p-2 flex items-end gap-2 ${
          dragOver ? "outline outline-2 outline-blue-500" : ""
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
      >
        <button
          className="u-transition h-9 w-9 rounded-md border hover:bg-gray-50 flex items-center justify-center focus-ring"
          aria-label="Attach file"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip size={16} />
        </button>
        <textarea
          ref={textRef}
          aria-label="Message the assistant"
          placeholder="Message the assistant…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none outline-none bg-transparent px-1 py-2 text-[15px] leading-6"
          rows={1}
        />
        <button
          className="u-transition h-9 w-9 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-60 focus-ring"
          aria-label="Send message"
          onClick={submit}
          disabled={!value.trim()}
        >
          <Send size={16} />
        </button>
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
      <p className="mt-2 text-xs text-gray-500 text-center">
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
