// Mevcut veritabanındaki (kategoriler, ürünler, ayarlar) verileri data/*.json
// dosyalarına yazar. Böylece `npm run seed` ile bu güncel veriyi başka bir
// veritabanına (ör. Supabase) birebir taşıyabiliriz.
import { promises as fs } from "fs";
import path from "path";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL yok");
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
  onnotice: () => {},
});
const root = process.cwd();
const write = (f, obj) =>
  fs.writeFile(path.join(root, "data", f), JSON.stringify(obj, null, 2));

const cats = await sql`select slug,name,description,sort from categories order by sort asc nulls first, name`;
await write(
  "categories.json",
  cats.map((c) => ({
    slug: c.slug,
    name: c.name,
    ...(c.description ? { description: c.description } : {}),
    sort: c.sort ?? 0,
  })),
);

const prods = await sql`select * from products order by created_at asc`;
await write(
  "products.json",
  prods.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description ?? "",
    price: Number(p.price),
    ...(p.old_price != null ? { oldPrice: Number(p.old_price) } : {}),
    category: p.category,
    image: p.image,
    ...(p.unit ? { unit: p.unit } : {}),
    ...(p.brand ? { brand: p.brand } : {}),
    ...(p.sku ? { sku: p.sku } : {}),
    stock: Number(p.stock),
    featured: !!p.featured,
    createdAt: new Date(p.created_at).toISOString(),
  })),
);

const s = await sql`select data from settings where id=1`;
if (s[0]) await write("settings.json", s[0].data);

console.log(
  `Dışa aktarıldı: ${cats.length} kategori, ${prods.length} ürün, ayarlar ${s[0] ? "var" : "yok"}`,
);
await sql.end();
