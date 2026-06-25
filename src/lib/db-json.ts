import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Category, Order, Product } from "./types";
import { DEFAULT_SETTINGS, type Settings } from "./settings";

// Dosya tabanlı veri deposu (yerel geliştirme için).
// Veriler proje kökündeki /data klasöründe JSON olarak tutulur.
// Canlıda DATABASE_URL tanımlıysa bunun yerine db-postgres.ts kullanılır.

const dataDir = path.join(process.cwd(), "data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(dataDir, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(
    path.join(dataDir, file),
    JSON.stringify(data, null, 2),
    "utf-8",
  );
}

// ---- Site Ayarları (görünüm & içerik) ----
export async function getSettings(): Promise<Settings> {
  const saved = await readJson<Partial<Settings>>("settings.json", {});
  return { ...DEFAULT_SETTINGS, ...saved };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await writeJson("settings.json", settings);
}

// ---- Kategoriler ----
export async function getCategories(): Promise<Category[]> {
  const cats = await readJson<Category[]>("categories.json", []);
  return cats.sort(
    (a, b) => (a.sort ?? 0) - (b.sort ?? 0) || a.name.localeCompare(b.name, "tr"),
  );
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug);
}

export async function saveCategory(category: Category): Promise<void> {
  const cats = await readJson<Category[]>("categories.json", []);
  const idx = cats.findIndex((c) => c.slug === category.slug);
  if (idx >= 0) cats[idx] = category;
  else cats.push(category);
  await writeJson("categories.json", cats);
}

export async function deleteCategory(slug: string): Promise<void> {
  const cats = await readJson<Category[]>("categories.json", []);
  await writeJson(
    "categories.json",
    cats.filter((c) => c.slug !== slug),
  );
}

// ---- Ürünler ----
export async function getProducts(): Promise<Product[]> {
  const products = await readJson<Product[]>("products.json", []);
  return products.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.category === categorySlug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.featured);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return [];
  const products = await getProducts();
  return products.filter(
    (p) =>
      p.name.toLocaleLowerCase("tr").includes(q) ||
      p.description.toLocaleLowerCase("tr").includes(q) ||
      (p.brand ?? "").toLocaleLowerCase("tr").includes(q),
  );
}

export async function saveProduct(product: Product): Promise<void> {
  const products = await readJson<Product[]>("products.json", []);
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) products[idx] = product;
  else products.push(product);
  await writeJson("products.json", products);
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await readJson<Product[]>("products.json", []);
  await writeJson(
    "products.json",
    products.filter((p) => p.id !== id),
  );
}

// ---- Siparişler ----
export async function getOrders(): Promise<Order[]> {
  const orders = await readJson<Order[]>("orders.json", []);
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id);
}

export async function saveOrder(order: Order): Promise<void> {
  const orders = await readJson<Order[]>("orders.json", []);
  orders.push(order);
  await writeJson("orders.json", orders);
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
): Promise<void> {
  const orders = await readJson<Order[]>("orders.json", []);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    orders[idx].status = status;
    await writeJson("orders.json", orders);
  }
}
