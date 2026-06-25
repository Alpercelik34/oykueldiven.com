# MediTedarik — Medikal E-Ticaret Sitesi

Eldiven, maske, dezenfektan ve tıbbi sarf malzemeleri için sepet, ödeme akışı ve
**kendi yönetebileceğiniz admin paneli** olan bir e-ticaret sitesi.
Next.js 16 + React 19 + Tailwind CSS v4 ile yazıldı. Veriler `data/` klasöründe
JSON dosyalarında tutulur — ayrıca veritabanı kurmanıza gerek yoktur.

## Kurulum ve Çalıştırma

İki seçenek var:

**A) Doğrudan Node ile (JSON modu, en hızlı başlangıç):**
```bash
npm install
npm run dev
```

**B) Docker ile (canlıdaki gibi gerçek Postgres veritabanıyla):**
```bash
docker compose up
docker compose exec web npm run seed   # ilk seferde
```
Ayrıntılar: **[DOCKER.md](DOCKER.md)**

Tarayıcıda aç: <http://localhost:3000>

## Yönetim Paneli (Admin)

- Adres: <http://localhost:3000/admin>
- Şifre: `.env.local` dosyasındaki `ADMIN_PASSWORD` değeri (varsayılan: `admin123`).
  **Yayına almadan önce mutlaka değiştirin.**

Panelden yapabilecekleriniz:

- **Ürünler:** ürün ekleme, düzenleme, silme; fiyat/indirim, stok, marka, kategori,
  görsel URL'si ve "öne çıkan" ayarı.
- **Siparişler:** gelen siparişleri görme ve durum güncelleme
  (Yeni → Hazırlanıyor → Kargolandı / İptal).
- **Görünüm & İçerik:** kod yazmadan renk teması, logo harfi, firma adı, slogan,
  üst duyuru şeridi, ana sayfa başlık/metinleri, "Hakkımızda" yazısı, iletişim
  bilgileri ve banka/IBAN bilgilerini değiştirme. Kaydedince site genelinde
  anında geçerli olur.
- **Özet:** ürün/sipariş/ciro istatistikleri ve stoğu azalan ürünler.

## Firma Bilgileri ve Görünüm

Firma adı, iletişim, renkler ve metinler artık **admin → Görünüm & İçerik**
bölümünden kodsuz değiştirilir. Veriler `data/settings.json` dosyasında tutulur;
varsayılan değerler `src/lib/settings.ts` içindedir.

## Ürün Görselleri

Örnek ürünler otomatik üretilmiş yer tutucu SVG'ler kullanır
(`public/products/`). Gerçek fotoğraflarınızı bu klasöre koyup admin panelden
ilgili ürünün "Görsel URL" alanına `/products/dosya-adi.jpg` yazın
(veya doğrudan bir https:// görsel adresi).

## Online Kredi Kartı Ödemesi (Sonraki Adım)

Şu an sipariş kaydedilir; ödeme **Havale/EFT** veya **Kapıda Ödeme** ile alınır.
Online kredi kartı için Türkiye'de yaygın **iyzico** veya **PayTR** entegrasyonu
eklenmelidir. Entegrasyon noktası: `src/app/actions/orders.ts` içinde sipariş
kaydedildikten sonra ödeme sağlayıcısına yönlendirme yapılır. Bu adım için
sağlayıcıdan API anahtarı (merchant key) almanız gerekir.

## Veri Depolama (Yerel vs Canlı)

Veri katmanı **çift modludur** (`src/lib/db.ts`):

- **Yerelde** (`DATABASE_URL` tanımlı değilse): `data/*.json` dosyaları kullanılır.
  Kurulum gerektirmez, geliştirme kolaydır.
- **Canlıda** (`DATABASE_URL` tanımlıysa): otomatik olarak **Postgres** veritabanı
  kullanılır (`src/lib/db-postgres.ts`). Veriler kalıcı olur.

Veritabanını başlangıç verisiyle doldurmak için:

```bash
DATABASE_URL="postgres://..." npm run seed
```

## Yayına Alma (Deploy)

Adım adım kılavuz için **[DEPLOY.md](DEPLOY.md)** dosyasına bakın
(Supabase ücretsiz Postgres + Vercel + alan adı).

## Proje Yapısı

```
data/                 Ürün, kategori ve sipariş verileri (JSON)
src/lib/              Veri katmanı (db.ts), tipler, sepet, yardımcılar, site bilgisi
src/components/       Header, Footer, ürün kartı, sepete ekle butonu
src/app/              Sayfalar (ana sayfa, ürünler, kategori, sepet, ödeme, admin)
src/app/admin/        Yönetim paneli ve server action'lar
public/products/      Ürün görselleri
```
