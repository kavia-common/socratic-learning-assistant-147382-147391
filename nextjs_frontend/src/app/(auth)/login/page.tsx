"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/auth";
import { login } from "@/lib/api";

export default function LoginPage() {
  const { login: setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await login({ email, password });
      setAuth(res.token, res.role);
      window.location.href = res.role === "mentor" ? "/mentor" : res.role === "admin" ? "/admin" : "/student";
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed";
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-md card p-6">
      <h1 className="text-xl font-semibold">Login</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <Button type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</Button>
      </form>
      <p className="text-sm text-gray-600 mt-3">
        No account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
      </p>
    </section>
  );
}
