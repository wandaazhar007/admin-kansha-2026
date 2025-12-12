// src/types/product.ts

export interface Product {
  id: string;
  name: string;
  description?: string;

  price: number;

  // ID kategori yang disimpan di Firestore
  category?: string;      // dari backend
  categoryId?: string;    // helper di frontend
  categoryName?: string;  // nama kategori untuk tampilan

  // Gambar
  imageUrl?: string;      // thumbnail utama (opsional, dari imageUrls[0])
  imageUrls?: string[];   // array URL gambar dari backend

  isAvailable: boolean;
  isFeatured?: boolean;
  sortOrder?: number;

  createdAt?: string;
  updatedAt?: string;
}

export type ProductPayload = {
  name: string;
  description?: string;
  price: number;

  category: string;       // WAJIB: id kategori
  categoryId?: string;

  imageUrl?: string;      // thumbnail
  imageUrls?: string[];   // array URL gambar

  isAvailable: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
};