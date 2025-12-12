// src/services/categories.ts
import apiClient from "./apiClient";
import type { Category } from "../types/category";

export interface CategoryPayload {
  name: string;
  description?: string;
  sortOrder?: number;
}

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

export async function createCategory(
  payload: CategoryPayload
): Promise<Category> {
  const response = await apiClient.post<Category>("/categories", payload);
  return response.data;
}

export async function updateCategory(
  id: string,
  payload: CategoryPayload
): Promise<Category> {
  const response = await apiClient.put<Category>(`/categories/${id}`, payload);
  return response.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}