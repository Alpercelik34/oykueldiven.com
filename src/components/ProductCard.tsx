import Link from "next/link";
import { formatTRY } from "@/lib/format";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : 0;

  return (
    <div className="group flex flex-col rounded-xl border border-ink-200 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-700/10 hover:border-brand-200">
      <Link href={`/urunler/${product.slug}`} className="relative block">
        <div className="aspect-square bg-ink-50 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        {discount > 0 && (
          <span className="absolute top-2 left-2 rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white">
            %{discount} İNDİRİM
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute top-2 right-2 rounded-md bg-ink-700 px-2 py-1 text-xs font-bold text-white">
            Tükendi
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        {product.brand && (
          <span className="text-xs text-brand-700 font-medium">
            {product.brand}
          </span>
        )}
        <Link href={`/urunler/${product.slug}`}>
          <h3 className="text-sm font-medium text-ink-900 line-clamp-2 min-h-10 hover:text-brand-700">
            {product.name}
          </h3>
        </Link>
        {product.unit && (
          <span className="mt-1 text-xs text-ink-500">{product.unit}</span>
        )}

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-ink-900">
              {formatTRY(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-sm text-ink-500 line-through">
                {formatTRY(product.oldPrice)}
              </span>
            )}
          </div>
          <div className="mt-2">
            <AddToCartButton
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
        </div>
      </div>
    </div>
  );
}
