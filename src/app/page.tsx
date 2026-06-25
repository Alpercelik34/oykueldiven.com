import Link from "next/link";
import {
  getCategories,
  getFeaturedProducts,
  getProducts,
  getSettings,
} from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { TrustIcon } from "@/components/TrustIcon";
import { CategoryIcon } from "@/components/CategoryIcon";

export default async function HomePage() {
  const [categories, featured, allProducts, settings] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getProducts(),
    getSettings(),
  ]);
  const newest = allProducts.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden text-white">
        {/* Arka plan videosu (döngülü, sessiz, otomatik) */}
        <video
          className="absolute inset-0 h-full w-full object-cover object-[50%_35%]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/media/Eldiven-giyen-doktorlar.mp4" type="video/mp4" />
        </video>
        {/* Okunabilirlik için degrade örtü (video daha çok görünsün diye hafif) */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/70 via-brand-800/55 to-brand-900/40" />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20 grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium mb-4">
              {settings.heroBadge}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
              {settings.heroTitle}{" "}
              <span className="text-brand-200">{settings.heroHighlight}</span>
            </h1>
            <p className="mt-4 text-brand-100 text-lg">{settings.heroSubtitle}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/urunler"
                className="inline-flex min-w-52 items-center justify-center rounded-lg bg-white px-6 py-3 text-center font-semibold text-brand-700 hover:bg-brand-50"
              >
                {settings.heroPrimaryBtn}
              </Link>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {categories.slice(0, 4).map((c) => (
              <Link
                key={c.slug}
                href={`/kategori/${c.slug}`}
                className="group rounded-2xl bg-white/10 backdrop-blur p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white/20 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <CategoryIcon slug={c.slug} name={c.name} className="w-6 h-6" />
                </span>
                <h3 className="mt-3 font-semibold">{c.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Güven şeridi */}
      <section className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-wrap items-start justify-center gap-x-12 gap-y-8 sm:gap-x-16 lg:gap-x-20">
            {settings.trustBadges.map((b, i) => (
              <div
                key={i}
                className="group flex w-36 flex-col items-center text-center"
              >
                <span className="grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-lg shadow-brand-700/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-brand-700/30">
                  <TrustIcon badge={b} className="w-7 h-7" />
                </span>
                <span className="mt-3 font-semibold text-ink-900">
                  {b.title}
                </span>
                <span className="mt-0.5 text-sm text-ink-500">
                  {b.subtitle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-ink-900 mb-6">Kategoriler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-ink-200 bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-brand-700/10"
            >
              <span className="grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-md shadow-brand-700/25 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <CategoryIcon slug={c.slug} name={c.name} className="w-6 h-6" />
              </span>
              <span className="text-sm font-medium text-ink-800">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Öne çıkanlar */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-ink-900">
              Öne Çıkan Ürünler
            </h2>
            <Link
              href="/urunler"
              className="text-sm font-medium text-brand-700 hover:underline"
            >
              Tümünü gör →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Yeni ürünler */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-ink-900 mb-6">Yeni Eklenenler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {newest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
