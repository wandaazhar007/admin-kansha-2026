// // src/pages/formCategory/FormCategory.tsx
// import React, { type FormEvent, useEffect, useState } from "react";
// import styles from "./FormCategory.module.scss";
// import type { Category } from "../../types/category";
// import {
//   createCategory,
//   updateCategory,
//   type CategoryPayload,
// } from "../../services/categories";

// interface FormCategoryProps {
//   mode: "create" | "edit";
//   category?: Category;
//   onClose: () => void;
//   onSaved: () => void;
// }

// interface FieldErrors {
//   name?: string;
// }

// const FormCategory: React.FC<FormCategoryProps> = ({
//   mode,
//   category,
//   onClose,
//   onSaved,
// }) => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [sortOrder, setSortOrder] = useState<string>("");

//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState<FieldErrors>({});
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   useEffect(() => {
//     if (mode === "edit" && category) {
//       setName(category.name ?? "");
//       setDescription((category as any).description ?? "");
//       setSortOrder(
//         (category as any).sortOrder != null
//           ? String((category as any).sortOrder)
//           : ""
//       );
//     } else {
//       setName("");
//       setDescription("");
//       setSortOrder("");
//     }

//     setErrors({});
//     setSubmitError(null);
//   }, [mode, category]);

//   const validate = (): boolean => {
//     const newErrors: FieldErrors = {};

//     if (!name.trim()) {
//       newErrors.name = "Nama kategori wajib diisi.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setSubmitError(null);

//     if (!validate()) return;

//     try {
//       setSubmitting(true);

//       const payload: CategoryPayload = {
//         name: name.trim(),
//         description: description.trim() || undefined,
//         sortOrder: sortOrder.trim()
//           ? Number(sortOrder.trim())
//           : undefined,
//       };

//       if (mode === "create") {
//         await createCategory(payload);
//       } else if (mode === "edit" && category) {
//         await updateCategory(category.id, payload);
//       }

//       setSubmitting(false);
//       onSaved();
//       onClose();
//     } catch (err: any) {
//       console.error("Failed to save category:", err);
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

//       setSubmitError("Gagal menyimpan kategori. Coba lagi.");
//     }
//   };

//   const title = mode === "create" ? "Add Category" : "Edit Category";

//   return (
//     <div className={styles.formCard}>
//       <div className={styles.header}>
//         <div>
//           <h2 className={styles.title}>{title}</h2>
//           <p className={styles.subtitle}>
//             Atur kategori menu untuk mengelompokkan produk Hibachi & Sushi.
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
//             Category Name
//           </label>
//           <input
//             id="name"
//             type="text"
//             className={`${styles.input} ${errors.name ? styles.inputError : ""
//               }`}
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Appetizer, Hibachi, Sushi Roll..."
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
//             placeholder="Deskripsi singkat kategori (misalnya: menu pembuka sebelum main course)..."
//             rows={3}
//           />
//         </div>

//         {/* Sort order */}
//         <div className={styles.field}>
//           <label className={styles.label} htmlFor="sortOrder">
//             Sort Order (optional)
//           </label>
//           <input
//             id="sortOrder"
//             type="number"
//             min={0}
//             className={styles.input}
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             placeholder="Angka urutan di website (misalnya: 1 untuk muncul di paling atas)"
//           />
//           <p className={styles.helperText}>
//             Jika diisi, kategori dengan angka lebih kecil akan tampil lebih
//             dulu di website utama.
//           </p>
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
//                 ? "Simpan Category"
//                 : "Update Category"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default FormCategory;




// src/pages/formCategory/FormCategory.tsx
import React, { type FormEvent, useEffect, useState } from "react";
import styles from "./FormCategory.module.scss";
import type { Category } from "../../types/category";
import {
  createCategory,
  updateCategory,
  type CategoryPayload,
} from "../../services/categories";

interface FormCategoryProps {
  mode: "create" | "edit";
  category?: Category;
  onClose: () => void;
  onSaved: (kind: "create" | "update") => void; // ⬅️ update
}

interface FieldErrors {
  name?: string;
}

const FormCategory: React.FC<FormCategoryProps> = ({
  mode,
  category,
  onClose,
  onSaved,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && category) {
      setName(category.name ?? "");
      setDescription((category as any).description ?? "");
      setSortOrder(
        (category as any).sortOrder != null
          ? String((category as any).sortOrder)
          : ""
      );
    } else {
      setName("");
      setDescription("");
      setSortOrder("");
    }

    setErrors({});
    setSubmitError(null);
  }, [mode, category]);

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};

    if (!name.trim()) {
      newErrors.name = "Nama kategori wajib diisi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload: CategoryPayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        sortOrder: sortOrder.trim()
          ? Number(sortOrder.trim())
          : undefined,
      };

      if (mode === "create") {
        await createCategory(payload);
        onSaved("create"); // ⬅️ info jenis aksi
      } else if (mode === "edit" && category) {
        await updateCategory(category.id, payload);
        onSaved("update"); // ⬅️ info jenis aksi
      }

      setSubmitting(false);
      onClose();
    } catch (err: any) {
      console.error("Failed to save category:", err);
      setSubmitting(false);

      const serverError = err?.response?.data;
      if (serverError?.error) {
        const details = Array.isArray(serverError.details)
          ? serverError.details
            .map((d: any) => d?.message)
            .filter(Boolean)
          : [];
        const message =
          details.join(" ") ||
          serverError.error ||
          serverError.message;
        if (message) {
          setSubmitError(message);
          return;
        }
      }

      setSubmitError("Gagal menyimpan kategori. Coba lagi.");
    }
  };

  const title = mode === "create" ? "Add Category" : "Edit Category";

  return (
    <div className={styles.formCard}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>
            Atur kategori menu untuk mengelompokkan produk Hibachi & Sushi.
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
            Category Name
          </label>
          <input
            id="name"
            type="text"
            className={`${styles.input} ${errors.name ? styles.inputError : ""
              }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Appetizer, Hibachi, Sushi Roll..."
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
            placeholder="Deskripsi singkat kategori (misalnya: menu pembuka sebelum main course)..."
            rows={3}
          />
        </div>

        {/* Sort order */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="sortOrder">
            Sort Order (optional)
          </label>
          <input
            id="sortOrder"
            type="number"
            min={0}
            className={styles.input}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            placeholder="Angka urutan di website (misalnya: 1 untuk muncul di paling atas)"
          />
          <p className={styles.helperText}>
            Jika diisi, kategori dengan angka lebih kecil akan tampil lebih
            dulu di website utama.
          </p>
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
                ? "Simpan Category"
                : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormCategory;