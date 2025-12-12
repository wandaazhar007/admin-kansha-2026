// // src/types/product.ts

// export interface Product {
//   id: string;
//   name: string;
//   description?: string;

//   // Harga utama
//   price: number;

//   // Relasi kategori
//   categoryId: string;
//   categoryName?: string;

//   // Info tampilan di website
//   imageUrl?: string;
//   isAvailable: boolean;
//   isFeatured?: boolean;
//   sortOrder?: number;

//   // Metadata (opsional, tergantung backend)
//   createdAt?: string;
//   updatedAt?: string;
// }

// /**
//  * Payload untuk create / update product dari form.
//  * id, createdAt, updatedAt, categoryName tidak dikirim dari frontend.
//  */
// export type ProductPayload = Omit<
//   Product,
//   "id" | "createdAt" | "updatedAt" | "categoryName"
// >;


// src/types/product.ts

// Shape produk di frontend (gabungan view + data yang diperlukan API)
export interface Product {
  id: string;
  name: string;
  description?: string;

  price: number;

  /**
   * Field yang benar-benar disimpan di Firestore (string id kategori).
   * Inilah yang sedang dimaksud error "field 'category'".
   */
  category?: string;

  /**
   * Tambahan helper di frontend:
   * - categoryId: id kategori yang sama dengan "category"
   * - categoryName: nama kategori untuk ditampilkan di tabel
   */
  categoryId?: string;
  categoryName?: string;

  imageUrl?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  sortOrder?: number;

  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload yang dikirim ke API ketika create/update.
 * Di sini kita pastikan `category` SELALU ada.
 */
export type ProductPayload = {
  name: string;
  description?: string;
  price: number;

  // ini yang akan dibaca backend & disimpan di Firestore
  category: string;

  // boleh dikirim sebagai info tambahan
  categoryId?: string;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
};