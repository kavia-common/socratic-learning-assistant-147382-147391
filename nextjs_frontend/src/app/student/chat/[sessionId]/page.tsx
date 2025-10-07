"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSessionMessages, listStudentSessions, sendMessage, uploadMaterial, getStreak } from "@/lib/api";
import { ChatMessage } from "@/components/ChatMessage";
import UploadDropzone from "@/components/UploadDropzone";
import { Button } from "@/components/ui/Button";
import InteractivePanel from "@/components/student/InteractivePanel";

export default function ChatSessionPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const qc = useQueryClient();

  const { data: sessions } = useQuery({
    queryKey: ["student", "sessions"],
    queryFn: listStudentSessions,
    initialData: [],
  });

  const { data: streak } = useQuery({
    queryKey: ["student", "streak"],
    queryFn: getStreak,
    initialData: { current: 0, best: 0 },
  });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["chat", sessionId],
    queryFn: () => getSessionMessages(sessionId),
    initialData: [],
  });

  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  type ChatMsg = { id: string; role: "user" | "assistant"; content: string; createdAt: string };

  const sendMutation = useMutation({
    mutationFn: (content: string) => sendMessage(sessionId, { content, files: attachments.map((f) => f.name) }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["chat", sessionId] });
      setAttachments([]);
    },
  });

  async function onUpload() {
    if (!attachments.length) return;
    await uploadMaterial(attachments.map((f) => ({ name: f.name, size: f.size })));
  }

  async function onSend() {
    const cleaned = input.trim();
    if (!cleaned) return;
    setSending(true);
    // optimistic update
    const tempId = `temp-${Date.now()}`;
    qc.setQueryData<ChatMsg[] | undefined>(["chat", sessionId], (old) => {
      const base = Array.isArray(old) ? old : [];
      return [
        ...base,
        { id: tempId, role: "user", content: cleaned, createdAt: new Date().toISOString() },
      ];
    });

    try {
      const res = await sendMutation.mutateAsync(cleaned);
      qc.setQueryData<ChatMsg[] | undefined>(["chat", sessionId], (old) => {
        const base = Array.isArray(old) ? old : [];
        return [
          ...base,
          { id: `a-${Date.now()}`, role: "assistant", content: res.content, createdAt: new Date().toISOString() },
        ];
      });
    } catch {
      qc.setQueryData<ChatMsg[] | undefined>(["chat", sessionId], (old) => {
        const base = Array.isArray(old) ? old : [];
        return [
          ...base,
          { id: `e-${Date.now()}`, role: "assistant", content: "Sorry, an error occurred.", createdAt: new Date().toISOString() },
        ];
      });
    } finally {
      setInput("");
      setSending(false);
    }
  }

  const showInteractive = messages.filter((m) => m.role === "assistant").length >= 5;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden md:flex w-64 shrink-0 border-r bg-white">
        <div className="w-full">
          <Sidebar />
          <div className="px-4">
            <div className="mt-2 text-xs text-gray-600">
              <div>Streak: <span className="text-amber-700">{streak.current}</span> (best {streak.best})</div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold">History</h3>
              <ul className="mt-2 space-y-1 max-h-[50vh] overflow-y-auto pr-2">
                {sessions.map((s) => (
                  <li key={s.id}>
                    <a href={`/student/chat/${s.id}`} className={`block rounded-md px-2 py-1 text-sm hover:bg-gray-50 ${s.id === sessionId ? "bg-blue-50 text-blue-700" : "text-gray-700"}`}>
                      {s.title || "Untitled"}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-4 md:p-6">
          <div role="log" aria-label="Chat transcript" className="space-y-3">
            {isLoading && <p className="text-sm text-gray-600">Loading messages...</p>}
            {messages.map((m) => (
              <ChatMessage key={m.id} role={m.role} content={m.content} />
            ))}
            <div ref={endRef} />
          </div>

          {showInteractive && <InteractivePanel />}
        </div>

        <div className="border-t bg-white p-3 md:p-4">
          <div className="flex flex-col gap-2">
            <UploadDropzone onFiles={setAttachments} />
            {attachments.length > 0 && (
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{attachments.length} file(s) attached</span>
                <Button variant="secondary" onClick={onUpload}>Upload now</Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                aria-label="Type your message"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                className="flex-1 rounded-md border px-3 py-2 focus-ring"
              />
              <Button onClick={onSend} disabled={sending}>{sending ? "Sending..." : "Send"}</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
