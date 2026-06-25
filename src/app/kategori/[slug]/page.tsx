import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategories,
  getCategory,
  getProductsByCategory,
} from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/kategori/[slug]">) {
  const { slug } = await props.params;
  const category = await getCategory(slug);
  return { title: category?.name ?? "Kategori" };
}

export default async function CategoryPage(
  props: PageProps<"/kategori/[slug]">,
) {
  const { slug } = await props.params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const [products, categories] = await Promise.all([
    getProductsByCategory(slug),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-ink-500 mb-4">
        <Link href="/" className="hover:text-brand-700">
          Ana Sayfa
        </Link>{" "}
        /{" "}
        <Link href="/urunler" className="hover:text-brand-700">
          Ürünler
        </Link>{" "}
        / <span className="text-ink-700">{category.name}</span>
      </nav>

      <h1 className="text-2xl font-bold text-ink-900">{category.name}</h1>
      {category.description && (
        <p className="mt-2 text-ink-600 max-w-2xl">{category.description}</p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <h2 className="font-semibold text-ink-900 mb-3">Kategoriler</h2>
          <ul className="space-y-1">
            <li>
              <Link
                href="/urunler"
                className="block rounded-lg px-3 py-2 text-sm text-ink-700 hover:bg-ink-100"
              >
                Tümü
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/kategori/${c.slug}`}
                  className={`block rounded-lg px-3 py-2 text-sm ${
                    c.slug === slug
                      ? "bg-brand-50 text-brand-800 font-medium"
                      : "text-ink-700 hover:bg-ink-100"
                  }`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {products.length === 0 ? (
            <p className="text-ink-500">Bu kategoride henüz ürün bulunmuyor.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
