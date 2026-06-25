import "server-only";
import postgres from "postgres";
import type { Category, Order, OrderItem, Product } from "./types";
import { DEFAULT_SETTINGS, type Settings } from "./settings";

// Postgres tabanlı veri deposu (canlı/üretim için).
// DATABASE_URL tanımlı olduğunda db.ts otomatik olarak bunu kullanır.

type Sql = ReturnType<typeof postgres>;

// Bağlantı havuzunu globalThis'te sakla. Böylece geliştirme modunda HMR
// (sıcak yeniden yükleme) her seferinde yeni havuz açıp bağlantıları
// tüketmez ("too many connections" hatasını önler).
const globalForPg = globalThis as unknown as { _pgSql?: Sql };

// Yerel/Docker içi Postgres'te SSL kapalı, uzak sunucularda (Supabase vb.) açık.
function needsSsl(url: string): boolean {
  if (/sslmode=disable/.test(url)) return false;
  if (/sslmode=require/.test(url)) return true;
  if (/@(localhost|127\.0\.0\.1|db|postgres|host\.docker\.internal)[:/]/.test(url))
    return false;
  return true;
}

function db(): Sql {
  if (!globalForPg._pgSql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL tanımlı değil.");
    globalForPg._pgSql = postgres(url, {
      // Supabase/PgBouncer "transaction" havuzu ile uyum için:
      prepare: false,
      ssl: needsSsl(url) ? "require" : false,
      max: 5, // havuzdaki en fazla bağlantı
      idle_timeout: 20, // boşta kalan bağlantıyı 20 sn sonra kapat
    });
  }
  return globalForPg._pgSql;
}

// ---- Satır tipleri ----
type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: string;
  old_price: string | null;
  category: string;
  image: string;
  unit: string | null;
  brand: string | null;
  sku: string | null;
  stock: number;
  featured: boolean;
  created_at: Date;
};

type CategoryRow = {
  slug: string;
  name: string;
  description: string | null;
  sort: number | null;
};

type OrderRow = {
  id: string;
  items: OrderItem[];
  customer: Order["customer"];
  total: string;
  payment_method: Order["paymentMethod"];
  status: Order["status"];
  created_at: Date;
};

function toProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description ?? "",
    price: Number(r.price),
    oldPrice: r.old_price != null ? Number(r.old_price) : undefined,
    category: r.category,
    image: r.image,
    unit: r.unit ?? undefined,
    brand: r.brand ?? undefined,
    sku: r.sku ?? undefined,
    stock: Number(r.stock),
    featured: !!r.featured,
    createdAt: new Date(r.created_at).toISOString(),
  };
}

function toOrder(r: OrderRow): Order {
  return {
    id: r.id,
    items: r.items,
    customer: r.customer,
    total: Number(r.total),
    paymentMethod: r.payment_method,
    status: r.status,
    createdAt: new Date(r.created_at).toISOString(),
  };
}

// ---- Site Ayarları ----
export async function getSettings(): Promise<Settings> {
  const rows = await db()<{ data: Partial<Settings> }[]>`
    select data from settings where id = 1
  `;
  return { ...DEFAULT_SETTINGS, ...(rows[0]?.data ?? {}) };
}

export async function saveSettings(settings: Settings): Promise<void> {
  const s = db();
  await s`
    insert into settings (id, data) values (1, ${s.json(settings)})
    on conflict (id) do update set data = excluded.data
  `;
}

// ---- Kategoriler ----
export async function getCategories(): Promise<Category[]> {
  const rows = await db()<CategoryRow[]>`
    select slug, name, description, sort from categories
    order by sort asc nulls first, name asc
  `;
  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    description: r.description ?? undefined,
    sort: r.sort ?? 0,
  }));
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const rows = await db()<CategoryRow[]>`
    select slug, name, description, sort from categories where slug = ${slug} limit 1
  `;
  const r = rows[0];
  return r
    ? {
        slug: r.slug,
        name: r.name,
        description: r.description ?? undefined,
        sort: r.sort ?? 0,
      }
    : undefined;
}

export async function saveCategory(category: Category): Promise<void> {
  const s = db();
  await s`
    insert into categories (slug, name, description, sort)
    values (${category.slug}, ${category.name}, ${category.description ?? null},
            ${category.sort ?? 0})
    on conflict (slug) do update set
      name = excluded.name, description = excluded.description,
      sort = excluded.sort
  `;
}

export async function deleteCategory(slug: string): Promise<void> {
  await db()`delete from categories where slug = ${slug}`;
}

// ---- Ürünler ----
export async function getProducts(): Promise<Product[]> {
  const rows = await db()<ProductRow[]>`
    select * from products order by created_at desc
  `;
  return rows.map(toProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const rows = await db()<ProductRow[]>`
    select * from products where slug = ${slug} limit 1
  `;
  return rows[0] ? toProduct(rows[0]) : undefined;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const rows = await db()<ProductRow[]>`
    select * from products where id = ${id} limit 1
  `;
  return rows[0] ? toProduct(rows[0]) : undefined;
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  const rows = await db()<ProductRow[]>`
    select * from products where category = ${categorySlug}
    order by created_at desc
  `;
  return rows.map(toProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await db()<ProductRow[]>`
    select * from products where featured = true order by created_at desc
  `;
  return rows.map(toProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];
  const like = `%${q}%`;
  const rows = await db()<ProductRow[]>`
    select * from products
    where name ilike ${like}
       or description ilike ${like}
       or coalesce(brand, '') ilike ${like}
    order by created_at desc
  `;
  return rows.map(toProduct);
}

export async function saveProduct(product: Product): Promise<void> {
  const s = db();
  await s`
    insert into products
      (id, slug, name, description, price, old_price, category, image,
       unit, brand, sku, stock, featured, created_at)
    values
      (${product.id}, ${product.slug}, ${product.name}, ${product.description},
       ${product.price}, ${product.oldPrice ?? null}, ${product.category},
       ${product.image}, ${product.unit ?? null}, ${product.brand ?? null},
       ${product.sku ?? null}, ${product.stock}, ${product.featured ?? false},
       ${product.createdAt})
    on conflict (id) do update set
      slug = excluded.slug, name = excluded.name,
      description = excluded.description, price = excluded.price,
      old_price = excluded.old_price, category = excluded.category,
      image = excluded.image, unit = excluded.unit, brand = excluded.brand,
      sku = excluded.sku, stock = excluded.stock, featured = excluded.featured
  `;
}

export async function deleteProduct(id: string): Promise<void> {
  await db()`delete from products where id = ${id}`;
}

// ---- Siparişler ----
export async function getOrders(): Promise<Order[]> {
  const rows = await db()<OrderRow[]>`
    select * from orders order by created_at desc
  `;
  return rows.map(toOrder);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const rows = await db()<OrderRow[]>`
    select * from orders where id = ${id} limit 1
  `;
  return rows[0] ? toOrder(rows[0]) : undefined;
}

export async function saveOrder(order: Order): Promise<void> {
  const s = db();
  await s`
    insert into orders
      (id, items, customer, total, payment_method, status, created_at)
    values
      (${order.id}, ${s.json(order.items)}, ${s.json(order.customer)},
       ${order.total}, ${order.paymentMethod}, ${order.status},
       ${order.createdAt})
  `;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
): Promise<void> {
  await db()`update orders set status = ${status} where id = ${id}`;
}
