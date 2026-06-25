import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategory,
  getProduct,
  getProducts,
  getProductsByCategory,
  getSettings,
} from "@/lib/db";
import { formatTRY } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/urunler/[slug]">) {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  return { title: product?.name ?? "Ürün" };
}

export default async function ProductDetailPage(
  props: PageProps<"/urunler/[slug]">,
) {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const category = await getCategory(product.category);
  const settings = await getSettings();
  const related = (await getProductsByCategory(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-ink-500 mb-6">
        <Link href="/" className="hover:text-brand-700">
          Ana Sayfa
        </Link>{" "}
        /{" "}
        <Link href="/urunler" className="hover:text-brand-700">
          Ürünler
        </Link>{" "}
        {category && (
          <>
            /{" "}
            <Link
              href={`/kategori/${category.slug}`}
              className="hover:text-brand-700"
            >
              {category.name}
            </Link>{" "}
          </>
        )}
        / <span className="text-ink-700">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative rounded-2xl border border-ink-200 bg-white overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 rounded-md bg-red-500 px-3 py-1 text-sm font-bold text-white">
              %{discount} İNDİRİM
            </span>
          )}
        </div>

        <div>
          {product.brand && (
            <span className="text-sm font-medium text-brand-700">
              {product.brand}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mt-1">
            {product.name}
          </h1>
          {product.sku && (
            <p className="mt-1 text-sm text-ink-500">Ürün Kodu: {product.sku}</p>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-ink-900">
              {formatTRY(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-lg text-ink-500 line-through">
                {formatTRY(product.oldPrice)}
              </span>
            )}
          </div>
          {product.unit && (
            <p className="mt-1 text-sm text-ink-600">
              Satış birimi: {product.unit}
            </p>
          )}

          <div className="mt-3">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1 text-sm text-brand-700 font-medium">
                ● Stokta var ({product.stock} adet)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm text-red-600 font-medium">
                ● Tükendi
              </span>
            )}
          </div>

          <p className="mt-4 text-ink-700 leading-relaxed">
            {product.description}
          </p>

          {product.stock > 0 && (
            <div className="mt-6 max-w-sm">
              <AddToCartButton
                withQty
                item={{
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  unit: product.unit,
                }}
              />
            </div>
          )}

          <div className="mt-6 rounded-xl bg-ink-100 p-4 text-sm text-ink-700">
            <p className="font-medium text-ink-900 mb-1">Sipariş ve bilgi</p>
            Toptan fiyat ve stok durumu için{" "}
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 font-medium hover:underline"
            >
              WhatsApp
            </a>{" "}
            veya {settings.phone} numarasından bize ulaşabilirsiniz.
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-ink-900 mb-4">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
