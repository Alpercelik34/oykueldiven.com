export type Category = {
  slug: string;
  name: string;
  description?: string;
  sort?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string; // category slug
  image: string;
  unit?: string; // ör. "Kutu (100 adet)"
  brand?: string;
  sku?: string;
  stock: number;
  featured?: boolean;
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    note?: string;
  };
  total: number;
  paymentMethod: "havale" | "kapida" | "kredi-karti";
  status: "yeni" | "hazirlaniyor" | "kargolandi" | "iptal";
  createdAt: string;
};
