"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useSettings } from "@/lib/settings-context";
import { LOGO_SIZES } from "@/lib/settings";
import type { Category } from "@/lib/types";

export function Header({ categories }: { categories: Category[] }) {
  const { count } = useCart();
  const site = useSettings();
  const logo = LOGO_SIZES[site.logoSize] ?? LOGO_SIZES.orta;
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (q) router.push(`/arama?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-ink-200 shadow-sm">
      {/* Üst şerit */}
      <div className="bg-brand-700 text-white text-xs sm:text-sm">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between">
          <span className="hidden sm:inline">{site.announcement}</span>
          <span className="flex items-center gap-4">
            <a href={`tel:${site.phone.replace(/\s/g, "")}`}>📞 {site.phone}</a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline"
            >
              WhatsApp Sipariş
            </a>
          </span>
        </div>
      </div>

      {/* Ana bar */}
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {site.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={site.logoUrl}
              alt={site.siteName}
              className={`${logo.img} w-auto max-w-60 object-contain`}
            />
          ) : (
            <span
              className={`grid place-items-center ${logo.badge} ${logo.text} rounded-lg bg-brand-600 text-white font-bold`}
            >
              {site.logoLetter}
            </span>
          )}
          {!site.logoUrl && (
            <span className="font-bold text-lg text-ink-900 hidden sm:inline">
              {site.siteName}
            </span>
          )}
        </Link>

        <form onSubmit={submitSearch} className="flex-1 max-w-xl">
          <div className="flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün, marka veya kategori ara..."
              className="w-full rounded-l-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="rounded-r-lg bg-brand-600 px-4 text-white text-sm font-medium hover:bg-brand-700"
            >
              Ara
            </button>
          </div>
        </form>

        <Link
          href="/sepet"
          className="relative flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-ink-100"
        >
          <span className="text-xl">🛒</span>
          <span className="hidden sm:inline text-sm font-medium">Sepet</span>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 grid place-items-center min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold">
              {count}
            </span>
          )}
        </Link>
      </div>

      {/* Kategori menüsü */}
      <nav className="border-t border-ink-200 bg-ink-50">
        <div className="mx-auto max-w-6xl px-4">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="sm:hidden py-2 text-sm font-medium flex items-center gap-2"
          >
            ☰ Kategoriler
          </button>
          <ul
            className={`${menuOpen ? "flex" : "hidden"} sm:flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 pb-2 sm:pb-0`}
          >
            <li>
              <Link
                href="/urunler"
                className="block px-3 py-2 text-sm font-medium text-ink-700 hover:text-brand-700"
              >
                Tüm Ürünler
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/kategori/${c.slug}`}
                  className="block px-3 py-2 text-sm text-ink-700 hover:text-brand-700"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
