// Veritabanı tablolarını oluşturur ve data/ klasöründeki başlangıç verilerini
// (kategoriler, ürünler, ayarlar) Postgres'e yükler.
//
// Kullanım:
//   DATABASE_URL="postgres://..." node scripts/seed-db.mjs
//
// Not: Mevcut kayıtların üzerine yazar (upsert), siparişlere dokunmaz.
import { promises as fs } from "fs";
import path from "path";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("HATA: DATABASE_URL ortam değişkeni tanımlı değil.");
  process.exit(1);
}

function needsSsl(u) {
  if (/sslmode=disable/.test(u)) return false;
  if (/sslmode=require/.test(u)) return true;
  if (/@(localhost|127\.0\.0\.1|db|postgres|host\.docker\.internal)[:/]/.test(u))
    return false;
  return true;
}

const sql = postgres(url, {
  prepare: false,
  ssl: needsSsl(url) ? "require" : false,
  onnotice: () => {}, // "zaten var" bildirimlerini gösterme
});

const root = process.cwd();
const readJson = async (f, fb) => {
  try {
    return JSON.parse(await fs.readFile(path.join(root, "data", f), "utf-8"));
  } catch {
    return fb;
  }
};

async function main() {
  console.log("Tablolar oluşturuluyor...");
  await sql`
    create table if not exists categories (
      slug text primary key,
      name text not null,
      description text,
      sort int not null default 0
    )`;
  // Mevcut (eski) tabloya sort kolonu yoksa ekle.
  await sql`alter table categories add column if not exists sort int not null default 0`;
  await sql`
    create table if not exists products (
      id text primary key,
      slug text unique not null,
      name text not null,
      description text default '',
      price numeric not null,
      old_price numeric,
      category text not null,
      image text default '/products/placeholder.svg',
      unit text,
      brand text,
      sku text,
      stock int default 0,
      featured boolean default false,
      created_at timestamptz default now()
    )`;
  await sql`
    create table if not exists orders (
      id text primary key,
      items jsonb not null,
      customer jsonb not null,
      total numeric not null,
      payment_method text not null,
      status text not null default 'yeni',
      created_at timestamptz default now()
    )`;
  await sql`
    create table if not exists settings (
      id int primary key,
      data jsonb not null
    )`;

  const categories = await readJson("categories.json", []);
  const products = await readJson("products.json", []);
  const settings = await readJson("settings.json", {});

  console.log(`${categories.length} kategori yükleniyor...`);
  let ci = 0;
  for (const c of categories) {
    await sql`
      insert into categories (slug, name, description, sort)
      values (${c.slug}, ${c.name}, ${c.description ?? null}, ${c.sort ?? ci})
      on conflict (slug) do update set
        name = excluded.name, description = excluded.description,
        sort = excluded.sort`;
    ci++;
  }

  console.log(`${products.length} ürün yükleniyor...`);
  for (const p of products) {
    await sql`
      insert into products
        (id, slug, name, description, price, old_price, category, image,
         unit, brand, sku, stock, featured, created_at)
      values
        (${p.id}, ${p.slug}, ${p.name}, ${p.description ?? ""}, ${p.price},
         ${p.oldPrice ?? null}, ${p.category}, ${p.image ?? "/products/placeholder.svg"},
         ${p.unit ?? null}, ${p.brand ?? null}, ${p.sku ?? null}, ${p.stock ?? 0},
         ${p.featured ?? false}, ${p.createdAt ?? new Date().toISOString()})
      on conflict (id) do update set
        slug = excluded.slug, name = excluded.name,
        description = excluded.description, price = excluded.price,
        old_price = excluded.old_price, category = excluded.category,
        image = excluded.image, unit = excluded.unit, brand = excluded.brand,
        sku = excluded.sku, stock = excluded.stock, featured = excluded.featured`;
  }

  if (settings && Object.keys(settings).length > 0) {
    console.log("Site ayarları yükleniyor...");
    await sql`
      insert into settings (id, data) values (1, ${sql.json(settings)})
      on conflict (id) do update set data = excluded.data`;
  }

  console.log("✓ Veritabanı hazır.");
  await sql.end();
}

main().catch(async (err) => {
  console.error("HATA:", err.message);
  await sql.end();
  process.exit(1);
});
