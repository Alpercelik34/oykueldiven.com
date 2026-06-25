import "server-only";
import { cache } from "react";
import postgres from "postgres";
import type { Category, Order, OrderItem, Product } from "./types";
import { DEFAULT_SETTINGS, type Settings } from "./settings";

// Postgres tabanlı veri deposu (canlı/üretim için).
// DATABASE_URL tanımlı olduğunda db.ts otomatik olarak bunu kullanır.
//
// Sunucusuz ortam (Vercel) notu: her işlem için TAZE bir bağlantı açıp
// hemen kapatıyoruz. Böylece donan/yeniden uyanan sunucu örneklerinde
// "bayat" (yarı açık) bağlantı kalmıyor ve istekler takılmıyor.

type Sql = ReturnType<typeof postgres>;

// Yerel/Docker içi Postgres'te SSL kapalı, uzak sunucularda (Supabase vb.) açık.
function needsSsl(url: string): boolean {
  if (/sslmode=disable/.test(url)) return false;
  if (/sslmode=require/.test(url)) return true;
  if (/@(localhost|127\.0\.0\.1|db|postgres|host\.docker\.internal)[:/]/.test(url))
    return false;
  return true;
}

// Her çağrıda taze bağlantı aç, işi yap, bağlantıyı kapat.
async function run<T>(fn: (sql: Sql) => Promise<T>): Promise<T> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL tanımlı değil.");
  const sql = postgres(url, {
    prepare: false, // Supabase/PgBouncer "transaction" havuzu ile uyum için
    ssl: needsSsl(url) ? "require" : false,
    max: 1,
    connect_timeout: 10, // bağlanamazsa 10 sn'de hata ver
    idle_timeout: 3,
    max_lifetime: 30,
  });
  try {
    return await fn(sql);
  } finally {
    // İşi biten bağlantıyı kapat (bayat bağlantı kalmasın).
    sql.end({ timeout: 5 }).catch(() => {});
  }
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

function toCategory(r: CategoryRow): Category {
  return {
    slug: r.slug,
    name: r.name,
    description: r.description ?? undefined,
    sort: r.sort ?? 0,
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

// Okuma fonksiyonları React cache() ile sarılı: aynı istek içinde aynı sorgu
// bir kez çalışır (ör. kategoriler hem layout hem sayfada kullanılınca).

// ---- Site Ayarları ----
export const getSettings = cache(
  async (): Promise<Settings> =>
    run(async (sql) => {
      const rows = await sql<{ data: Partial<Settings> }[]>`
        select data from settings where id = 1
      `;
      return { ...DEFAULT_SETTINGS, ...(rows[0]?.data ?? {}) };
    }),
);

export async function saveSettings(settings: Settings): Promise<void> {
  await run(
    (sql) => sql`
      insert into settings (id, data) values (1, ${sql.json(settings)})
      on conflict (id) do update set data = excluded.data
    `,
  );
}

// ---- Kategoriler ----
export const getCategories = cache(
  async (): Promise<Category[]> =>
    run(async (sql) => {
      const rows = await sql<CategoryRow[]>`
        select slug, name, description, sort from categories
        order by sort asc nulls first, name asc
      `;
      return rows.map(toCategory);
    }),
);

export const getCategory = cache(
  async (slug: string): Promise<Category | undefined> =>
    run(async (sql) => {
      const rows = await sql<CategoryRow[]>`
        select slug, name, description, sort from categories
        where slug = ${slug} limit 1
      `;
      return rows[0] ? toCategory(rows[0]) : undefined;
    }),
);

export async function saveCategory(category: Category): Promise<void> {
  await run(
    (sql) => sql`
      insert into categories (slug, name, description, sort)
      values (${category.slug}, ${category.name}, ${category.description ?? null},
              ${category.sort ?? 0})
      on conflict (slug) do update set
        name = excluded.name, description = excluded.description,
        sort = excluded.sort
    `,
  );
}

export async function deleteCategory(slug: string): Promise<void> {
  await run((sql) => sql`delete from categories where slug = ${slug}`);
}

// ---- Ürünler ----
export const getProducts = cache(
  async (): Promise<Product[]> =>
    run(async (sql) => {
      const rows = await sql<ProductRow[]>`
        select * from products order by created_at desc
      `;
      return rows.map(toProduct);
    }),
);

export const getProduct = cache(
  async (slug: string): Promise<Product | undefined> =>
    run(async (sql) => {
      const rows = await sql<ProductRow[]>`
        select * from products where slug = ${slug} limit 1
      `;
      return rows[0] ? toProduct(rows[0]) : undefined;
    }),
);

export const getProductById = cache(
  async (id: string): Promise<Product | undefined> =>
    run(async (sql) => {
      const rows = await sql<ProductRow[]>`
        select * from products where id = ${id} limit 1
      `;
      return rows[0] ? toProduct(rows[0]) : undefined;
    }),
);

export const getProductsByCategory = cache(
  async (categorySlug: string): Promise<Product[]> =>
    run(async (sql) => {
      const rows = await sql<ProductRow[]>`
        select * from products where category = ${categorySlug}
        order by created_at desc
      `;
      return rows.map(toProduct);
    }),
);

export const getFeaturedProducts = cache(
  async (): Promise<Product[]> =>
    run(async (sql) => {
      const rows = await sql<ProductRow[]>`
        select * from products where featured = true order by created_at desc
      `;
      return rows.map(toProduct);
    }),
);

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];
  const like = `%${q}%`;
  return run(async (sql) => {
    const rows = await sql<ProductRow[]>`
      select * from products
      where name ilike ${like}
         or description ilike ${like}
         or coalesce(brand, '') ilike ${like}
      order by created_at desc
    `;
    return rows.map(toProduct);
  });
}

export async function saveProduct(product: Product): Promise<void> {
  await run(
    (sql) => sql`
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
    `,
  );
}

export async function deleteProduct(id: string): Promise<void> {
  await run((sql) => sql`delete from products where id = ${id}`);
}

// ---- Siparişler ----
export const getOrders = cache(
  async (): Promise<Order[]> =>
    run(async (sql) => {
      const rows = await sql<OrderRow[]>`
        select * from orders order by created_at desc
      `;
      return rows.map(toOrder);
    }),
);

export const getOrderById = cache(
  async (id: string): Promise<Order | undefined> =>
    run(async (sql) => {
      const rows = await sql<OrderRow[]>`
        select * from orders where id = ${id} limit 1
      `;
      return rows[0] ? toOrder(rows[0]) : undefined;
    }),
);

export async function saveOrder(order: Order): Promise<void> {
  await run(
    (sql) => sql`
      insert into orders
        (id, items, customer, total, payment_method, status, created_at)
      values
        (${order.id}, ${sql.json(order.items)}, ${sql.json(order.customer)},
         ${order.total}, ${order.paymentMethod}, ${order.status},
         ${order.createdAt})
    `,
  );
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
): Promise<void> {
  await run((sql) => sql`update orders set status = ${status} where id = ${id}`);
}
