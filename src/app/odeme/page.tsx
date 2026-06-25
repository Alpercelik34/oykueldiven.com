"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatTRY } from "@/lib/format";
import { useSettings } from "@/lib/settings-context";
import { createOrder } from "@/app/actions/orders";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const site = useSettings();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shipping =
    total >= site.freeShippingLimit || total === 0 ? 0 : site.shippingCost;
  const grandTotal = total + shipping;

  const paymentMethods = [
    site.payHavale && {
      value: "havale",
      label: "Havale / EFT",
      desc: "Sipariş sonrası banka bilgileri gönderilir.",
    },
    site.payKapida && {
      value: "kapida",
      label: "Kapıda Ödeme",
      desc: "Teslimatta nakit veya kart ile ödeme.",
    },
    site.payKart && {
      value: "kredi-karti",
      label: "Kredi Kartı (Online)",
      desc: "Online ödeme altyapısı (iyzico/PayTR) ile.",
    },
  ].filter(Boolean) as { value: string; label: string; desc: string }[];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set(
      "items",
      JSON.stringify(items.map((i) => ({ productId: i.productId, qty: i.qty }))),
    );
    const result = await createOrder(formData);
    if (result.ok) {
      clear();
      router.push(`/siparis-alindi?id=${result.orderId}`);
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink-900">Sepetiniz boş</h1>
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
      <h1 className="text-2xl font-bold text-ink-900 mb-6">
        Siparişi Tamamla
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Teslimat bilgileri */}
          <section className="rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="font-semibold text-ink-900 mb-4">
              Teslimat Bilgileri
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Ad Soyad / Firma *" required />
              <Field name="phone" label="Telefon *" required type="tel" />
              <Field name="email" label="E-posta" type="email" />
              <Field name="city" label="İl / İlçe *" required />
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-ink-700 mb-1">
                  Adres *
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-ink-700 mb-1">
                  Sipariş Notu
                </label>
                <textarea
                  name="note"
                  rows={2}
                  className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </section>

          {/* Ödeme yöntemi */}
          <section className="rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="font-semibold text-ink-900 mb-4">Ödeme Yöntemi</h2>
            <div className="space-y-2">
              {paymentMethods.map((m, i) => (
                <PaymentOption
                  key={m.value}
                  value={m.value}
                  label={m.label}
                  desc={m.desc}
                  defaultChecked={i === 0}
                />
              ))}
              {paymentMethods.length === 0 && (
                <p className="text-sm text-ink-500">
                  Şu an aktif ödeme yöntemi yok. Lütfen bizimle iletişime geçin.
                </p>
              )}
            </div>
          </section>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>

        {/* Özet */}
        <aside className="h-fit rounded-xl border border-ink-200 bg-white p-5">
          <h2 className="font-semibold text-ink-900 mb-4">Sipariş Özeti</h2>
          <ul className="space-y-2 text-sm max-h-60 overflow-auto">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2">
                <span className="text-ink-700 line-clamp-1">
                  {i.qty}× {i.name}
                </span>
                <span className="font-medium whitespace-nowrap">
                  {formatTRY(i.price * i.qty)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-ink-200 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-600">Ara Toplam</dt>
              <dd>{formatTRY(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-600">Kargo</dt>
              <dd>{shipping === 0 ? "Ücretsiz" : formatTRY(shipping)}</dd>
            </div>
            <div className="flex justify-between text-base border-t border-ink-200 pt-2">
              <dt className="font-semibold">Toplam</dt>
              <dd className="font-bold text-brand-700">
                {formatTRY(grandTotal)}
              </dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Gönderiliyor..." : "Siparişi Onayla"}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  required,
  type = "text",
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-700 mb-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-ink-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}

function PaymentOption({
  value,
  label,
  desc,
  defaultChecked,
}: {
  value: string;
  label: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-ink-200 p-3 cursor-pointer hover:border-brand-300 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
      <input
        type="radio"
        name="paymentMethod"
        value={value}
        defaultChecked={defaultChecked}
        className="mt-1"
      />
      <span>
        <span className="block text-sm font-medium text-ink-900">{label}</span>
        <span className="block text-xs text-ink-500">{desc}</span>
      </span>
    </label>
  );
}
