# Docker ile Geliştirme

Bu proje Docker ile, canlıdaki gibi gerçek bir **Postgres veritabanı** yanında
geliştirilebilir. Tek gereken: bilgisayarında **Docker Desktop** kurulu olması.

## Hızlı Başlangıç

```bash
# 1) Uygulamayı + veritabanını başlat
docker compose up

# 2) (Sadece ilk seferde, yeni bir terminalde) veritabanını doldur
docker compose exec web npm run seed
```

Aç: <http://localhost:3000>  •  Panel: <http://localhost:3000/admin> (şifre: `admin123`)

İlk başlatmada bağımlılıklar container içinde kurulur, biraz sürebilir.
Sonraki başlatmalar hızlıdır.

## Ne çalışıyor?

| Servis | Açıklama | Adres |
|---|---|---|
| `web` | Next.js geliştirme sunucusu (canlı kod güncelleme) | localhost:3000 |
| `db`  | Postgres 16 veritabanı | localhost:5432 |

`docker-compose.yml` içinde `DATABASE_URL` tanımlı olduğu için uygulama otomatik
olarak **veritabanı modunda** çalışır (canlı ortamla birebir aynı). Kod
dosyalarını düzenlediğinde değişiklik anında siteye yansır.

## Sık Kullanılan Komutlar

```bash
docker compose up -d        # arka planda başlat
docker compose logs -f web  # uygulama loglarını izle
docker compose exec web sh  # container içinde komut satırı
docker compose exec web npm run seed   # veritabanını başlangıç verisiyle doldur
docker compose down         # durdur (veriler dbdata biriminde kalır)
docker compose down -v      # durdur ve veritabanını da sil (sıfırla)
```

## Veritabanına bağlanmak (isteğe bağlı)

```bash
docker compose exec db psql -U postgres -d medikal
# örn:  select count(*) from products;
```

## JSON moduyla geliştirmek istersem?

Veritabanı istemiyorsan, `docker-compose.yml` içindeki `web` servisinden
`DATABASE_URL` satırını silmen yeterli — uygulama `data/*.json` dosyalarını
kullanır. (Docker olmadan, doğrudan `npm run dev` de aynı şekilde JSON modunda
çalışır.)

## Production (canlı) Docker imajı

Canlı yayın için optimize, küçük bir imaj `Dockerfile` ile üretilir:

```bash
docker build -t medikal-eticaret .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgres://..." \
  -e ADMIN_PASSWORD="güçlü-şifre" \
  medikal-eticaret
```

> Not: En kolay canlı yayın yolu yine Vercel'dir (bkz. [DEPLOY.md](DEPLOY.md)).
> Docker imajı; kendi sunucunda (VPS) barındırmak istersen kullanışlıdır.
