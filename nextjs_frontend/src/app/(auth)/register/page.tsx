"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await register(form);
      setOk(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Registration failed";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-md card p-6">
      <h1 className="text-xl font-semibold">Register</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
        <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <Button type="submit" disabled={busy}>{busy ? "Creating..." : "Create account"}</Button>
      </form>
      {ok && (
        <p className="text-sm text-emerald-700 mt-3">
          Registration successful. You may now <a href="/login" className="text-blue-600 hover:underline">sign in</a>.
        </p>
      )}
    </section>
  );
}
