"use client";

import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Dropzone specialized for PDF uploads with accessible drag-and-drop and browse fallback.
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

  function handle(list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list).filter((f) => /\.(pdf|ppt|pptx)$/i.test(f.name));
    onFiles(arr);
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        drag ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
      }`}
      role="region"
      aria-label="PDF file uploader"
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
      <p className="text-gray-700">{label}</p>
      <p className="text-gray-500 text-sm mt-1">Accepted: PDF, PPT, PPTX</p>
      <div className="mt-4">
        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer focus-ring">
          <input
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
    </div>
  );
}
