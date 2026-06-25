import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { getCategories, getSettings } from "@/lib/db";
import { SettingsProvider } from "@/lib/settings-context";
import { themeCssVars } from "@/lib/settings";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Tüm siteyi istek anında (dinamik) render et. Veriler veritabanından geldiği
// için build sırasında statik üretim yapılmaz — böylece canlı build DB'ye
// bağlanmaya çalışıp takılmaz ve admin değişiklikleri anında yansır.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: `${settings.siteName} — ${settings.tagline}`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.heroSubtitle,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSettings(),
  ]);
  return (
    <html lang="tr" className={`${geistSans.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-ink-50 text-ink-900"
        style={themeCssVars(settings.theme)}
      >
        <SettingsProvider settings={settings}>
          <CartProvider>
            <Header categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer categories={categories} settings={settings} />
            <FloatingContact
              phone={settings.phone}
              whatsapp={settings.whatsapp}
            />
          </CartProvider>
        </SettingsProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
