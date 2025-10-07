"use client";

import React, { useMemo, useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * UploadDropzone
 * Enhanced accessible drag-and-drop zone with:
 * - Drag-enter ring and subtle elevation
 * - Animated dashed border (motion-safe)
 * - File-type badges preview
 * - Mock progress micro-animations while "staging" files
 * - aria-live polite region for error announcements
 * - Keyboard parity: focus/Space/Enter triggers file picker and states
 */
export default function UploadDropzone({
  onFiles,
}: {
  onFiles: (files: File[]) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staged, setStaged] = useState<Array<{ file: File; progress: number }>>([]);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const liveRef = useRef<HTMLDivElement | null>(null);

  // Accepted extensions and human labels
  const accept = useMemo(
    () => ({
      pattern: /\.(pdf|ppt|pptx|png|jpe?g|gif)$/i,
      label: "PDF, PPT, PPTX, PNG, JPG, JPEG, GIF",
    }),
    []
  );

  function filterAccepted(list: FileList | null): File[] {
    if (!list) return [];
    return Array.from(list).filter((f) => accept.pattern.test(f.name));
  }

  function announceError(msg: string) {
    setError(msg);
    // Clear after a short delay to avoid repeated announcements
    window.setTimeout(() => setError(null), 3000);
  }

  function onFilesSelected(list: FileList | null) {
    const accepted = filterAccepted(list);
    if (!accepted.length) {
      announceError("No supported files found. Please select PDF, PPT, images.");
      return;
    }
    // Stage files with mock progress
    const initial = accepted.map((f) => ({ file: f, progress: 0 }));
    setStaged((prev) => [...prev, ...initial]);

    // Begin micro-animations for progress (motion-safe CSS handles animation rate)
    initial.forEach((item, idx) => {
      const startDelay = 150 + idx * 80;
      setTimeout(() => {
        const tick = () => {
          setStaged((prev) =>
            prev.map((s) =>
              s.file === item.file
                ? { ...s, progress: Math.min(100, s.progress + 10 + Math.round(Math.random() * 10)) }
                : s
            )
          );
          const done = staged.find((x) => x.file === item.file)?.progress === 100;
          if (!done) {
            setTimeout(tick, 160);
          } else {
            // noop
          }
        };
        tick();
      }, startDelay);
    });

    // Hand off accepted files to parent for real processing
    onFiles(accepted);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }

  // File-type chip badge from filename
  function typeBadgeFor(name: string): { label: string; cls: string } {
    const ext = (name.split(".").pop() || "").toLowerCase();
    const map: Record<string, { label: string; cls: string }> = {
      pdf: { label: "PDF", cls: "bg-red-50 text-red-700" },
      ppt: { label: "PPT", cls: "bg-amber-50 text-amber-700" },
      pptx: { label: "PPTX", cls: "bg-amber-50 text-amber-700" },
      png: { label: "PNG", cls: "bg-blue-50 text-blue-700" },
      jpg: { label: "JPG", cls: "bg-blue-50 text-blue-700" },
      jpeg: { label: "JPEG", cls: "bg-blue-50 text-blue-700" },
      gif: { label: "GIF", cls: "bg-purple-50 text-purple-700" },
    };
    return map[ext] || { label: ext.toUpperCase() || "FILE", cls: "bg-gray-100 text-gray-700" };
    }

  return (
    <div className="w-full">
      {/* Live region for polite error announcements */}
      <div
        ref={liveRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {error ? `Upload error: ${error}` : ""}
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Upload attachments. Press Enter to browse files or drop them here."
        title="Attach files (PDF, PPT, Images)"
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
        className={[
          "u-transition rounded-lg px-4 py-3 text-sm",
          "bg-white border-2 border-dashed",
          // Base dashed border animation (motion-safe)
          "border-gray-300 motion-safe:[background-image:repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(37,99,235,0.08)_8px,rgba(37,99,235,0.08)_16px)]",
          "motion-safe:bg-[length:16px_1px] motion-safe:bg-bottom motion-safe:bg-no-repeat",
          dragOver || focused
            ? "ring-2 ring-[var(--color-primary)] ring-offset-[var(--ring-offset)] ring-offset-white bg-blue-50/60 border-blue-400"
            : "hover:shadow-sm",
        ].join(" ")}
        style={{
          // Animate the dashed stripe subtly left-to-right when active
          animation: dragOver
            ? "dashMove 600ms linear infinite"
            : undefined,
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-700">
              {dragOver ? "Drop files to attach" : "Attach files"}
            </span>
            {/* Keyboard state parity chip when focused */}
            {focused && !dragOver ? (
              <span
                className="hidden sm:inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5"
                aria-hidden
              >
                Enter to browse
              </span>
            ) : null}
          </div>

          <label className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer focus-ring">
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.ppt,.pptx,image/*"
              onChange={(e) => onFilesSelected(e.target.files)}
              aria-label="Choose files"
            />
            Browse
          </label>
        </div>

        {/* Accepted file hint */}
        <p className="mt-1 text-xs text-gray-500">Accepted: {accept.label}</p>

        {/* Preview staged items with micro-progress */}
        {staged.length > 0 && (
          <ul className="mt-3 flex flex-wrap items-center gap-2">
            {staged.slice(-6).map(({ file, progress }) => {
              const badge = typeBadgeFor(file.name);
              return (
                <li key={`${file.name}-${file.size}`} className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border ${badge.cls}`}
                    title={file.name}
                  >
                    {badge.label}
                  </span>
                  <div
                    className="relative h-1.5 w-16 rounded bg-gray-200 overflow-hidden"
                    aria-hidden
                  >
                    <div
                      className="h-full bg-blue-500 motion-safe:transition-[width] u-transition"
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                    {/* subtle shimmer when < 100% */}
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

      {/* Motion keyframes (scoped via style attribute to keep CSS in component) */}
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
