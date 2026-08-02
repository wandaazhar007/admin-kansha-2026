// src/services/categories.ts
import apiClient from "./apiClient";
import type { Category } from "../types/category";
import { logError } from "../lib/logger";

export interface CategoryPayload {
  name: string;
  description?: string;
  sortOrder?: number;
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await apiClient.get("/categories");
  const raw: unknown = response.data;

  if (Array.isArray(raw)) {
    return raw as Category[];
  }

  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.data)) {
      return obj.data as Category[];
    }
    if (Array.isArray(obj.categories)) {
      return obj.categories as Category[];
    }
  }

  logError("Unexpected /categories response shape:", raw);
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