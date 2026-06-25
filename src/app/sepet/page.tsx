"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatTRY } from "@/lib/format";
import { useSettings } from "@/lib/settings-context";

export default function CartPage() {
  const { items, total, setQty, removeItem } = useCart();
  const site = useSettings();

  const shipping =
    total >= site.freeShippingLimit || total === 0 ? 0 : site.shippingCost;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="text-5xl">🛒</div>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">Sepetiniz boş</h1>
        <p className="mt-2 text-ink-500">
          Henüz sepetinize ürün eklemediniz.
        </p>
        <Link
          href="/urunler"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Sepetim</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-xl border border-ink-200 bg-white p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover bg-ink-50"
              />
              <div className="flex-1 min-w-0">
                <Link
                  href={`/urunler/${item.slug}`}
                  className="font-medium text-ink-900 hover:text-brand-700 line-clamp-2"
                >
                  {item.name}
                </Link>
                {item.unit && (
                  <p className="text-xs text-ink-500">{item.unit}</p>
                )}
                <p className="mt-1 text-sm font-semibold text-ink-900">
                  {formatTRY(item.price)}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Kaldır
                </button>
                <div className="flex items-center rounded-lg border border-ink-300">
                  <button
                    onClick={() =>
                      setQty(item.productId, Math.max(1, item.qty - 1))
                    }
                    className="px-2 py-1 hover:bg-ink-100"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.productId, item.qty + 1)}
                    className="px-2 py-1 hover:bg-ink-100"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-bold text-ink-900">
                  {formatTRY(item.price * item.qty)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-xl border border-ink-200 bg-white p-5">
          <h2 className="font-semibold text-ink-900 mb-4">Sipariş Özeti</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-600">Ara Toplam</dt>
              <dd className="font-medium">{formatTRY(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-600">Kargo</dt>
              <dd className="font-medium">
                {shipping === 0 ? "Ücretsiz" : formatTRY(shipping)}
              </dd>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-brand-700">
                {formatTRY(site.freeShippingLimit - total)} daha ekleyin, kargo
                ücretsiz olsun.
              </p>
            )}
            <div className="border-t border-ink-200 pt-2 flex justify-between text-base">
              <dt className="font-semibold">Toplam</dt>
              <dd className="font-bold text-brand-700">
                {formatTRY(grandTotal)}
              </dd>
            </div>
          </dl>
          <Link
            href="/odeme"
            className="mt-5 block rounded-lg bg-brand-600 px-4 py-3 text-center font-semibold text-white hover:bg-brand-700"
          >
            Siparişi Tamamla
          </Link>
          <Link
            href="/urunler"
            className="mt-2 block text-center text-sm text-ink-600 hover:text-brand-700"
          >
            Alışverişe devam et
          </Link>
        </aside>
      </div>
    </div>
  );
}
