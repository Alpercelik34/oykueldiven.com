"use server";

import { getProductById, getSettings, saveOrder } from "@/lib/db";
import type { Order, OrderItem } from "@/lib/types";

type IncomingItem = { productId: string; qty: number };

export type CheckoutResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

export async function createOrder(formData: FormData): Promise<CheckoutResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const paymentMethod = String(
    formData.get("paymentMethod") ?? "havale",
  ) as Order["paymentMethod"];

  if (!name || !phone || !address || !city) {
    return { ok: false, error: "Lütfen zorunlu alanları doldurun." };
  }

  let incoming: IncomingItem[];
  try {
    incoming = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { ok: false, error: "Sepet bilgisi okunamadı." };
  }
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return { ok: false, error: "Sepetiniz boş görünüyor." };
  }

  // Fiyatları sunucudaki güncel verilerden hesapla (güvenlik için).
  const items: OrderItem[] = [];
  for (const i of incoming) {
    const product = await getProductById(i.productId);
    if (!product) continue;
    const qty = Math.max(1, Math.floor(Number(i.qty) || 1));
    items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty,
    });
  }
  if (items.length === 0) {
    return { ok: false, error: "Sepetinizdeki ürünler bulunamadı." };
  }

  const settings = await getSettings();
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping =
    subtotal >= settings.freeShippingLimit ? 0 : settings.shippingCost;
  const total = subtotal + shipping;

  const order: Order = {
    id: "SP" + Date.now().toString(36).toUpperCase(),
    items,
    customer: { name, email, phone, address, city, note },
    total,
    paymentMethod,
    status: "yeni",
    createdAt: new Date().toISOString(),
  };

  await saveOrder(order);

  // NOT: Online kredi kartı ödemesi için burada iyzico/PayTR entegrasyonu
  // devreye girer. Şu an sipariş kaydedilir, ödeme havale/kapıda ile alınır.

  return { ok: true, orderId: order.id };
}
