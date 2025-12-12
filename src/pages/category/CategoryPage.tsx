// src/pages/category/CategoryPage.tsx
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./CategoryPage.module.scss";
import FormCategory from "../formCategory/FormCategory";
import type { Category } from "../../types/category";
import {
  fetchCategories,
  deleteCategory,
} from "../../services/categories";
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

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [filtering, setFiltering] = useState(false);
  const filterTimerRef = useRef<number | null>(null);

  const [paginating, setPaginating] = useState(false);
  const paginationTimerRef = useRef<number | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    setLoadingError(null);
    const start = performance.now();

    try {
      const data = await fetchCategories();
      setCategories(data);

      const elapsed = performance.now() - start;
      const remaining = MIN_LOADING_MS - elapsed;
      if (remaining > 0) {
        setTimeout(() => setLoading(false), remaining);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setLoading(false);
      setLoadingError("Gagal memuat daftar kategori. Coba lagi.");
    }
  };

  useEffect(() => {
    loadCategories();

    return () => {
      if (filterTimerRef.current) {
        window.clearTimeout(filterTimerRef.current);
      }
      if (paginationTimerRef.current) {
        window.clearTimeout(paginationTimerRef.current);
      }
    };
  }, []);

  const filteredCategories = useMemo<Category[]>(() => {
    const base = Array.isArray(categories) ? categories : [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return base;

    return base.filter((c) => {
      const name = c.name?.toLowerCase() ?? "";
      const desc = (c as any).description?.toLowerCase() ?? "";
      return name.includes(term) || desc.includes(term);
    });
  }, [categories, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [safePage, currentPage]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE;
    return filteredCategories.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredCategories, safePage]);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);

    setFiltering(true);
    if (filterTimerRef.current) {
      window.clearTimeout(filterTimerRef.current);
    }
    filterTimerRef.current = window.setTimeout(() => {
      setFiltering(false);
    }, 400);
  };

  const triggerPaginationSkeleton = () => {
    setPaginating(true);
    if (paginationTimerRef.current) {
      window.clearTimeout(paginationTimerRef.current);
    }
    paginationTimerRef.current = window.setTimeout(() => {
      setPaginating(false);
    }, 400);
  };

  const handleOpenCreateForm = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleFormSaved = async () => {
    await loadCategories();
  };

  const handleOpenDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleting(true);
      await deleteCategory(categoryToDelete.id);
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      await loadCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);
      setDeleting(false);
    }
  };

  const handlePrevPage = () => {
    if (safePage === 1) return;
    setCurrentPage((prev) => Math.max(1, prev - 1));
    triggerPaginationSkeleton();
  };

  const handleNextPage = () => {
    if (safePage === totalPages) return;
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    triggerPaginationSkeleton();
  };

  const handleGoToPage = (page: number) => {
    if (page === safePage) return;
    setCurrentPage(page);
    triggerPaginationSkeleton();
  };

  const showSkeleton = loading || filtering || paginating;

  return (
    <div className={styles.categoryPage}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Categories</h1>
          <p className={styles.subtitle}>
            Kelola kategori menu hibachi &amp; sushi di website Kansha.
          </p>
        </div>
        <button
          type="button"
          className={styles.addButton}
          onClick={handleOpenCreateForm}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Add Category</span>
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          <input
            type="text"
            placeholder="Cari kategori berdasarkan nama atau deskripsi..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className={styles.tableCard}>
        {showSkeleton && (
          <div className={styles.tableSkeleton}>
            {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
              <div key={idx} className={styles.skeletonRow}>
                <div className={styles.skeletonCellWide} />
                <div className={styles.skeletonCell} />
                <div className={styles.skeletonCellShort} />
              </div>
            ))}
          </div>
        )}

        {!showSkeleton && loadingError && (
          <div className={styles.errorBox}>
            <p>{loadingError}</p>
            <button
              type="button"
              className={styles.retryButton}
              onClick={loadCategories}
            >
              Coba lagi
            </button>
          </div>
        )}

        {!showSkeleton &&
          !loadingError &&
          paginatedCategories.length === 0 && (
            <div className={styles.emptyState}>
              <p>Belum ada kategori yang cocok dengan pencarianmu.</p>
              <button
                type="button"
                className={styles.addButtonSecondary}
                onClick={handleOpenCreateForm}
              >
                Tambah kategori pertama
              </button>
            </div>
          )}

        {!showSkeleton &&
          !loadingError &&
          paginatedCategories.length > 0 && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th className={styles.thActions}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map((category) => (
                    <tr key={category.id}>
                      <td className={styles.tdName}>{category.name}</td>
                      <td className={styles.tdDescription}>
                        {(category as any).description || (
                          <span className={styles.badgeMuted}>
                            No description
                          </span>
                        )}
                      </td>
                      <td className={styles.tdActions}>
                        <button
                          type="button"
                          className={`${styles.actionIconButton} ${styles.actionEdit}`}
                          onClick={() => handleOpenEditForm(category)}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.actionIconButton} ${styles.actionDelete}`}
                          onClick={() => handleOpenDeleteModal(category)}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
                    {Array.from({ length: totalPages }).map(
                      (_, index) => {
                        const page = index + 1;
                        return (
                          <button
                            key={page}
                            type="button"
                            className={`${styles.pageNumber} ${page === safePage
                                ? styles.pageNumberActive
                                : ""
                              }`}
                            onClick={() => handleGoToPage(page)}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}
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

      {/* Form Modal */}
      {isFormOpen && (
        <div className={styles.formOverlay}>
          <div className={styles.formModal}>
            <FormCategory
              mode={editingCategory ? "edit" : "create"}
              category={editingCategory || undefined}
              onClose={handleFormClose}
              onSaved={handleFormSaved}
            />
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && categoryToDelete && (
        <div className={styles.deleteOverlay}>
          <div className={styles.deleteModal}>
            <h3>Hapus kategori?</h3>
            <p>
              Kamu yakin ingin menghapus{" "}
              <strong>{categoryToDelete.name}</strong>? Tindakan
              ini tidak bisa dibatalkan.
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

export default CategoryPage;