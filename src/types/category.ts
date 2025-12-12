// src/types/category.ts

export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}