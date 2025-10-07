"use client";

import React, { useMemo, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Dropzone specialized for document uploads with enhanced interactions:
 * - Drag-enter ring + elevation, animated dashed border
 * - File-type badges preview and mock progress bars
 * - aria-live polite error messages
 * - Keyboard parity (focus + Enter/Space opens file dialog)
 */
export default function Dropzone({
  onFiles,
  accept = ".pdf,.ppt,.pptx",
  label = "Drop PDFs or browse to upload",
}: {
  onFiles: (files: File[]) => void;
  accept?: string;
  label?: string;
}) {
  const [drag, setDrag] = useState(false);
  const [focus, setFocus] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [preview, setPreview] = useState<Array<{ file: File; progress: number }>>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const pattern = useMemo(() => /\.(pdf|ppt|pptx)$/i, []);

  function filter(list: FileList | null): File[] {
    if (!list) return [];
    return Array.from(list).filter((f) => pattern.test(f.name));
  }

  function handle(list: FileList | null) {
    const arr = filter(list);
    if (!arr.length) {
      setErr("No supported files. Please choose PDF or PowerPoint files.");
      setTimeout(() => setErr(null), 3000);
      return;
    }
    setPreview((prev) => [...prev, ...arr.map((f) => ({ file: f, progress: 0 }))]);
    // micro progress tick
    arr.forEach((f, i) => {
      const start = 120 + i * 60;
      setTimeout(function tick() {
        setPreview((prev) =>
          prev.map((p) =>
            p.file === f ? { ...p, progress: Math.min(100, p.progress + 12 + Math.round(Math.random() * 8)) } : p
          )
        );
        const now = preview.find((p) => p.file === f)?.progress ?? 0;
        if (now < 100) setTimeout(tick, 160);
      }, start);
    });
    onFiles(arr);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }

  function badge(name: string): { text: string; cls: string } {
    const ext = (name.split(".").pop() || "").toLowerCase();
    const map: Record<string, { text: string; cls: string }> = {
      pdf: { text: "PDF", cls: "bg-red-50 text-red-700" },
      ppt: { text: "PPT", cls: "bg-amber-50 text-amber-700" },
      pptx: { text: "PPTX", cls: "bg-amber-50 text-amber-700" },
    };
    return map[ext] || { text: "FILE", cls: "bg-gray-100 text-gray-700" };
  }

  return (
    <div className="w-full">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {err ? `Upload error: ${err}` : ""}
      </div>
      <div
        role="button"
        tabIndex={0}
        aria-label="File uploader. Press Enter to browse or drop files."
        onKeyDown={onKeyDown}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={[
          "u-transition rounded-xl p-8 text-center bg-white border-2 border-dashed",
          "border-gray-300 motion-safe:[background-image:repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(37,99,235,0.08)_8px,rgba(37,99,235,0.08)_16px)] motion-safe:bg-[length:16px_1px] motion-safe:bg-bottom motion-safe:bg-no-repeat",
          drag || focus ? "ring-2 ring-[var(--color-primary)] ring-offset-[var(--ring-offset)] ring-offset-white bg-blue-50/60 border-blue-400" : "hover:shadow-sm",
        ].join(" ")}
        style={{ animation: drag ? "dashMove 600ms linear infinite" : undefined }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handle(e.dataTransfer.files);
        }}
      >
        <p className="text-gray-700">{drag ? "Drop files to upload" : label}</p>
        <p className="text-gray-500 text-sm mt-1">Accepted: PDF, PPT, PPTX</p>
        <div className="mt-4">
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[var(--color-primary)] text-white hover:bg-blue-700 cursor-pointer focus-ring u-transition">
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              multiple
              accept={accept}
              onChange={(e) => handle(e.target.files)}
              aria-label="Choose files"
            />
            Browse files
          </label>
        </div>

        {preview.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-3 justify-center">
            {preview.slice(-8).map(({ file, progress }) => {
              const b = badge(file.name);
              return (
                <li key={`${file.name}-${file.size}`} className="flex items-center gap-2 text-left">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border ${b.cls}`} title={file.name}>
                    {b.text}
                  </span>
                  <div className="relative h-1.5 w-20 rounded bg-gray-200 overflow-hidden" aria-hidden>
                    <div className="h-full bg-blue-500 motion-safe:transition-[width] u-transition" style={{ width: `${Math.min(100, progress)}%` }} />
                    {progress < 100 ? (
                      <div className="absolute inset-0 pointer-events-none opacity-30">
                        <div className="h-full w-full motion-safe:animate-[progressShimmer_1.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes dashMove {
            from { background-position-x: 0; }
            to { background-position-x: 16px; }
          }
          @keyframes progressShimmer {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        }
      `}</style>
    </div>
  );
}
