import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useProduct from '../hooks/useProduct';
import '../styles/sellerDashboard.css';

/* ─────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────── */
const LogoIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PackageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const LayersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const BoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CATEGORIES = [
  'All', 'Clothing', 'Footwear', 'Accessories', 'Bags',
  'Sports', 'Electronics', 'Home & Living', 'Beauty', 'Other',
];

/* ─────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────── */
const formatPrice = (price) => {
  if (!price) return '—';
  return `${price.currency ?? 'INR'} ${Number(price.amount).toLocaleString('en-IN')}`;
};

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

const getStockStatus = (stock) => {
  if (stock === 0) return 'is-out';
  if (stock <= 5) return 'is-low';
  return 'is-healthy';
};

const getStockLabel = (stock) => {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 5) return `Low — ${stock} left`;
  return `${stock} in stock`;
};

/* ─────────────────────────────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="sd-skeleton-card" aria-hidden="true">
    <div className="sd-skeleton-image" />
    <div className="sd-skeleton-body">
      <div className="sd-skeleton-line is-full is-tall" />
      <div className="sd-skeleton-line is-medium" />
      <div className="sd-skeleton-line is-short is-sm" style={{ marginTop: 4 }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────────────────────────────── */
const ProductCard = ({ product, onDeleteClick }) => {
  const stockStatus = getStockStatus(product.stock);
  const imageUrl = product.images?.[0] ?? null;
  const imageCount = product.images?.length ?? 0;

  return (
    <article
      className="sd-product-card"
      aria-label={`Product: ${product.name}`}
    >
      {/* Image */}
      <div className="sd-card-image-wrap">
        {imageUrl ? (
          <img
            className="sd-card-image"
            src={imageUrl}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="sd-card-image-placeholder">
            <ImageIcon />
            <span>No image</span>
          </div>
        )}

        {/* Hover action overlay */}
        <div className="sd-card-overlay" aria-hidden="true">
          <Link
            to="/seller/add-product"
            className="sd-btn sd-btn-ghost sd-btn-sm"
            aria-label={`Edit ${product.name}`}
          >
            <EditIcon /> Edit
          </Link>
          <button
            type="button"
            className="sd-btn sd-btn-danger sd-btn-sm"
            onClick={() => onDeleteClick(product)}
            aria-label={`Delete ${product.name}`}
          >
            <TrashIcon /> Delete
          </button>
        </div>

        {/* Image count chip */}
        {imageCount > 0 && (
          <div className="sd-card-image-count">
            <ImageIcon />
            {imageCount}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="sd-card-body">
        <div className="sd-card-header-row">
          <p className="sd-card-name">{product.name}</p>
          {product.category && (
            <span className="sd-category-badge">{product.category}</span>
          )}
        </div>

        <div className="sd-card-meta-row">
          <p className="sd-card-price">
            <span className="sd-card-price-currency">
              {product.price?.currency ?? 'INR'}
            </span>
            {Number(product.price?.amount ?? 0).toLocaleString('en-IN')}
          </p>
          <span className={`sd-stock-pill ${stockStatus}`}>
            {stockStatus === 'is-healthy' && <CheckIcon />}
            {stockStatus === 'is-low'     && <AlertCircleIcon />}
            {stockStatus === 'is-out'     && <XIcon />}
            {getStockLabel(product.stock)}
          </span>
        </div>

        {product.variants?.length > 0 && (
          <div className="sd-card-variants-row">
            <span className="sd-card-variants-label">
              {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        <div className="sd-card-divider" />

        <div className="sd-card-actions">
          <Link
            to="/seller/add-product"
            className="sd-btn sd-btn-ghost sd-btn-sm"
            aria-label={`Edit ${product.name}`}
          >
            <EditIcon /> Edit
          </Link>
          <button
            type="button"
            className="sd-btn sd-btn-danger sd-btn-sm"
            onClick={() => onDeleteClick(product)}
            aria-label={`Delete ${product.name}`}
          >
            <TrashIcon /> Delete
          </button>
          <span className="sd-card-date">{formatDate(product.createdAt)}</span>
        </div>
      </div>
    </article>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   DELETE CONFIRM MODAL
───────────────────────────────────────────────────────────────────── */
const DeleteModal = ({ product, onConfirm, onCancel, isDeleting }) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div
      className="sd-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="sd-modal">
        <div className="sd-modal-icon-wrap">
          <TrashIcon />
        </div>

        <h2 id="delete-modal-title" className="sd-modal-title">
          Delete Product
        </h2>
        <p className="sd-modal-body">
          Are you sure you want to permanently delete{' '}
          <span className="sd-modal-product-name">"{product.name}"</span>?
          This action cannot be undone.
        </p>

        <div className="sd-modal-actions">
          <button
            type="button"
            id="delete-modal-cancel"
            className="sd-btn sd-btn-ghost"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            id="delete-modal-confirm"
            className="sd-btn sd-btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting
              ? <><span className="sd-btn-spinner" aria-hidden="true" />Deleting…</>
              : <><TrashIcon />Delete Product</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────────────── */
const StatCard = ({ icon, value, label }) => (
  <div className="sd-stat-card">
    <div className="sd-stat-icon-wrap">{icon}</div>
    <p className="sd-stat-value">{value}</p>
    <p className="sd-stat-label">{label}</p>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────
   MAIN PAGE — SELLER DASHBOARD
───────────────────────────────────────────────────────────────────── */
const SellerDashboard = () => {
  const { products, loading, error, fetchProducts, destroyProduct, reset } = useProduct();
  const navigate = useNavigate();

  /* ── Local UI state ──────────────────────────────────────── */
  const [search, setSearch]           = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);   // product to delete
  const [isDeleting, setIsDeleting]   = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  /* ── Fetch on mount ──────────────────────────────────────── */
  useEffect(() => {
    reset();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Derived stats ───────────────────────────────────────── */
  const stats = useMemo(() => {
    const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
    const categories = new Set(products.map((p) => p.category).filter(Boolean)).size;
    const avgPrice = products.length
      ? Math.round(
          products.reduce((s, p) => s + (p.price?.amount || 0), 0) / products.length
        )
      : 0;
    return { totalProducts: products.length, totalStock, categories, avgPrice };
  }, [products]);

  /* ── Filtered list ───────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== 'All') {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q) ||
          (p.category ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, activeCategory, search]);

  /* ── Delete handlers ─────────────────────────────────────── */
  const handleDeleteClick = (product) => {
    setDeleteError(null);
    setDeleteTarget(product);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    const result = await destroyProduct(deleteTarget._id);
    setIsDeleting(false);
    if (result.success) {
      setDeleteTarget(null);
    } else {
      setDeleteError(result.error ?? 'Failed to delete product.');
    }
  };

  const handleDeleteCancel = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteError(null);
  };

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="sd-page">

      {/* ── Top Bar ── */}
      <div className="sd-topbar">
        <div className="sd-topbar-left">
          <Link to="/" className="sd-topbar-logo" aria-label="Threadora homepage">
            <span className="sd-topbar-logo-icon"><LogoIcon /></span>
            <span className="sd-topbar-wordmark">Threadora</span>
          </Link>

          <div className="sd-breadcrumb" aria-label="Breadcrumb">
            <span>Seller</span>
            <span className="sd-breadcrumb-sep">/</span>
            <span className="sd-breadcrumb-current">Dashboard</span>
          </div>
        </div>

        <div className="sd-topbar-actions">
          <Link
            to="/seller/add-product"
            id="add-product-nav-btn"
            className="sd-btn sd-btn-primary"
            aria-label="Add a new product"
          >
            <PlusIcon /> Add Product
          </Link>
        </div>
      </div>

      {/* ── Main ── */}
      <main className="sd-main" id="main-content">

        {/* Page Header */}
        <div className="sd-page-header">
          <p className="sd-page-eyebrow">Seller Portal</p>
          <h1 className="sd-page-title">Seller Dashboard</h1>
          <p className="sd-page-subtitle">
            Manage your product catalogue, track inventory and monitor performance.
          </p>
        </div>

        {/* Error banner */}
        {(error || deleteError) && (
          <div className="sd-global-error" role="alert" aria-live="assertive">
            <AlertCircleIcon />
            {deleteError ?? error}
          </div>
        )}

        {/* ── Stats Strip ── */}
        <div className="sd-stats-grid" aria-label="Summary statistics">
          <StatCard
            icon={<PackageIcon />}
            value={stats.totalProducts}
            label="Total Products"
          />
          <StatCard
            icon={<BoxIcon />}
            value={stats.totalStock.toLocaleString('en-IN')}
            label="Units in Stock"
          />
          <StatCard
            icon={<TagIcon />}
            value={stats.categories}
            label="Categories"
          />
          <StatCard
            icon={<TrendingUpIcon />}
            value={stats.avgPrice ? `₹${stats.avgPrice.toLocaleString('en-IN')}` : '—'}
            label="Avg. Price"
          />
        </div>

        {/* ── Toolbar: Search + Filter ── */}
        <div className="sd-toolbar" role="group" aria-label="Product filters">
          {/* Search */}
          <div className="sd-search-wrap">
            <span className="sd-search-icon"><SearchIcon /></span>
            <input
              id="sd-search-input"
              type="search"
              className="sd-search-input"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />
          </div>

          {/* Category filter chips */}
          <div className="sd-filter-chips" role="radiogroup" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`sd-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                type="button"
                className={`sd-filter-chip${activeCategory === cat ? ' is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="sd-results-count" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        {/* ── Product Grid ── */}
        {loading ? (
          /* Skeleton state */
          <div className="sd-skeleton-grid" aria-label="Loading products…" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div
            className="sd-product-grid"
            role="list"
            aria-label="Your products"
          >
            {filtered.map((product) => (
              <div key={product._id} role="listitem">
                <ProductCard
                  product={product}
                  onDeleteClick={handleDeleteClick}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="sd-empty" role="status">
            <div className="sd-empty-icon">
              <PackageIcon />
            </div>
            <h2 className="sd-empty-title">
              {products.length === 0 ? 'No products yet' : 'No results found'}
            </h2>
            <p className="sd-empty-sub">
              {products.length === 0
                ? 'Your catalogue is empty. Add your first product to start selling on Threadora.'
                : `No products match "${search || activeCategory}". Try adjusting your search or filter.`}
            </p>
            {products.length === 0 && (
              <Link
                to="/seller/add-product"
                id="sd-empty-add-btn"
                className="sd-btn sd-btn-primary"
                style={{ marginTop: 8 }}
              >
                <PlusIcon /> Add First Product
              </Link>
            )}
          </div>
        )}

      </main>

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      )}

    </div>
  );
};

export default SellerDashboard;
