import Link from "next/link";
import { getCategories, getProducts } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export const metadata = { title: "Tüm Ürünler" };

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-ink-500 mb-4">
        <Link href="/" className="hover:text-brand-700">
          Ana Sayfa
        </Link>{" "}
        / <span className="text-ink-700">Tüm Ürünler</span>
      </nav>
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Tüm Ürünler</h1>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <h2 className="font-semibold text-ink-900 mb-3">Kategoriler</h2>
          <ul className="space-y-1">
            <li>
              <Link
                href="/urunler"
                className="block rounded-lg px-3 py-2 text-sm bg-brand-50 text-brand-800 font-medium"
              >
                Tümü ({products.length})
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/kategori/${c.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-100"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
