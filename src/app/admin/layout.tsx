import Link from "next/link";
import { Suspense } from "react";
import { isAuthed } from "@/lib/auth";
import { logoutAction } from "./actions";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Yönetim Paneli" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthed();

  if (!authed) {
    return (
      <Suspense>
        <LoginForm />
      </Suspense>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <aside className="h-fit rounded-xl border border-ink-200 bg-white p-3">
          <div className="px-2 py-2 font-bold text-ink-900">Yönetim</div>
          <nav className="space-y-1 text-sm">
            <Link
              href="/admin"
              className="block rounded-lg px-3 py-2 text-ink-700 hover:bg-ink-100"
            >
              📊 Özet
            </Link>
            <Link
              href="/admin/urunler"
              className="block rounded-lg px-3 py-2 text-ink-700 hover:bg-ink-100"
            >
              📦 Ürünler
            </Link>
            <Link
              href="/admin/kategoriler"
              className="block rounded-lg px-3 py-2 text-ink-700 hover:bg-ink-100"
            >
              🗂️ Kategoriler
            </Link>
            <Link
              href="/admin/siparisler"
              className="block rounded-lg px-3 py-2 text-ink-700 hover:bg-ink-100"
            >
              🧾 Siparişler
            </Link>
            <Link
              href="/admin/gorunum"
              className="block rounded-lg px-3 py-2 text-ink-700 hover:bg-ink-100"
            >
              🎨 Görünüm & İçerik
            </Link>
            <Link
              href="/"
              className="block rounded-lg px-3 py-2 text-ink-700 hover:bg-ink-100"
            >
              🌐 Siteye Dön
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full text-left rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
              >
                🚪 Çıkış Yap
              </button>
            </form>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
