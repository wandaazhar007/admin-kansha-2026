// src/services/categories.ts
import apiClient from "./apiClient";
import type { Category } from "../types/category";

/**
 * Ambil semua kategori (public endpoint: GET /api/categories)
 */
export async function fetchCategories(): Promise<Category[]> {
  const response = await apiClient.get("/categories");
  const raw = response.data;

  if (Array.isArray(raw)) {
    return raw as Category[];
  }

  if (raw && Array.isArray((raw as any).data)) {
    return (raw as any).data as Category[];
  }

  if (raw && Array.isArray((raw as any).categories)) {
    return (raw as any).categories as Category[];
  }

  console.error("Unexpected /categories response shape:", raw);
  return [];
}