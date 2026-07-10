"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CACHE_TAGS } from "@/lib/db";
import {
  checkPassword,
  clearSession,
  isAuthed,
  setSession,
} from "@/lib/auth";
import {
  deleteCategory,
  deleteProduct,
  getSettings,
  saveCategory,
  saveProduct,
  saveSettings,
  updateOrderStatus,
} from "@/lib/db";
import { slugify } from "@/lib/format";
import {
  LOGO_SIZES,
  THEMES,
  type AboutStat,
  type LogoSize,
  type Settings,
  type ThemeKey,
  type TrustBadge,
} from "@/lib/settings";
import type { Category, Order, Product } from "@/lib/types";

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (checkPassword(password)) {
    await setSession();
    redirect("/admin");
  }
  redirect("/admin?error=1");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/admin");
}

async function requireAuth() {
  if (!(await isAuthed())) {
    throw new Error("Yetkisiz erişim.");
  }
}

export async function saveProductAction(formData: FormData): Promise<void> {
  await requireAuth();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const oldPriceRaw = String(formData.get("oldPrice") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const image =
    String(formData.get("image") ?? "").trim() || "/products/placeholder.svg";
  const unit = String(formData.get("unit") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const stock = Number(formData.get("stock") ?? 0);
  const featured = formData.get("featured") === "on";

  if (!name || !category || !(price > 0)) {
    redirect("/admin/urunler?error=eksik");
  }

  const finalId = id || "p" + Date.now().toString(36);
  const product: Product = {
    id: finalId,
    slug: slugify(name) + "-" + finalId.slice(-4),
    name,
    description,
    price,
    oldPrice: oldPriceRaw ? Number(oldPriceRaw) : undefined,
    category,
    image,
    unit: unit || undefined,
    brand: brand || undefined,
    sku: sku || undefined,
    stock: Math.max(0, Math.floor(stock)),
    featured,
    createdAt: new Date().toISOString(),
  };

  await saveProduct(product);
  updateTag(CACHE_TAGS.products);
  revalidatePath("/admin/urunler");
  revalidatePath("/urunler");
  revalidatePath("/");
  redirect("/admin/urunler?ok=1");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteProduct(id);
    updateTag(CACHE_TAGS.products);
    revalidatePath("/admin/urunler");
    revalidatePath("/urunler");
  }
  redirect("/admin/urunler?ok=silindi");
}

export async function saveSettingsAction(formData: FormData): Promise<void> {
  await requireAuth();

  const current = await getSettings();
  // Boş bırakılırsa eski değeri korur (zorunlu alanlar için).
  const str = (key: string, fallback: string) =>
    String(formData.get(key) ?? fallback).trim() || fallback;
  // Boş bırakılmasına izin verilen (opsiyonel) alanlar.
  const raw = (key: string) => String(formData.get(key) ?? "").trim();
  const num = (key: string, fallback: number) => {
    const n = Number(formData.get(key));
    return Number.isFinite(n) ? Math.max(0, n) : fallback;
  };

  const themeInput = String(formData.get("theme") ?? current.theme);
  const theme: ThemeKey = (
    Object.keys(THEMES) as ThemeKey[]
  ).includes(themeInput as ThemeKey)
    ? (themeInput as ThemeKey)
    : current.theme;

  const sizeInput = String(formData.get("logoSize") ?? current.logoSize);
  const logoSize: LogoSize = (
    Object.keys(LOGO_SIZES) as LogoSize[]
  ).includes(sizeInput as LogoSize)
    ? (sizeInput as LogoSize)
    : current.logoSize;

  // trustBadges ve aboutStats, formdan JSON dizisi olarak gelir.
  const parseList = <T>(key: string, fallback: T[]): T[] => {
    try {
      const v = JSON.parse(String(formData.get(key) ?? "[]"));
      return Array.isArray(v) ? (v as T[]) : fallback;
    } catch {
      return fallback;
    }
  };

  const settings: Settings = {
    siteName: str("siteName", current.siteName),
    tagline: str("tagline", current.tagline),
    logoLetter: str("logoLetter", current.logoLetter).slice(0, 2),
    logoUrl: raw("logoUrl"),
    logoSize,
    theme,
    announcement: str("announcement", current.announcement),
    freeShippingLimit: num("freeShippingLimit", current.freeShippingLimit),
    shippingCost: num("shippingCost", current.shippingCost),
    heroBadge: str("heroBadge", current.heroBadge),
    heroTitle: str("heroTitle", current.heroTitle),
    heroHighlight: str("heroHighlight", current.heroHighlight),
    heroSubtitle: str("heroSubtitle", current.heroSubtitle),
    heroPrimaryBtn: str("heroPrimaryBtn", current.heroPrimaryBtn),
    heroSecondaryBtn: str("heroSecondaryBtn", current.heroSecondaryBtn),
    trustBadges: parseList<TrustBadge>("trustBadges", current.trustBadges)
      .filter((b) => b && (b.title || b.subtitle || b.icon))
      .map((b) => ({
        icon: String(b.icon ?? "").slice(0, 4),
        title: String(b.title ?? ""),
        subtitle: String(b.subtitle ?? ""),
      })),
    aboutText: String(formData.get("aboutText") ?? current.aboutText).trim(),
    aboutStats: parseList<AboutStat>("aboutStats", current.aboutStats)
      .filter((s) => s && (s.value || s.label))
      .map((s) => ({ value: String(s.value ?? ""), label: String(s.label ?? "") })),
    phone: str("phone", current.phone),
    whatsapp: str("whatsapp", current.whatsapp),
    email: str("email", current.email),
    address: str("address", current.address),
    instagram: raw("instagram"),
    facebook: raw("facebook"),
    twitter: raw("twitter"),
    youtube: raw("youtube"),
    payHavale: formData.get("payHavale") === "on",
    payKapida: formData.get("payKapida") === "on",
    payKart: formData.get("payKart") === "on",
    bankName: str("bankName", current.bankName),
    iban: str("iban", current.iban),
    accountName: str("accountName", current.accountName),
    footerNote: raw("footerNote"),
  };

  await saveSettings(settings);
  // Tüm sayfaları tazele (görünüm her yerde değişebilir).
  updateTag(CACHE_TAGS.settings);
  revalidatePath("/", "layout");
  redirect("/admin/gorunum?ok=1");
}

// ---- Kategori yönetimi ----
export async function saveCategoryAction(formData: FormData): Promise<void> {
  await requireAuth();
  const originalSlug = String(formData.get("originalSlug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sort = Number(formData.get("sort") ?? 0);

  if (!name) redirect("/admin/kategoriler?error=1");

  // Yeni kayıtta slug isimden üretilir; düzenlemede mevcut slug korunur.
  const slug = originalSlug || slugify(name);
  const category: Category = {
    slug,
    name,
    description: description || undefined,
    sort: Number.isFinite(sort) ? sort : 0,
  };

  await saveCategory(category);
  updateTag(CACHE_TAGS.categories);
  revalidatePath("/", "layout");
  revalidatePath("/admin/kategoriler");
  redirect("/admin/kategoriler?ok=1");
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await requireAuth();
  const slug = String(formData.get("slug") ?? "");
  if (slug) {
    await deleteCategory(slug);
    updateTag(CACHE_TAGS.categories);
    revalidatePath("/", "layout");
    revalidatePath("/admin/kategoriler");
  }
  redirect("/admin/kategoriler?ok=silindi");
}

export async function updateOrderStatusAction(
  formData: FormData,
): Promise<void> {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as Order["status"];
  if (id && status) {
    await updateOrderStatus(id, status);
    revalidatePath("/admin/siparisler");
  }
}
