// // src/pages/formProduct/FormProduct.tsx
// import React, { type FormEvent, useEffect, useState } from "react";
// import styles from "./FormProduct.module.scss";
// import type { Product, ProductPayload } from "../../types/product";
// import { createProduct, updateProduct } from "../../services/products";
// import type { Category } from "../../types/category";
// import { fetchCategories } from "../../services/categories";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { storage } from "../../lib/firebase";

// interface FormProductProps {
//   mode: "create" | "edit";
//   product?: Product;
//   onClose: () => void;
//   onSaved: () => void;
// }

// interface FieldErrors {
//   name?: string;
//   price?: string;
//   categoryId?: string;
// }

// interface LocalImagePreview {
//   file: File;
//   url: string;
// }

// const FormProduct: React.FC<FormProductProps> = ({
//   mode,
//   product,
//   onClose,
//   onSaved,
// }) => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState<string>("");

//   // ini akan menampung ID kategori (string) dari dropdown
//   const [categoryId, setCategoryId] = useState("");

//   const [imageUrl, setImageUrl] = useState("");
//   const [isAvailable, setIsAvailable] = useState(true);

//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState<FieldErrors>({});
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [categoriesLoading, setCategoriesLoading] = useState(true);
//   const [categoriesError, setCategoriesError] = useState<string | null>(null);

//   const [localImages, setLocalImages] = useState<LocalImagePreview[]>([]);
//   const [imageUploadError, setImageUploadError] = useState<string | null>(null);

//   // Init state dari product (edit)
//   useEffect(() => {
//     if (mode === "edit" && product) {
//       setName(product.name ?? "");
//       setDescription(product.description ?? "");
//       setPrice(product.price != null ? String(product.price) : "");

//       // baca id kategori dari beberapa kemungkinan:
//       const initialCategoryId =
//         product.categoryId || (product as any).category || "";
//       setCategoryId(initialCategoryId);

//       setImageUrl(product.imageUrl ?? "");
//       setIsAvailable(product.isAvailable ?? true);
//     } else {
//       setName("");
//       setDescription("");
//       setPrice("");
//       setCategoryId("");
//       setImageUrl("");
//       setIsAvailable(true);
//     }
//     setErrors({});
//     setSubmitError(null);
//     setImageUploadError(null);
//     setLocalImages([]);
//   }, [mode, product]);

//   // Load categories
//   useEffect(() => {
//     const loadCategories = async () => {
//       setCategoriesLoading(true);
//       setCategoriesError(null);
//       try {
//         const data = await fetchCategories();
//         setCategories(data);
//       } catch (err) {
//         console.error("Failed to fetch categories:", err);
//         setCategoriesError("Gagal memuat kategori. Coba refresh halaman.");
//       } finally {
//         setCategoriesLoading(false);
//       }
//     };

//     loadCategories();
//   }, []);

//   const validate = (): boolean => {
//     const newErrors: FieldErrors = {};

//     if (!name.trim()) {
//       newErrors.name = "Nama produk wajib diisi.";
//     }

//     if (!price.trim()) {
//       newErrors.price = "Harga wajib diisi.";
//     } else {
//       const numeric = Number(price);
//       if (Number.isNaN(numeric) || numeric <= 0) {
//         newErrors.price = "Harga harus berupa angka lebih dari 0.";
//       }
//     }

//     if (!categoryId.trim()) {
//       newErrors.categoryId = "Kategori wajib dipilih.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const uploadImagesAndGetUrls = async (): Promise<string[]> => {
//     // base = imageUrls lama (kalau sedang edit)
//     let base: string[] =
//       mode === "edit" && product?.imageUrls?.length
//         ? [...product.imageUrls]
//         : [];

//     // kalau user tidak pilih file baru:
//     if (!localImages.length) {
//       if (base.length) return base;
//       if (imageUrl.trim()) return [imageUrl.trim()];
//       return [];
//     }

//     const uploaded: string[] = [];

//     for (const item of localImages) {
//       const file = item.file;
//       const ext =
//         file.name.split(".").pop() || "jpg";
//       const uniqueName = `${Date.now()}-${Math.random()
//         .toString(36)
//         .slice(2)}.${ext}`;

//       const storageRef = ref(
//         storage,
//         `products/${uniqueName}`
//       );

//       const snap = await uploadBytes(storageRef, file);
//       const url = await getDownloadURL(snap.ref);
//       uploaded.push(url);
//     }

//     return [...base, ...uploaded];
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setSubmitError(null);

//     if (!validate()) return;

//     // Pastikan category TIDAK undefined
//     try {
//       setSubmitting(true);

//       // 🔽 upload gambar & dapatkan array URL
//       const imageUrls = await uploadImagesAndGetUrls();

//       const categoryValue = categoryId.trim();

//       const payload: ProductPayload = {
//         name: name.trim(),
//         description: description.trim() || undefined,
//         price: Number(price),

//         category: categoryValue,
//         categoryId: categoryValue,

//         imageUrls: imageUrls.length ? imageUrls : undefined,
//         imageUrl:
//           imageUrls[0] ||
//           (imageUrl.trim() || undefined),

//         isAvailable,
//         isFeatured: product?.isFeatured ?? false,
//         sortOrder: product?.sortOrder,
//       };

//       if (mode === "create") {
//         await createProduct(payload);
//       } else if (mode === "edit" && product) {
//         await updateProduct(product.id, payload);
//       }

//       setSubmitting(false);
//       onSaved();
//       onClose();
//     } catch (err: any) {
//       console.error("Failed to save product:", err);
//       setSubmitting(false);

//       const serverError = err?.response?.data;
//       if (serverError?.error) {
//         const details = Array.isArray(serverError.details)
//           ? serverError.details
//             .map((d: any) => d?.message)
//             .filter(Boolean)
//           : [];
//         const message =
//           details.join(" ") ||
//           serverError.error ||
//           serverError.message;
//         if (message) {
//           setSubmitError(message);
//           return;
//         }
//       }

//       setSubmitError("Gagal menyimpan produk. Coba lagi.");
//     }
//   };

//   const title = mode === "create" ? "Add Product" : "Edit Product";

//   const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     setImageUploadError(null);

//     const newPreviews: LocalImagePreview[] = Array.from(files).map((file) => ({
//       file,
//       url: URL.createObjectURL(file),
//     }));

//     setLocalImages((prev) => [...prev, ...newPreviews]);

//     // Untuk sementara, gunakan gambar pertama sebagai imageUrl (preview)
//     if (!imageUrl && newPreviews.length > 0) {
//       setImageUrl(newPreviews[0].url);
//     }

//     e.target.value = "";
//   };

//   const handleRemovePreview = (idx: number) => {
//     setLocalImages((prev) => {
//       const copy = [...prev];
//       const removed = copy.splice(idx, 1)[0];
//       if (removed) {
//         URL.revokeObjectURL(removed.url);
//       }
//       return copy;
//     });
//   };

//   return (
//     <div className={styles.formCard}>
//       <div className={styles.header}>
//         <div>
//           <h2 className={styles.title}>{title}</h2>
//           <p className={styles.subtitle}>
//             Lengkapi detail produk yang akan tampil di website Kansha.
//           </p>
//         </div>
//         <button
//           type="button"
//           className={styles.closeButton}
//           onClick={onClose}
//           disabled={submitting}
//           aria-label="Close form"
//         >
//           ✕
//         </button>
//       </div>

//       {submitError && <div className={styles.errorBox}>{submitError}</div>}

//       <form className={styles.form} onSubmit={handleSubmit} noValidate>
//         {/* Name */}
//         <div className={styles.field}>
//           <label className={styles.label} htmlFor="name">
//             Product Name
//           </label>
//           <input
//             id="name"
//             type="text"
//             className={`${styles.input} ${errors.name ? styles.inputError : ""
//               }`}
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Hibachi Chicken"
//           />
//           {errors.name && (
//             <p className={styles.fieldErrorText}>{errors.name}</p>
//           )}
//         </div>

//         {/* Description */}
//         <div className={styles.field}>
//           <label className={styles.label} htmlFor="description">
//             Description (optional)
//           </label>
//           <textarea
//             id="description"
//             className={styles.textarea}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Deskripsi singkat tentang menu ini..."
//             rows={3}
//           />
//         </div>

//         {/* Price & Category */}
//         <div className={styles.fieldRow}>
//           <div className={styles.field}>
//             <label className={styles.label} htmlFor="price">
//               Price (USD)
//             </label>
//             <input
//               id="price"
//               type="number"
//               min={0}
//               step="0.01"
//               className={`${styles.input} ${errors.price ? styles.inputError : ""
//                 }`}
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               placeholder="10.99"
//             />
//             {errors.price && (
//               <p className={styles.fieldErrorText}>{errors.price}</p>
//             )}
//           </div>

//           <div className={styles.field}>
//             <label className={styles.label} htmlFor="categoryId">
//               Category
//             </label>
//             <select
//               id="categoryId"
//               className={`${styles.input} ${errors.categoryId ? styles.inputError : ""
//                 }`}
//               value={categoryId}
//               onChange={(e) => setCategoryId(e.target.value)}
//               disabled={categoriesLoading}
//             >
//               <option value="">
//                 {categoriesLoading
//                   ? "Loading categories..."
//                   : "Pilih kategori..."}
//               </option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//             {categoriesError && (
//               <p className={styles.helperText}>{categoriesError}</p>
//             )}
//             {errors.categoryId && (
//               <p className={styles.fieldErrorText}>{errors.categoryId}</p>
//             )}
//           </div>
//         </div>

//         {/* Main image URL */}
//         <div className={styles.field}>
//           <label className={styles.label} htmlFor="imageUrl">
//             Main Image URL (optional)
//           </label>
//           <input
//             id="imageUrl"
//             type="text"
//             className={styles.input}
//             value={imageUrl}
//             onChange={(e) => setImageUrl(e.target.value)}
//             placeholder="https://example.com/menu-image.jpg"
//           />
//           <p className={styles.helperText}>
//             Untuk saat ini API masih menggunakan 1 URL gambar utama. Field
//             upload di bawah ini untuk membantu kamu menyiapkan beberapa gambar.
//           </p>
//         </div>

//         {/* Upload image multiple */}
//         <div className={styles.field}>
//           <label className={styles.label} htmlFor="imageFiles">
//             Upload Images (multiple)
//           </label>
//           <input
//             id="imageFiles"
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={handleFilesChange}
//             className={styles.fileInput}
//           />
//           {imageUploadError && (
//             <p className={styles.fieldErrorText}>{imageUploadError}</p>
//           )}

//           {localImages.length > 0 && (
//             <div className={styles.previewGrid}>
//               {localImages.map((item, idx) => (
//                 <div key={idx} className={styles.previewItem}>
//                   <img src={item.url} alt={`preview-${idx}`} />
//                   <button
//                     type="button"
//                     className={styles.previewRemove}
//                     onClick={() => handleRemovePreview(idx)}
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Is Available */}
//         <div className={styles.fieldCheckbox}>
//           <label className={styles.checkboxLabel}>
//             <input
//               type="checkbox"
//               checked={isAvailable}
//               onChange={(e) => setIsAvailable(e.target.checked)}
//             />
//             <span>Tampilkan produk di website (Available)</span>
//           </label>
//         </div>

//         {/* Actions */}
//         <div className={styles.actions}>
//           <button
//             type="button"
//             className={styles.cancelButton}
//             onClick={onClose}
//             disabled={submitting}
//           >
//             Batal
//           </button>
//           <button
//             type="submit"
//             className={styles.saveButton}
//             disabled={submitting}
//           >
//             {submitting
//               ? mode === "create"
//                 ? "Menyimpan..."
//                 : "Mengupdate..."
//               : mode === "create"
//                 ? "Simpan Product"
//                 : "Update Product"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default FormProduct;





import React, { type FormEvent, useEffect, useState } from "react";
import styles from "./FormProduct.module.scss";
import type { Product, ProductPayload } from "../../types/product";
import { createProduct, updateProduct } from "../../services/products";
import type { Category } from "../../types/category";
import { fetchCategories } from "../../services/categories";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../lib/firebase";

interface FormProductProps {
  mode: "create" | "edit";
  product?: Product;
  onClose: () => void;
  onSaved: () => void;
}

interface FieldErrors {
  name?: string;
  price?: string;
  categoryId?: string;
}

interface LocalImagePreview {
  file: File;
  url: string;
}

const FormProduct: React.FC<FormProductProps> = ({
  mode,
  product,
  onClose,
  onSaved,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");

  // akan menampung ID kategori (string) dari dropdown
  const [categoryId, setCategoryId] = useState("");

  // disimpan untuk fallback image utama (dari produk lama atau blob lokal)
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [localImages, setLocalImages] = useState<LocalImagePreview[]>([]);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  // preview untuk gambar lama (dari Firestore)
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  // Init state dari product (edit)
  useEffect(() => {
    if (mode === "edit" && product) {
      setName(product.name ?? "");
      setDescription(product.description ?? "");
      setPrice(product.price != null ? String(product.price) : "");

      // baca id kategori dari beberapa kemungkinan:
      const initialCategoryId =
        product.categoryId || (product as any).category || "";
      setCategoryId(initialCategoryId);

      // ambil URL gambar lama
      const fromArray = Array.isArray(product.imageUrls)
        ? product.imageUrls.filter(Boolean)
        : [];
      const fromSingle = product.imageUrl ? [product.imageUrl] : [];
      const merged = [...fromArray, ...fromSingle].filter(
        (url, idx, arr) => !!url && arr.indexOf(url) === idx
      );

      setExistingImageUrls(merged);
      setImageUrl(product.imageUrl ?? (merged[0] ?? ""));
      setIsAvailable(product.isAvailable ?? true);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setImageUrl("");
      setIsAvailable(true);
      setExistingImageUrls([]);
    }

    setErrors({});
    setSubmitError(null);
    setImageUploadError(null);
    setLocalImages([]);
  }, [mode, product]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategoriesError("Gagal memuat kategori. Coba refresh halaman.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};

    if (!name.trim()) {
      newErrors.name = "Nama produk wajib diisi.";
    }

    if (!price.trim()) {
      newErrors.price = "Harga wajib diisi.";
    } else {
      const numeric = Number(price);
      if (Number.isNaN(numeric) || numeric <= 0) {
        newErrors.price = "Harga harus berupa angka lebih dari 0.";
      }
    }

    if (!categoryId.trim()) {
      newErrors.categoryId = "Kategori wajib dipilih.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImagesAndGetUrls = async (): Promise<string[]> => {
    // base = imageUrls lama (kalau sedang edit)
    let base: string[] =
      mode === "edit" && product?.imageUrls?.length
        ? [...product.imageUrls]
        : [];

    // kalau user tidak pilih file baru:
    if (!localImages.length) {
      if (base.length) return base;
      if (imageUrl.trim()) return [imageUrl.trim()];
      return [];
    }

    const uploaded: string[] = [];

    for (const item of localImages) {
      const file = item.file;
      const ext = file.name.split(".").pop() || "jpg";
      const uniqueName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const storageRef = ref(storage, `products/${uniqueName}`);
      const snap = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snap.ref);
      uploaded.push(url);
    }

    return [...base, ...uploaded];
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    try {
      setSubmitting(true);

      // upload gambar & dapatkan array URL
      const imageUrls = await uploadImagesAndGetUrls();
      const categoryValue = categoryId.trim();

      const payload: ProductPayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: Number(price),

        category: categoryValue,
        categoryId: categoryValue,

        imageUrls: imageUrls.length ? imageUrls : undefined,
        imageUrl: imageUrls[0] || (imageUrl.trim() || undefined),

        isAvailable,
        isFeatured: product?.isFeatured ?? false,
        sortOrder: product?.sortOrder,
      };

      if (mode === "create") {
        await createProduct(payload);
      } else if (mode === "edit" && product) {
        await updateProduct(product.id, payload);
      }

      setSubmitting(false);
      onSaved();
      onClose();
    } catch (err: any) {
      console.error("Failed to save product:", err);
      setSubmitting(false);

      const serverError = err?.response?.data;
      if (serverError?.error) {
        const details = Array.isArray(serverError.details)
          ? serverError.details
            .map((d: any) => d?.message)
            .filter(Boolean)
          : [];
        const message =
          details.join(" ") || serverError.error || serverError.message;
        if (message) {
          setSubmitError(message);
          return;
        }
      }

      setSubmitError("Gagal menyimpan produk. Coba lagi.");
    }
  };

  const title = mode === "create" ? "Add Product" : "Edit Product";

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageUploadError(null);

    const newPreviews: LocalImagePreview[] = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setLocalImages((prev) => [...prev, ...newPreviews]);

    // optional: pakai gambar pertama sebagai preview utama (tidak tampil di field)
    if (!imageUrl && newPreviews.length > 0) {
      setImageUrl(newPreviews[0].url);
    }

    e.target.value = "";
  };

  const handleRemovePreview = (idx: number) => {
    setLocalImages((prev) => {
      const copy = [...prev];
      const removed = copy.splice(idx, 1)[0];
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return copy;
    });
  };

  return (
    <div className={styles.formCard}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>
            Lengkapi detail produk yang akan tampil di website Kansha.
          </p>
        </div>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          disabled={submitting}
          aria-label="Close form"
        >
          ✕
        </button>
      </div>

      {submitError && <div className={styles.errorBox}>{submitError}</div>}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">
            Product Name
          </label>
          <input
            id="name"
            type="text"
            className={`${styles.input} ${errors.name ? styles.inputError : ""
              }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Hibachi Chicken"
          />
          {errors.name && (
            <p className={styles.fieldErrorText}>{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="description">
            Description (optional)
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi singkat tentang menu ini..."
            rows={3}
          />
        </div>

        {/* Price & Category */}
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="price">
              Price (USD)
            </label>
            <input
              id="price"
              type="number"
              min={0}
              step="0.01"
              className={`${styles.input} ${errors.price ? styles.inputError : ""
                }`}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="10.99"
            />
            {errors.price && (
              <p className={styles.fieldErrorText}>{errors.price}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="categoryId">
              Category
            </label>
            <select
              id="categoryId"
              className={`${styles.input} ${errors.categoryId ? styles.inputError : ""
                }`}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={categoriesLoading}
            >
              <option value="">
                {categoriesLoading
                  ? "Loading categories..."
                  : "Pilih kategori..."}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoriesError && (
              <p className={styles.helperText}>{categoriesError}</p>
            )}
            {errors.categoryId && (
              <p className={styles.fieldErrorText}>{errors.categoryId}</p>
            )}
          </div>
        </div>

        {/* Upload image multiple */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="imageFiles">
            Upload Images (multiple)
          </label>
          <input
            id="imageFiles"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className={styles.fileInput}
          />
          {imageUploadError && (
            <p className={styles.fieldErrorText}>{imageUploadError}</p>
          )}

          {/* Preview gambar lama (edit mode) */}
          {mode === "edit" &&
            product &&
            existingImageUrls.length > 0 && (
              <div className={styles.previewExistingWrapper}>
                <p className={styles.previewSectionTitle}>
                  Current images
                </p>
                <div className={styles.previewGrid}>
                  {existingImageUrls.map((url, idx) => (
                    <div
                      key={`existing-${idx}`}
                      className={styles.previewItem}
                    >
                      <img src={url} alt={`existing-${idx}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Preview gambar baru (belum di-upload ke storage) */}
          {localImages.length > 0 && (
            <>
              <p className={styles.previewSectionTitle}>
                New images to upload
              </p>
              <div className={styles.previewGrid}>
                {localImages.map((item, idx) => (
                  <div key={idx} className={styles.previewItem}>
                    <img src={item.url} alt={`preview-${idx}`} />
                    <button
                      type="button"
                      className={styles.previewRemove}
                      onClick={() => handleRemovePreview(idx)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Is Available */}
        <div className={styles.fieldCheckbox}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            <span>Tampilkan produk di website (Available)</span>
          </label>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={submitting}
          >
            Batal
          </button>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={submitting}
          >
            {submitting
              ? mode === "create"
                ? "Menyimpan..."
                : "Mengupdate..."
              : mode === "create"
                ? "Simpan Product"
                : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormProduct;