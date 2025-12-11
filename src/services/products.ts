// src/services/products.ts
import apiClient from "./apiClient";
import type { Product, ProductPayload } from "../types/product";

/**
 * Ambil semua produk (public endpoint: GET /api/products)
 * Fungsi ini DIJAMIN mengembalikan Product[] di runtime.
 */
export async function fetchProducts(): Promise<Product[]> {
  const response = await apiClient.get("/products");
  const raw = response.data;

  // Beberapa bentuk respons umum:
  // 1. [ ... ]                         -> langsung array
  // 2. { data: [ ... ] }               -> data di dalam field "data"
  // 3. { products: [ ... ] }           -> data di dalam field "products"
  // 4. Lain-lain -> fallback ke []

  if (Array.isArray(raw)) {
    return raw as Product[];
  }

  if (raw && Array.isArray((raw as any).data)) {
    return (raw as any).data as Product[];
  }

  if (raw && Array.isArray((raw as any).products)) {
    return (raw as any).products as Product[];
  }

  console.error("Unexpected /products response shape:", raw);
  return [];
}

/**
 * Ambil detail 1 produk berdasarkan id (GET /api/products/:id)
 */
export async function fetchProductById(id: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
}

/**
 * Buat produk baru (admin-only: POST /api/products)
 * Perlu Firebase ID token (sudah di-handle di apiClient).
 */
export async function createProduct(payload: ProductPayload): Promise<Product> {
  const response = await apiClient.post<Product>("/products", payload);
  return response.data;
}

/**
 * Update produk (admin-only: PUT /api/products/:id)
 */
export async function updateProduct(
  id: string,
  payload: ProductPayload
): Promise<Product> {
  const response = await apiClient.put<Product>(`/products/${id}`, payload);
  return response.data;
}

/**
 * Hapus produk (admin-only: DELETE /api/products/:id)
 */
export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}
