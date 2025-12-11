// src/pages/formProduct/FormProduct.tsx
import React, { type FormEvent, useEffect, useState } from "react";
import styles from "./FormProduct.module.scss";
import type { Product, ProductPayload } from "../../types/product";
import {
  createProduct,
  updateProduct,
} from "../../services/products";

interface FormProductProps {
  mode: "create" | "edit";
  product?: Product;
  onClose: () => void;
  onSaved: () => void;
}

interface FieldErrors {
  name?: string;
  price?: string;
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
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && product) {
      setName(product.name ?? "");
      setDescription(product.description ?? "");
      setPrice(product.price != null ? String(product.price) : "");
      setCategoryId(product.categoryId ?? "");
      setImageUrl(product.imageUrl ?? "");
      setIsAvailable(product.isAvailable ?? true);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setImageUrl("");
      setIsAvailable(true);
    }
    setErrors({});
    setSubmitError(null);
  }, [mode, product]);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    const payload: ProductPayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: Number(price),
      categoryId: categoryId.trim(),
      imageUrl: imageUrl.trim() || undefined,
      isAvailable,
      isFeatured: product?.isFeatured ?? false,
      sortOrder: product?.sortOrder,
    };

    try {
      setSubmitting(true);
      if (mode === "create") {
        await createProduct(payload);
      } else if (mode === "edit" && product) {
        await updateProduct(product.id, payload);
      }
      setSubmitting(false);
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save product:", err);
      setSubmitting(false);
      setSubmitError("Gagal menyimpan produk. Coba lagi.");
    }
  };

  const title = mode === "create" ? "Add Product" : "Edit Product";

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
              Category ID (sementara)
            </label>
            <input
              id="categoryId"
              type="text"
              className={styles.input}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="ex: hibachi, sushi, roll"
            />
          </div>
        </div>

        {/* Image URL */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="imageUrl">
            Image URL (optional)
          </label>
          <input
            id="imageUrl"
            type="text"
            className={styles.input}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/menu-image.jpg"
          />
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