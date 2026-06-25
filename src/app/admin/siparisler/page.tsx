import { getOrders } from "@/lib/db";
import { formatTRY } from "@/lib/format";
import { updateOrderStatusAction } from "../actions";
import type { Order } from "@/lib/types";

const statusLabels: Record<Order["status"], string> = {
  yeni: "Yeni",
  hazirlaniyor: "Hazırlanıyor",
  kargolandi: "Kargolandı",
  iptal: "İptal",
};

const paymentLabels: Record<Order["paymentMethod"], string> = {
  havale: "Havale/EFT",
  kapida: "Kapıda Ödeme",
  "kredi-karti": "Kredi Kartı",
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Siparişler</h1>

      {orders.length === 0 ? (
        <p className="text-ink-500">Henüz sipariş bulunmuyor.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-xl border border-ink-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-ink-900">
                      {o.id}
                    </span>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="mt-1 text-sm text-ink-600">
                    {new Date(o.createdAt).toLocaleString("tr-TR")} ·{" "}
                    {paymentLabels[o.paymentMethod]}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-brand-700">
                    {formatTRY(o.total)}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="text-sm">
                  <p className="font-medium text-ink-900">Müşteri</p>
                  <p className="text-ink-700">{o.customer.name}</p>
                  <p className="text-ink-700">{o.customer.phone}</p>
                  {o.customer.email && (
                    <p className="text-ink-700">{o.customer.email}</p>
                  )}
                  <p className="text-ink-700">
                    {o.customer.address}, {o.customer.city}
                  </p>
                  {o.customer.note && (
                    <p className="mt-1 text-ink-500 italic">
                      Not: {o.customer.note}
                    </p>
                  )}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-ink-900">Ürünler</p>
                  <ul className="text-ink-700">
                    {o.items.map((i) => (
                      <li key={i.productId} className="flex justify-between">
                        <span>
                          {i.qty}× {i.name}
                        </span>
                        <span>{formatTRY(i.price * i.qty)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <form
                action={updateOrderStatusAction}
                className="mt-4 flex items-center gap-2 border-t border-ink-100 pt-4"
              >
                <input type="hidden" name="id" value={o.id} />
                <label className="text-sm text-ink-600">Durum:</label>
                <select
                  name="status"
                  defaultValue={o.status}
                  className="rounded-lg border border-ink-300 px-3 py-1.5 text-sm bg-white"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
                >
                  Güncelle
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const styles: Record<Order["status"], string> = {
    yeni: "bg-blue-100 text-blue-700",
    hazirlaniyor: "bg-amber-100 text-amber-700",
    kargolandi: "bg-brand-100 text-brand-800",
    iptal: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
