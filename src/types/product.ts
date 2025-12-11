// src/types/product.ts

export interface Product {
  id: string;
  name: string;
  description?: string;

  // Harga utama
  price: number;

  // Relasi kategori
  categoryId: string;
  categoryName?: string;

  // Info tampilan di website
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  sortOrder?: number;

  // Metadata (opsional, tergantung backend)
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload untuk create / update product dari form.
 * id, createdAt, updatedAt, categoryName tidak dikirim dari frontend.
 */
export type ProductPayload = Omit<
  Product,
  "id" | "createdAt" | "updatedAt" | "categoryName"
>;