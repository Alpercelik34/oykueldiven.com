import Link from "next/link";
import { getOrderById, getSettings } from "@/lib/db";
import { formatTRY } from "@/lib/format";

export const metadata = { title: "Siparişiniz Alındı" };

export default async function OrderReceivedPage(
  props: PageProps<"/siparis-alindi">,
) {
  const params = await props.searchParams;
  const id = typeof params.id === "string" ? params.id : "";
  const [order, settings] = await Promise.all([
    id ? getOrderById(id) : Promise.resolve(undefined),
    getSettings(),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-brand-200 bg-white p-8 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">
          Siparişiniz alındı!
        </h1>
        <p className="mt-2 text-ink-600">
          Teşekkür ederiz. Siparişiniz en kısa sürede hazırlanacaktır.
        </p>
        {order && (
          <p className="mt-1 text-sm text-ink-500">
            Sipariş No: <span className="font-mono font-semibold">{order.id}</span>
          </p>
        )}
      </div>

      {order && (
        <div className="mt-6 rounded-xl border border-ink-200 bg-white p-6">
          <h2 className="font-semibold text-ink-900 mb-3">Sipariş Detayı</h2>
          <ul className="space-y-2 text-sm">
            {order.items.map((i) => (
              <li key={i.productId} className="flex justify-between">
                <span className="text-ink-700">
                  {i.qty}× {i.name}
                </span>
                <span className="font-medium">{formatTRY(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-ink-200 pt-3 flex justify-between">
            <span className="font-semibold">Toplam</span>
            <span className="font-bold text-brand-700">
              {formatTRY(order.total)}
            </span>
          </div>

          {order.paymentMethod === "havale" && (
            <div className="mt-4 rounded-lg bg-ink-100 p-4 text-sm">
              <p className="font-medium text-ink-900 mb-1">
                Havale / EFT Bilgileri
              </p>
              <p className="text-ink-700">Banka: {settings.bankName}</p>
              <p className="text-ink-700">Hesap: {settings.accountName}</p>
              <p className="text-ink-700">IBAN: {settings.iban}</p>
              <p className="mt-2 text-xs text-ink-500">
                Açıklama kısmına sipariş numaranızı ({order.id}) yazmayı
                unutmayın.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/urunler"
          className="inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Alışverişe Devam Et
        </Link>
      </div>
    </div>
  );
}
