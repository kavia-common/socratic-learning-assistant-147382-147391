"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createSession, listStudentSessions } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function StudentHome() {
  const { data, isLoading } = useQuery({
    queryKey: ["student", "sessions"],
    queryFn: listStudentSessions,
    initialData: [],
  });

  const create = useMutation({
    mutationFn: createSession,
  });

  async function onNewChat() {
    const res = await create.mutateAsync();
    const id = res.id || "new";
    window.location.href = `/student/chat/${id}`;
  }

  return (
    <section className="space-y-4">
      <div className="rounded-xl gradient-bg p-6 card">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Student</h1>
        <p className="mt-2 text-gray-600">Start a new chat or continue a recent session.</p>
        <div className="mt-4">
          <Button onClick={onNewChat} disabled={create.isPending}>
            {create.isPending ? "Creating..." : "New Chat"}
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <h2 className="font-semibold">Recent sessions</h2>
        {isLoading ? (
          <p className="text-sm text-gray-600 mt-2">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-gray-600 mt-2">No sessions yet.</p>
        ) : (
          <ul className="mt-2 divide-y">
            {data.map((s) => (
              <li key={s.id} className="py-2 flex items-center justify-between">
                <div>
                  <p className="font-medium">{s.title || "Untitled"}</p>
                  <p className="text-xs text-gray-500">Updated {new Date(s.updatedAt).toLocaleString()}</p>
                </div>
                <Link className="text-blue-600 hover:underline" href={`/student/chat/${s.id}`}>
                  Open
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
