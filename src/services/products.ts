// src/services/products.ts

import apiClient from "./apiClient";
import type { Product, ProductPayload } from "../types/product";

/**
 * Ambil semua produk (public endpoint: GET /api/products)
 */
export async function fetchProducts(): Promise<Product[]> {
  const response = await apiClient.get<Product[]>("/products");
  return response.data;
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