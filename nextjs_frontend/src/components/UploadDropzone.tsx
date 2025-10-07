"use client";

import React, { useState } from "react";

// PUBLIC_INTERFACE
export default function UploadDropzone({
  onFiles,
}: {
  onFiles: (files: File[]) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  function onFilesSelected(list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list).filter((f) => /(pdf|ppt|pptx|png|jpg|jpeg|gif)$/i.test(f.name));
    onFiles(arr);
  }

  return (
    <div
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
      className={`border rounded-md px-3 py-2 text-xs ${
        dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
      }`}
      role="region"
      aria-label="Upload attachments"
      title="Attach files (PDF, PPT, Images)"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-gray-600">Attach files</span>
        <label className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer">
          <input
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.ppt,.pptx,image/*"
            onChange={(e) => onFilesSelected(e.target.files)}
          />
          Browse
        </label>
      </div>
    </div>
  );
}
