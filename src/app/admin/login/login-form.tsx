"use client";

import { useActionState } from "react";
import { Icon } from "@/components/icon";
import { login } from "../actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-[10px] font-bold uppercase tracking-[0.12em] text-muted"
        >
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="w-full border border-border bg-white px-3 py-2.5 focus:border-ink focus:outline-none"
        />
      </div>
      {state.error && <p className="text-sm text-brand">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full gap-2.5 disabled:opacity-60">
        <Icon name="login" className="size-5" />
        {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>
    </form>
  );
}
