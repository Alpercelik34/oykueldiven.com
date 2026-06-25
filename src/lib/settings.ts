import type { CSSProperties } from "react";

export type ThemeKey =
  | "teal"
  | "blue"
  | "indigo"
  | "sky"
  | "rose"
  | "violet";

export type TrustBadge = { icon: string; title: string; subtitle: string };
export type AboutStat = { value: string; label: string };
export type LogoSize = "kucuk" | "orta" | "buyuk" | "cok-buyuk";

// Logo boyutuna göre CSS sınıfları (harf logosu ve yüklenen görsel için).
export const LOGO_SIZES: Record<
  LogoSize,
  { label: string; badge: string; text: string; img: string }
> = {
  kucuk: { label: "Küçük", badge: "w-9 h-9", text: "text-lg", img: "h-9" },
  orta: { label: "Orta", badge: "w-12 h-12", text: "text-2xl", img: "h-14" },
  buyuk: { label: "Büyük", badge: "w-16 h-16", text: "text-3xl", img: "h-20" },
  "cok-buyuk": {
    label: "Çok Büyük",
    badge: "w-20 h-20",
    text: "text-4xl",
    img: "h-24",
  },
};

export type Settings = {
  // Marka
  siteName: string;
  tagline: string;
  logoLetter: string;
  logoUrl: string; // yüklenen logo görseli (boşsa harf kullanılır)
  logoSize: LogoSize;
  theme: ThemeKey;
  // Üst şerit
  announcement: string;
  freeShippingLimit: number;
  shippingCost: number; // limit altı kargo ücreti
  // Ana sayfa (hero)
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroPrimaryBtn: string;
  heroSecondaryBtn: string;
  // Ana sayfa güven rozetleri
  trustBadges: TrustBadge[];
  // Hakkımızda (paragrafları boş satırla ayırın)
  aboutText: string;
  aboutStats: AboutStat[];
  // İletişim
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  // Sosyal medya (boş bırakılırsa gösterilmez)
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  // Ödeme yöntemleri (açık/kapalı)
  payHavale: boolean;
  payKapida: boolean;
  payKart: boolean;
  // Banka / havale
  bankName: string;
  iban: string;
  accountName: string;
  // Footer
  footerNote: string;
};

export const DEFAULT_SETTINGS: Settings = {
  siteName: "MediTedarik",
  tagline: "Medikal ve Hijyen Ürünleri Toptan Tedarik",
  logoLetter: "M",
  logoUrl: "",
  logoSize: "orta",
  theme: "teal",
  announcement:
    "1.000 TL üzeri siparişlerde kargo ücretsiz 🚚",
  freeShippingLimit: 1000,
  shippingCost: 49.9,
  heroBadge: "Toptan & Perakende Medikal Tedarik",
  heroTitle: "Sağlık ve hijyen ürünlerinde",
  heroHighlight: "güvenilir adres",
  heroSubtitle:
    "Muayene eldiveni, cerrahi eldiven, maske, dezenfektan ve tıbbi sarf malzemeleri. Hızlı kargo, uygun fiyat, kurumsal fatura.",
  heroPrimaryBtn: "Ürünleri İncele",
  heroSecondaryBtn: "WhatsApp ile Teklif Al",
  trustBadges: [
    { icon: "🚚", title: "Hızlı Kargo", subtitle: "Aynı gün gönderim" },
    { icon: "💳", title: "Güvenli Ödeme", subtitle: "Kredi kartı & havale" },
    { icon: "📋", title: "Kurumsal Fatura", subtitle: "e-Fatura imkânı" },
    { icon: "✅", title: "Orijinal Ürün", subtitle: "CE / sertifikalı" },
  ],
  aboutText: `MediTedarik, sağlık kuruluşları, eczaneler, klinikler ve işletmeler için medikal ve hijyen ürünleri tedarik eden bir kuruluştur. Muayene ve cerrahi eldivenden maske, dezenfektan ve tıbbi sarf malzemelerine kadar geniş bir ürün yelpazesi sunuyoruz.

Amacımız; orijinal, sertifikalı (CE) ürünleri uygun fiyatlarla, hızlı ve güvenilir biçimde sizlere ulaştırmaktır. Hem perakende hem de toptan satış imkânı sağlıyor, kurumsal müşterilerimize özel fiyat ve e-fatura çözümleri sunuyoruz.

Sorularınız ve toptan teklifleriniz için bizimle her zaman iletişime geçebilirsiniz.`,
  aboutStats: [
    { value: "10.000+", label: "Mutlu müşteri" },
    { value: "500+", label: "Ürün çeşidi" },
    { value: "Aynı gün", label: "Kargo imkânı" },
  ],
  phone: "0850 000 00 00",
  whatsapp: "905000000000",
  email: "info@meditedarik.com",
  address: "Örnek Mah. Sağlık Cad. No:1, İstanbul",
  instagram: "",
  facebook: "",
  twitter: "",
  youtube: "",
  payHavale: true,
  payKapida: true,
  payKart: false,
  bankName: "Örnek Bankası",
  iban: "TR00 0000 0000 0000 0000 0000 00",
  accountName: "MediTedarik Medikal Ltd. Şti.",
  footerNote: "Bu site örnek/şablon amaçlıdır.",
};

type Palette = Record<
  "50" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900",
  string
>;

export const THEMES: Record<ThemeKey, { label: string; palette: Palette }> = {
  teal: {
    label: "Yeşil / Teal",
    palette: {
      "50": "#f0fdfa", "100": "#ccfbf1", "200": "#99f6e4", "300": "#5eead4",
      "400": "#2dd4bf", "500": "#14b8a6", "600": "#0d9488", "700": "#0f766e",
      "800": "#115e59", "900": "#134e4a",
    },
  },
  blue: {
    label: "Mavi",
    palette: {
      "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd",
      "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8",
      "800": "#1e40af", "900": "#1e3a8a",
    },
  },
  indigo: {
    label: "Lacivert / Indigo",
    palette: {
      "50": "#eef2ff", "100": "#e0e7ff", "200": "#c7d2fe", "300": "#a5b4fc",
      "400": "#818cf8", "500": "#6366f1", "600": "#4f46e5", "700": "#4338ca",
      "800": "#3730a3", "900": "#312e81",
    },
  },
  sky: {
    label: "Açık Mavi / Sky",
    palette: {
      "50": "#f0f9ff", "100": "#e0f2fe", "200": "#bae6fd", "300": "#7dd3fc",
      "400": "#38bdf8", "500": "#0ea5e9", "600": "#0284c7", "700": "#0369a1",
      "800": "#075985", "900": "#0c4a6e",
    },
  },
  rose: {
    label: "Kırmızı / Rose",
    palette: {
      "50": "#fff1f2", "100": "#ffe4e6", "200": "#fecdd3", "300": "#fda4af",
      "400": "#fb7185", "500": "#f43f5e", "600": "#e11d48", "700": "#be123c",
      "800": "#9f1239", "900": "#881337",
    },
  },
  violet: {
    label: "Mor / Violet",
    palette: {
      "50": "#f5f3ff", "100": "#ede9fe", "200": "#ddd6fe", "300": "#c4b5fd",
      "400": "#a78bfa", "500": "#8b5cf6", "600": "#7c3aed", "700": "#6d28d9",
      "800": "#5b21b6", "900": "#4c1d95",
    },
  },
};

/** Seçilen temanın CSS değişkenlerini (inline style) üretir. */
export function themeCssVars(theme: ThemeKey): CSSProperties {
  const palette = (THEMES[theme] ?? THEMES.teal).palette;
  const vars: Record<string, string> = {};
  for (const [shade, color] of Object.entries(palette)) {
    vars[`--color-brand-${shade}`] = color;
  }
  return vars as CSSProperties;
}
