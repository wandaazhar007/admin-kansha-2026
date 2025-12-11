// // src/pages/product/ProductPage.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import styles from "./ProductPage.module.scss";
// import {
//   fetchProducts,
//   deleteProduct,
// } from "../../services/products";
// import type { Product } from "../../types/product";
// import FormProduct from "../formProduct/FormProduct";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faPlus,
//   faPenToSquare,
//   faTrashCan,
//   faMagnifyingGlass,
//   faChevronLeft,
//   faChevronRight,
// } from "@fortawesome/free-solid-svg-icons";

// const PAGE_SIZE = 8;
// const MIN_LOADING_MS = 800;

// const ProductPage: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingError, setLoadingError] = useState<string | null>(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);

//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<Product | null>(null);
//   const [deleting, setDeleting] = useState(false);

//   const loadProducts = async () => {
//     setLoading(true);
//     setLoadingError(null);
//     const start = performance.now();

//     try {
//       const data = await fetchProducts();
//       setProducts(data);
//       // minimal delay untuk skeleton
//       const elapsed = performance.now() - start;
//       const remaining = MIN_LOADING_MS - elapsed;
//       if (remaining > 0) {
//         setTimeout(() => setLoading(false), remaining);
//       } else {
//         setLoading(false);
//       }
//     } catch (err) {
//       console.error("Failed to fetch products:", err);
//       setLoading(false);
//       setLoadingError("Gagal memuat daftar produk. Coba lagi.");
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   // Search filter
//   const filteredProducts = useMemo(() => {
//     const term = searchTerm.trim().toLowerCase();
//     if (!term) return products;

//     return products.filter((p) => {
//       const name = p.name?.toLowerCase() ?? "";
//       const desc = p.description?.toLowerCase() ?? "";
//       const cat = p.categoryName?.toLowerCase() ?? "";
//       return (
//         name.includes(term) || desc.includes(term) || cat.includes(term)
//       );
//     });
//   }, [products, searchTerm]);

//   // Pagination
//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredProducts.length / PAGE_SIZE)
//   );

//   const safePage = Math.min(currentPage, totalPages);
//   useEffect(() => {
//     if (currentPage !== safePage) {
//       setCurrentPage(safePage);
//     }
//   }, [safePage, currentPage]);

//   const paginatedProducts = useMemo(() => {
//     const startIndex = (safePage - 1) * PAGE_SIZE;
//     return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
//   }, [filteredProducts, safePage]);

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleOpenCreateForm = () => {
//     setEditingProduct(null);
//     setIsFormOpen(true);
//   };

//   const handleOpenEditForm = (product: Product) => {
//     setEditingProduct(product);
//     setIsFormOpen(true);
//   };

//   const handleFormClose = () => {
//     setIsFormOpen(false);
//     setEditingProduct(null);
//   };

//   const handleFormSaved = async () => {
//     await loadProducts();
//   };

//   const handleOpenDeleteModal = (product: Product) => {
//     setProductToDelete(product);
//     setIsDeleteModalOpen(true);
//   };

//   const handleCloseDeleteModal = () => {
//     if (deleting) return;
//     setIsDeleteModalOpen(false);
//     setProductToDelete(null);
//   };

//   const handleConfirmDelete = async () => {
//     if (!productToDelete) return;
//     try {
//       setDeleting(true);
//       await deleteProduct(productToDelete.id);
//       setDeleting(false);
//       setIsDeleteModalOpen(false);
//       setProductToDelete(null);
//       await loadProducts();
//     } catch (err) {
//       console.error("Failed to delete product:", err);
//       setDeleting(false);
//       // optional: tampilkan pesan error, bisa nanti ditambahkan toast
//     }
//   };

//   const handlePrevPage = () => {
//     setCurrentPage((prev) => Math.max(1, prev - 1));
//   };

//   const handleNextPage = () => {
//     setCurrentPage((prev) => Math.min(totalPages, prev + 1));
//   };

//   const handleGoToPage = (page: number) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className={styles.productPage}>
//       <div className={styles.header}>
//         <div>
//           <h1 className={styles.title}>Products</h1>
//           <p className={styles.subtitle}>
//             Kelola menu hibachi &amp; sushi yang tampil di website Kansha.
//           </p>
//         </div>
//         <button
//           type="button"
//           className={styles.addButton}
//           onClick={handleOpenCreateForm}
//         >
//           <FontAwesomeIcon icon={faPlus} />
//           <span>Add Product</span>
//         </button>
//       </div>

//       <div className={styles.toolbar}>
//         <div className={styles.searchBox}>
//           <span className={styles.searchIcon}>
//             <FontAwesomeIcon icon={faMagnifyingGlass} />
//           </span>
//           <input
//             type="text"
//             placeholder="Cari produk berdasarkan nama, kategori, atau deskripsi..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//         </div>
//       </div>

//       <div className={styles.tableCard}>
//         {loading && (
//           <div className={styles.tableSkeleton}>
//             {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
//               <div key={idx} className={styles.skeletonRow}>
//                 <div className={styles.skeletonCellWide} />
//                 <div className={styles.skeletonCell} />
//                 <div className={styles.skeletonCell} />
//                 <div className={styles.skeletonCellShort} />
//               </div>
//             ))}
//           </div>
//         )}

//         {!loading && loadingError && (
//           <div className={styles.errorBox}>
//             <p>{loadingError}</p>
//             <button
//               type="button"
//               className={styles.retryButton}
//               onClick={loadProducts}
//             >
//               Coba lagi
//             </button>
//           </div>
//         )}

//         {!loading && !loadingError && paginatedProducts.length === 0 && (
//           <div className={styles.emptyState}>
//             <p>Belum ada produk yang cocok dengan pencarianmu.</p>
//             <button
//               type="button"
//               className={styles.addButtonSecondary}
//               onClick={handleOpenCreateForm}
//             >
//               Tambah produk pertama
//             </button>
//           </div>
//         )}

//         {!loading && !loadingError && paginatedProducts.length > 0 && (
//           <div className={styles.tableWrapper}>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Category</th>
//                   <th className={styles.thPrice}>Price</th>
//                   <th className={styles.thStatus}>Status</th>
//                   <th className={styles.thActions}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedProducts.map((product) => (
//                   <tr key={product.id}>
//                     <td>
//                       <div className={styles.productCell}>
//                         {product.imageUrl && (
//                           <img
//                             src={product.imageUrl}
//                             alt={product.name}
//                             className={styles.productImage}
//                           />
//                         )}
//                         <div>
//                           <div className={styles.productName}>
//                             {product.name}
//                           </div>
//                           {product.description && (
//                             <div className={styles.productDescription}>
//                               {product.description}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       {product.categoryName || (
//                         <span className={styles.badgeMuted}>No category</span>
//                       )}
//                     </td>
//                     <td className={styles.tdPrice}>
//                       ${product.price.toFixed(2)}
//                     </td>
//                     <td>
//                       <span
//                         className={
//                           product.isAvailable
//                             ? styles.badgeAvailable
//                             : styles.badgeUnavailable
//                         }
//                       >
//                         {product.isAvailable ? "Available" : "Hidden"}
//                       </span>
//                     </td>
//                     <td className={styles.tdActions}>
//                       <button
//                         type="button"
//                         className={`${styles.actionIconButton} ${styles.actionEdit}`}
//                         onClick={() => handleOpenEditForm(product)}
//                       >
//                         <FontAwesomeIcon icon={faPenToSquare} />
//                       </button>
//                       <button
//                         type="button"
//                         className={`${styles.actionIconButton} ${styles.actionDelete}`}
//                         onClick={() => handleOpenDeleteModal(product)}
//                       >
//                         <FontAwesomeIcon icon={faTrashCan} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className={styles.pagination}>
//                 <button
//                   type="button"
//                   className={styles.paginationButton}
//                   onClick={handlePrevPage}
//                   disabled={safePage === 1}
//                 >
//                   <FontAwesomeIcon icon={faChevronLeft} />
//                 </button>
//                 <div className={styles.paginationPages}>
//                   {Array.from({ length: totalPages }).map((_, index) => {
//                     const page = index + 1;
//                     return (
//                       <button
//                         key={page}
//                         type="button"
//                         className={`${styles.pageNumber} ${page === safePage ? styles.pageNumberActive : ""
//                           }`}
//                         onClick={() => handleGoToPage(page)}
//                       >
//                         {page}
//                       </button>
//                     );
//                   })}
//                 </div>
//                 <button
//                   type="button"
//                   className={styles.paginationButton}
//                   onClick={handleNextPage}
//                   disabled={safePage === totalPages}
//                 >
//                   <FontAwesomeIcon icon={faChevronRight} />
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Form Modal (Create / Edit) */}
//       {isFormOpen && (
//         <div className={styles.formOverlay}>
//           <div className={styles.formModal}>
//             <FormProduct
//               mode={editingProduct ? "edit" : "create"}
//               product={editingProduct || undefined}
//               onClose={handleFormClose}
//               onSaved={handleFormSaved}
//             />
//           </div>
//         </div>
//       )}

//       {/* Delete confirmation modal */}
//       {isDeleteModalOpen && productToDelete && (
//         <div className={styles.deleteOverlay}>
//           <div className={styles.deleteModal}>
//             <h3>Hapus produk?</h3>
//             <p>
//               Kamu yakin ingin menghapus{" "}
//               <strong>{productToDelete.name}</strong>? Tindakan ini tidak bisa
//               dibatalkan.
//             </p>
//             <div className={styles.deleteActions}>
//               <button
//                 type="button"
//                 className={styles.cancelDeleteButton}
//                 onClick={handleCloseDeleteModal}
//                 disabled={deleting}
//               >
//                 Batal
//               </button>
//               <button
//                 type="button"
//                 className={styles.confirmDeleteButton}
//                 onClick={handleConfirmDelete}
//                 disabled={deleting}
//               >
//                 {deleting ? "Menghapus..." : "Hapus"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductPage;


// src/pages/product/ProductPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "./ProductPage.module.scss";
import {
  fetchProducts,
  deleteProduct,
} from "../../services/products";
import type { Product } from "../../types/product";
import FormProduct from "../formProduct/FormProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrashCan,
  faMagnifyingGlass,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 8;
const MIN_LOADING_MS = 800;

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    setLoadingError(null);
    const start = performance.now();

    try {
      const data = await fetchProducts(); // dijamin Product[]
      setProducts(data);

      // minimal delay untuk skeleton
      const elapsed = performance.now() - start;
      const remaining = MIN_LOADING_MS - elapsed;
      if (remaining > 0) {
        setTimeout(() => setLoading(false), remaining);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setLoading(false);
      setLoadingError("Gagal memuat daftar produk. Coba lagi.");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Search filter
  const filteredProducts = useMemo<Product[]>(() => {
    // Defensive: pastikan base selalu array
    const base = Array.isArray(products) ? products : [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return base;

    return base.filter((p) => {
      const name = p.name?.toLowerCase() ?? "";
      const desc = p.description?.toLowerCase() ?? "";
      const cat = p.categoryName?.toLowerCase() ?? "";
      return (
        name.includes(term) || desc.includes(term) || cat.includes(term)
      );
    });
  }, [products, searchTerm]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [safePage, currentPage]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE;
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredProducts, safePage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenCreateForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormSaved = async () => {
    await loadProducts();
  };

  const handleOpenDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      await deleteProduct(productToDelete.id);
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      await loadProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      setDeleting(false);
      // optional: tampilkan pesan error, bisa nanti ditambahkan toast
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleGoToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.productPage}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.subtitle}>
            Kelola menu hibachi &amp; sushi yang tampil di website Kansha.
          </p>
        </div>
        <button
          type="button"
          className={styles.addButton}
          onClick={handleOpenCreateForm}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Add Product</span>
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama, kategori, atau deskripsi..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className={styles.tableCard}>
        {loading && (
          <div className={styles.tableSkeleton}>
            {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
              <div key={idx} className={styles.skeletonRow}>
                <div className={styles.skeletonCellWide} />
                <div className={styles.skeletonCell} />
                <div className={styles.skeletonCell} />
                <div className={styles.skeletonCellShort} />
              </div>
            ))}
          </div>
        )}

        {!loading && loadingError && (
          <div className={styles.errorBox}>
            <p>{loadingError}</p>
            <button
              type="button"
              className={styles.retryButton}
              onClick={loadProducts}
            >
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !loadingError && paginatedProducts.length === 0 && (
          <div className={styles.emptyState}>
            <p>Belum ada produk yang cocok dengan pencarianmu.</p>
            <button
              type="button"
              className={styles.addButtonSecondary}
              onClick={handleOpenCreateForm}
            >
              Tambah produk pertama
            </button>
          </div>
        )}

        {!loading && !loadingError && paginatedProducts.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th className={styles.thPrice}>Price</th>
                  <th className={styles.thStatus}>Status</th>
                  <th className={styles.thActions}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className={styles.productCell}>
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className={styles.productImage}
                          />
                        )}
                        <div>
                          <div className={styles.productName}>
                            {product.name}
                          </div>
                          {product.description && (
                            <div className={styles.productDescription}>
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      {product.categoryName || (
                        <span className={styles.badgeMuted}>No category</span>
                      )}
                    </td>
                    <td className={styles.tdPrice}>
                      ${product.price.toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={
                          product.isAvailable
                            ? styles.badgeAvailable
                            : styles.badgeUnavailable
                        }
                      >
                        {product.isAvailable ? "Available" : "Hidden"}
                      </span>
                    </td>
                    <td className={styles.tdActions}>
                      <button
                        type="button"
                        className={`${styles.actionIconButton} ${styles.actionEdit}`}
                        onClick={() => handleOpenEditForm(product)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.actionIconButton} ${styles.actionDelete}`}
                        onClick={() => handleOpenDeleteModal(product)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={styles.paginationButton}
                  onClick={handlePrevPage}
                  disabled={safePage === 1}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <div className={styles.paginationPages}>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        type="button"
                        className={`${styles.pageNumber} ${page === safePage ? styles.pageNumberActive : ""
                          }`}
                        onClick={() => handleGoToPage(page)}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className={styles.paginationButton}
                  onClick={handleNextPage}
                  disabled={safePage === totalPages}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Modal (Create / Edit) */}
      {isFormOpen && (
        <div className={styles.formOverlay}>
          <div className={styles.formModal}>
            <FormProduct
              mode={editingProduct ? "edit" : "create"}
              product={editingProduct || undefined}
              onClose={handleFormClose}
              onSaved={handleFormSaved}
            />
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && productToDelete && (
        <div className={styles.deleteOverlay}>
          <div className={styles.deleteModal}>
            <h3>Hapus produk?</h3>
            <p>
              Kamu yakin ingin menghapus{" "}
              <strong>{productToDelete.name}</strong>? Tindakan ini tidak bisa
              dibatalkan.
            </p>
            <div className={styles.deleteActions}>
              <button
                type="button"
                className={styles.cancelDeleteButton}
                onClick={handleCloseDeleteModal}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                type="button"
                className={styles.confirmDeleteButton}
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
