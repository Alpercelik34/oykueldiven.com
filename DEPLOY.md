# Canlıya Alma Kılavuzu (Veritabanı + Vercel)

Bu kılavuz; siteyi ücretsiz Postgres veritabanı (Supabase) ve Vercel ile
canlıya almak içindir. Sırayı bozma — özellikle **önce veritabanını hazırla,
sonra Vercel'e yükle.**

Toplam süre: ~30-45 dakika. Hiçbir adımda kod yazmana gerek yok.

---

## 0) Gerekenler
- Bir e-posta adresi (hesap açmak için)
- (İsteğe bağlı, sonra) bir alan adı — ör. `firmaadi.com`

---

## 1) GitHub'a yükle (kodun deposu)
1. <https://github.com> → ücretsiz hesap aç / giriş yap.
2. Sağ üst **+ → New repository** → ad: `medikal-eticaret` → **Private** seç → **Create**.
3. Açılan sayfadaki komutları kullanacağız. Bana haber ver, bu adımı birlikte
   terminalden yapalım (kodu ben göndereyim).

> Not: `.env.local` ve şifreler GitHub'a **gönderilmez** (gitignore ile korunur).

---

## 2) Veritabanını oluştur (Supabase — ücretsiz)
1. <https://supabase.com> → **Start your project** → GitHub ile giriş yap.
2. **New project** → ad ver, güçlü bir **Database Password** belirle (bir yere not et),
   bölge olarak **Frankfurt / EU** seç (Türkiye'ye en yakın) → **Create**.
3. Proje hazır olunca (~2 dk): sol menü **Connect** (üst barda) → **Connection string**
   → **Transaction** sekmesini seç (port **6543**, "pooler").
4. Oradaki bağlantı adresini kopyala. Şöyle görünür:
   ```
   postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```
   `[YOUR-PASSWORD]` yerine 2. adımdaki şifreyi yaz. Bu adres senin **DATABASE_URL**'in.

---

## 3) Veritabanını doldur (başlangıç ürünleri + kategoriler)
Bilgisayarında, proje klasöründe tek komut:

```bash
DATABASE_URL="2. adımdaki adres" npm run seed
```

`✓ Veritabanı hazır.` yazısını görmelisin. (Bu adımı birlikte yapabiliriz.)

---

## 4) Vercel'e yükle (siteyi yayınla)
1. <https://vercel.com> → **Sign up** → GitHub ile giriş yap.
2. **Add New → Project** → 1. adımdaki `medikal-eticaret` deposunu **Import** et.
3. **Environment Variables** bölümüne şu ikisini ekle:
   | Name | Value |
   |---|---|
   | `DATABASE_URL` | 2. adımdaki bağlantı adresi |
   | `ADMIN_PASSWORD` | kendi belirlediğin güçlü panel şifresi |
4. **Deploy** → 1-2 dakikada site yayında. `https://medikal-eticaret-xxx.vercel.app`
   gibi bir adres verir.

---

## 5) Alan adını bağla (kendi .com adresin)
1. Bir kayıt firmasından alan adı al (Natro, isimtescil, GoDaddy vb. — yıllık ~₺300-500).
2. Vercel → proje → **Settings → Domains** → alan adını ekle.
3. Vercel'in verdiği DNS kayıtlarını kayıt firmasının paneline gir (birlikte yaparız).
4. ~1 saat içinde `https://firmaadi.com` yayında, SSL (https) otomatik gelir.

---

## Canlıdayken nasıl yönetirim?
- `https://firmaadi.com/admin` → panel şifren ile gir.
- Ürün ekle/çıkar, sipariş yönet, görünüm/renk değiştir — hepsi **kalıcı** olur,
  çünkü artık veritabanına yazıyor.

## Güncelleme yapınca
Kodda bir değişiklik olursa GitHub'a gönderince Vercel **otomatik** yeniden yayınlar.
İçerik/ürün değişiklikleri için yeniden yayına gerek yok; panelden anında olur.
