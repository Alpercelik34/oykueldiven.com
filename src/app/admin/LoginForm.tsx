"use client";

import { useSearchParams } from "next/navigation";
import { loginAction } from "./actions";

export function LoginForm() {
  const params = useSearchParams();
  const error = params.get("error");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="rounded-2xl border border-ink-200 bg-white p-8">
        <h1 className="text-xl font-bold text-ink-900 text-center">
          Yönetim Paneli Girişi
        </h1>
        <p className="mt-1 text-center text-sm text-ink-500">
          Devam etmek için şifrenizi girin.
        </p>
        <form action={loginAction} className="mt-6 space-y-3">
          <input
            name="password"
            type="password"
            placeholder="Şifre"
            required
            autoFocus
            className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
          />
          {error && (
            <p className="text-sm text-red-600">Şifre hatalı. Tekrar deneyin.</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
