"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { createUser, deleteUser, listUsers } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * PUBLIC_INTERFACE
 * Admin Users management table with create and delete.
 */
export default function UsersTable() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: listUsers,
    initialData: [],
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "student" });
  const [search, setSearch] = useState("");

  const filtered = data.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  async function onCreate() {
    await createUser(form);
    await qc.invalidateQueries({ queryKey: ["admin", "users"] });
    setOpen(false);
    setForm({ name: "", email: "", role: "student" });
  }

  async function onDelete(id: string) {
    await deleteUser(id);
    await qc.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={() => setOpen(true)}>New User</Button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2">Role</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-2 py-2">{u.name}</td>
                <td className="px-2 py-2">{u.email}</td>
                <td className="px-2 py-2">{u.role}</td>
                <td className="px-2 py-2 text-right">
                  <Button variant="destructive" onClick={() => onDelete(u.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-2 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create User">
        <div className="space-y-3">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <select
            className="rounded-md border px-3 py-2 focus-ring"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          >
            <option value="student">student</option>
            <option value="mentor">mentor</option>
            <option value="admin">admin</option>
          </select>
          <div className="pt-2">
            <Button onClick={onCreate}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
