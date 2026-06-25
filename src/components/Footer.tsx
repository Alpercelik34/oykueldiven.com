import Link from "next/link";
import type { Settings } from "@/lib/settings";
import type { Category } from "@/lib/types";

export function Footer({
  categories,
  settings,
}: {
  categories: Category[];
  settings: Settings;
}) {
  return (
    <footer className="mt-16 bg-ink-900 text-ink-100">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-brand-600 text-white font-bold">
              {settings.logoLetter}
            </span>
            <span className="font-bold text-lg text-white">
              {settings.siteName}
            </span>
          </div>
          <p className="text-sm text-ink-300 leading-relaxed">
            {settings.tagline}. Sağlık kuruluşları, eczaneler ve işletmeler için
            güvenilir tedarik.
          </p>
          <SocialLinks settings={settings} />
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Kategoriler</h3>
          <ul className="space-y-2 text-sm text-ink-300">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/kategori/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Kurumsal</h3>
          <ul className="space-y-2 text-sm text-ink-300">
            <li>
              <Link href="/hakkimizda" className="hover:text-white">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-white">
                İletişim
              </Link>
            </li>
            <li>
              <Link href="/urunler" className="hover:text-white">
                Tüm Ürünler
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white">
                Yönetim Paneli
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">İletişim</h3>
          <ul className="space-y-2 text-sm text-ink-300">
            <li>📞 {settings.phone}</li>
            <li>✉️ {settings.email}</li>
            <li>📍 {settings.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-700">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-ink-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>
            © {new Date().getFullYear()} {settings.siteName}. Tüm hakları
            saklıdır.
          </span>
          {settings.footerNote && <span>{settings.footerNote}</span>}
        </div>
      </div>
    </footer>
  );
}

function SocialLinks({ settings }: { settings: Settings }) {
  const links = [
    { url: settings.instagram, label: "Instagram", icon: "Instagram" },
    { url: settings.facebook, label: "Facebook", icon: "Facebook" },
    { url: settings.twitter, label: "X", icon: "X" },
    { url: settings.youtube, label: "YouTube", icon: "YouTube" },
  ].filter((l) => l.url);

  if (links.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-ink-700 px-3 py-1 text-xs text-ink-200 hover:bg-ink-700"
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}
