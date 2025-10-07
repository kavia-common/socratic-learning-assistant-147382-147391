"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import Dropzone from "@/components/Upload/Dropzone";
import { api } from "@/lib/api";

/**
 * PUBLIC_INTERFACE
 * /materials – Materials upload panel with Dropzone and a list of uploaded items with status chips.
 */
export default function MaterialsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [items, setItems] = useState<
    { id: string; name: string; size: number; status: "Queued" | "Processing" | "Ready" }[]
  >([{ id: "1", name: "Syllabus.pdf", size: 220_000, status: "Ready" }]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onUpload() {
    if (!files.length) return;
    setBusy(true);
    setMsg(null);
    try {
      const payload = { files: files.map((f) => ({ name: f.name, size: f.size })) };
      await api.post("/api/upload", payload);
      const now = files.map((f, idx) => ({
        id: String(Date.now() + idx),
        name: f.name,
        size: f.size,
        status: "Processing" as const,
      }));
      setItems((prev) => [...now, ...prev]);
      setFiles([]);
      setMsg("Uploaded. Processing may take a moment.");
      // mock processing -> ready
      setTimeout(() => {
        setItems((prev) =>
          prev.map((it) =>
            it.status === "Processing" ? { ...it, status: "Ready" } : it
          )
        );
      }, 1500);
    } catch {
      setMsg("Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <section className="space-y-4">
        <div className="rounded-xl gradient-bg p-6 card">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Materials</h1>
          <p className="mt-2 text-gray-600">Upload PDFs and slides to power Socratic dialogue.</p>
        </div>

        <div className="card p-6 space-y-4">
          <Dropzone onFiles={setFiles} />
          {files.length > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-700">
              <span>{files.length} file(s) selected</span>
              <button
                onClick={onUpload}
                disabled={busy}
                className="u-transition px-3 py-2 rounded-md bg-[var(--color-primary)] text-white hover:bg-blue-700 disabled:opacity-60 focus-ring"
              >
                {busy ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}

          <div>
            <h2 className="font-semibold">Uploaded items</h2>
            <ul className="mt-2 divide-y">
              {items.map((it) => (
                <li key={it.id} className="py-2 flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <p className="truncate">{it.name}</p>
                    <p className="text-xs text-gray-500">{Math.round(it.size / 1024)} KB</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      it.status === "Ready"
                        ? "bg-emerald-50 text-emerald-700"
                        : it.status === "Processing"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    aria-label={`Status ${it.status}`}
                  >
                    {it.status}
                  </span>
                </li>
              ))}
              {items.length === 0 && (
                <li className="py-6 text-center text-gray-500 text-sm">No materials yet.</li>
              )}
            </ul>
          </div>

          {msg && <p className="text-sm text-gray-700">{msg}</p>}
        </div>
      </section>
    </AppShell>
  );
}
