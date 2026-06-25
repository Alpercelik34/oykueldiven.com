import "server-only";
import * as jsonDb from "./db-json";
import * as pgDb from "./db-postgres";

// DATABASE_URL tanımlıysa Postgres (canlı), değilse JSON dosyaları (yerel).
const impl: typeof jsonDb = process.env.DATABASE_URL ? pgDb : jsonDb;

export const getSettings = impl.getSettings;
export const saveSettings = impl.saveSettings;
export const getCategories = impl.getCategories;
export const getCategory = impl.getCategory;
export const saveCategory = impl.saveCategory;
export const deleteCategory = impl.deleteCategory;
export const getProducts = impl.getProducts;
export const getProduct = impl.getProduct;
export const getProductById = impl.getProductById;
export const getProductsByCategory = impl.getProductsByCategory;
export const getFeaturedProducts = impl.getFeaturedProducts;
export const searchProducts = impl.searchProducts;
export const saveProduct = impl.saveProduct;
export const deleteProduct = impl.deleteProduct;
export const getOrders = impl.getOrders;
export const getOrderById = impl.getOrderById;
export const saveOrder = impl.saveOrder;
export const updateOrderStatus = impl.updateOrderStatus;
