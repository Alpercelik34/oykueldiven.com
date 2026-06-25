import Link from "next/link";
import { getOrders, getProducts } from "@/lib/db";
import { formatTRY } from "@/lib/format";

export default async function AdminDashboard() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);
  const newOrders = orders.filter((o) => o.status === "yeni").length;
  const revenue = orders
    .filter((o) => o.status !== "iptal")
    .reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 20);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Özet</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ürün" value={String(products.length)} />
        <Stat label="Toplam Sipariş" value={String(orders.length)} />
        <Stat label="Yeni Sipariş" value={String(newOrders)} highlight />
        <Stat label="Toplam Ciro" value={formatTRY(revenue)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-ink-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-ink-900">Son Siparişler</h2>
            <Link
              href="/admin/siparisler"
              className="text-sm text-brand-700 hover:underline"
            >
              Tümü →
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-ink-500">Henüz sipariş yok.</p>
          ) : (
            <ul className="divide-y divide-ink-100 text-sm">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex justify-between py-2">
                  <span>
                    <span className="font-mono text-xs text-ink-500">
                      {o.id}
                    </span>{" "}
                    — {o.customer.name}
                  </span>
                  <span className="font-medium">{formatTRY(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-ink-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-ink-900">Stoğu Azalanlar</h2>
            <Link
              href="/admin/urunler"
              className="text-sm text-brand-700 hover:underline"
            >
              Ürünler →
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-ink-500">Stok durumu iyi görünüyor.</p>
          ) : (
            <ul className="divide-y divide-ink-100 text-sm">
              {lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="flex justify-between py-2">
                  <span className="line-clamp-1">{p.name}</span>
                  <span
                    className={`font-medium ${p.stock === 0 ? "text-red-600" : "text-amber-600"}`}
                  >
                    {p.stock} adet
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${highlight ? "border-brand-300 bg-brand-50" : "border-ink-200 bg-white"}`}
    >
      <div className="text-sm text-ink-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-ink-900">{value}</div>
    </div>
  );
}
