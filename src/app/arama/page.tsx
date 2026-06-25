import Link from "next/link";
import { searchProducts } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export const metadata = { title: "Arama Sonuçları" };

export default async function SearchPage(props: PageProps<"/arama">) {
  const params = await props.searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const results = q ? await searchProducts(q) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-ink-500 mb-4">
        <Link href="/" className="hover:text-brand-700">
          Ana Sayfa
        </Link>{" "}
        / <span className="text-ink-700">Arama</span>
      </nav>

      <h1 className="text-2xl font-bold text-ink-900">
        &quot;{q}&quot; için sonuçlar
      </h1>
      <p className="mt-1 text-ink-500">{results.length} ürün bulundu</p>

      {results.length === 0 ? (
        <div className="mt-8 rounded-xl border border-ink-200 bg-white p-8 text-center">
          <p className="text-ink-600">
            Aradığınız kriterlere uygun ürün bulunamadı.
          </p>
          <Link
            href="/urunler"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Tüm ürünleri gör
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
