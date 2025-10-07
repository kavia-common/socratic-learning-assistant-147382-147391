"use client";

import { useState } from "react";
import { api } from "@/lib/api";

/**
 * PUBLIC_INTERFACE
 * Upload panel with drag-and-drop and mock upload endpoint.
 */
export default function UploadPanel() {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  function onFilesSelected(list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list).filter((f) =>
      /(pdf|ppt|pptx|md|txt)$/i.test(f.name)
    );
    setFiles(arr);
  }

  async function onUpload() {
    if (!files.length) return;
    setStatus("Uploading...");
    try {
      // Mock upload using file names only
      const payload = { files: files.map((f) => ({ name: f.name, size: f.size })) };
      await api.post("/api/upload", payload);
      setStatus("Uploaded successfully.");
    } catch {
      setStatus("Upload failed.");
    }
  }

  return (
    <div className="card p-6 space-y-4">
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
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
        role="region"
        aria-label="File uploader"
      >
        <p className="text-gray-700">Drag and drop files here</p>
        <p className="text-gray-500 text-sm">PDF, PPT, PPTX, MD, TXT</p>
        <div className="mt-4">
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer focus-ring">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => onFilesSelected(e.target.files)}
              aria-label="Choose files"
            />
            Choose files
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Selected files</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {files.map((f) => (
              <li key={f.name}>
                {f.name} <span className="text-gray-500">({Math.round(f.size / 1024)} KB)</span>
              </li>
            ))}
          </ul>
          <button onClick={onUpload} className="mt-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus-ring">
            Upload
          </button>
          {status && <p className="text-sm text-gray-700">{status}</p>}
        </div>
      )}
    </div>
  );
}
