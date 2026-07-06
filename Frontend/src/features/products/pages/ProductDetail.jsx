import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPublicProductById } from '../services/product.api';
import '../styles/productDetail.css';

/* ─── Icons ─────────────────────────────────────────────────────── */
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ─── Helpers ───────────────────────────────────────────────────── */
const formatPrice = (price) => {
  if (!price) return '—';
  const sym = price.currency === 'INR' ? '₹' : price.currency;
  return `${sym}${Number(price.amount).toLocaleString('en-IN')}`;
};

const getStockMeta = (stock) => {
  if (stock === 0) return { label: 'Out of Stock',   cls: 'pd-stock-out',  icon: '✕' };
  if (stock <= 5)  return { label: `Only ${stock} left`, cls: 'pd-stock-low', icon: '!' };
  return               { label: 'In Stock',          cls: 'pd-stock-in',   icon: '✓' };
};

/* ─── Image Gallery ─────────────────────────────────────────────── */
const ImageGallery = ({ images, productName }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const safeImages = images?.length > 0 ? images : [];

  const prev = () => setActiveIdx((i) => (i === 0 ? safeImages.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === safeImages.length - 1 ? 0 : i + 1));

  if (safeImages.length === 0) {
    return (
      <div className="pd-gallery-main pd-gallery-placeholder" aria-label="No product image available">
        <span>No image available</span>
      </div>
    );
  }

  return (
    <div className="pd-gallery">
      {/* Main image */}
      <div className="pd-gallery-main-wrap">
        <img
          className="pd-gallery-main"
          src={safeImages[activeIdx]}
          alt={`${productName} — image ${activeIdx + 1} of ${safeImages.length}`}
          loading="eager"
        />

        {/* Arrow controls — only if >1 image */}
        {safeImages.length > 1 && (
          <>
            <button
              className="pd-gallery-arrow pd-gallery-arrow-left"
              onClick={prev}
              aria-label="Previous image"
              type="button"
            >
              <ChevronLeftIcon />
            </button>
            <button
              className="pd-gallery-arrow pd-gallery-arrow-right"
              onClick={next}
              aria-label="Next image"
              type="button"
            >
              <ChevronRightIcon />
            </button>

            {/* Dot indicator */}
            <div className="pd-gallery-dots" aria-label="Image navigation">
              {safeImages.map((_, i) => (
                <button
                  key={i}
                  className={`pd-gallery-dot${i === activeIdx ? ' is-active' : ''}`}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Go to image ${i + 1}`}
                  type="button"
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip — shown when ≥2 images */}
      {safeImages.length > 1 && (
        <div className="pd-gallery-thumbs" role="list" aria-label="Product thumbnails">
          {safeImages.map((src, i) => (
            <button
              key={i}
              role="listitem"
              className={`pd-thumb-btn${i === activeIdx ? ' is-active' : ''}`}
              onClick={() => setActiveIdx(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === activeIdx}
              type="button"
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Skeleton ──────────────────────────────────────────────────── */
const ProductDetailSkeleton = () => (
  <div className="pd-skeleton" aria-busy="true" aria-label="Loading product…">
    <div className="pd-skeleton-gallery">
      <div className="pd-skeleton-main-img" />
      <div className="pd-skeleton-thumbs">
        {[0, 1, 2].map((i) => <div key={i} className="pd-skeleton-thumb" />)}
      </div>
    </div>
    <div className="pd-skeleton-info">
      <div className="pd-skeleton-line is-sm" />
      <div className="pd-skeleton-line is-full is-tall" style={{ marginTop: 12 }} />
      <div className="pd-skeleton-line is-medium" />
      <div className="pd-skeleton-line is-short" style={{ marginTop: 8 }} />
      <div className="pd-skeleton-line is-full" style={{ marginTop: 24 }} />
      <div className="pd-skeleton-line is-full" />
      <div className="pd-skeleton-line is-btn" style={{ marginTop: 32 }} />
    </div>
  </div>
);

/* ─── Product Detail Page ───────────────────────────────────────── */
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);

  const [product, setProduct]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [fetchError, setFetchError]     = useState(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(null);
  const [addedToCart, setAddedToCart]   = useState(false);
  const [wishlisted, setWishlisted]     = useState(false);

  /* ── Fetch product ─────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const data = await getPublicProductById(id);
        if (!cancelled) {
          setProduct(data.product);
          // Pre-select first variant if any
          if (data.product.variants?.length > 0) {
            setSelectedVariantIdx(0);
          }
        }
      } catch (err) {
        if (!cancelled) setFetchError(err.message || 'Product not found.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  /* ── Derived values ────────────────────────────────────────── */
  const hasVariants  = product?.variants?.length > 0;
  const activeVariant = hasVariants && selectedVariantIdx !== null
    ? product.variants[selectedVariantIdx]
    : null;

  // Displayed images: variant images if selected & non-empty, else product images
  const displayImages =
    activeVariant?.images?.length > 0
      ? activeVariant.images
      : product?.images ?? [];

  const displayPrice = activeVariant
    ? activeVariant.price
    : product?.price;

  const displayStock = activeVariant !== null
    ? (activeVariant?.stock ?? 0)
    : (product?.stock ?? 0);

  const stockMeta = product ? getStockMeta(displayStock) : null;

  /* ── Add to cart (skeleton) ────────────────────────────────── */
  const handleAddToCart = useCallback(() => {
    if (displayStock === 0) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [displayStock]);

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="pd-page">

      {/* ── Topbar ── */}
      <header className="pd-topbar">
        <Link to="/" className="pd-topbar-logo" aria-label="Threadora homepage">
          <span className="pd-topbar-logo-icon"><LogoIcon /></span>
          <span className="pd-topbar-wordmark">Threadora</span>
        </Link>

        <nav className="pd-topbar-actions" aria-label="Topbar actions">
          {user ? (
            <span className="pd-topbar-username">
              {user.fullName?.split(' ')[0]}
            </span>
          ) : (
            <Link to="/login" className="pd-topbar-sign-in">Sign In</Link>
          )}
        </nav>
      </header>

      {/* ── Back + breadcrumb ── */}
      <div className="pd-breadcrumb-bar">
        <button
          className="pd-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          type="button"
        >
          <ArrowLeftIcon />
          <span>Back</span>
        </button>

        {product && (
          <nav className="pd-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span>{product.category}</span>
            <span aria-hidden="true">›</span>
            <span className="pd-breadcrumb-current" aria-current="page">
              {product.name}
            </span>
          </nav>
        )}
      </div>

      {/* ── Main content ── */}
      <main className="pd-main" id="main-content">

        {/* Error state */}
        {fetchError && !loading && (
          <div className="pd-error" role="alert">
            <AlertIcon />
            <div>
              <strong>Product not found</strong>
              <p>{fetchError}</p>
              <Link to="/" className="pd-error-link">Browse all products →</Link>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <ProductDetailSkeleton />}

        {/* Product content */}
        {!loading && !fetchError && product && (
          <div className="pd-layout">

            {/* ── Left: Image gallery ── */}
            <section className="pd-gallery-section" aria-label="Product images">
              <ImageGallery images={displayImages} productName={product.name} />
            </section>

            {/* ── Right: Product info ── */}
            <section className="pd-info-section" aria-label="Product details">

              {/* Seller */}
              {product.seller?.fullName && (
                <p className="pd-seller-label">
                  Sold by <strong>{product.seller.fullName}</strong>
                </p>
              )}

              {/* Name */}
              <h1 className="pd-product-name">{product.name}</h1>

              {/* Category */}
              <span className="pd-category-badge">{product.category}</span>

              {/* Price */}
              <div className="pd-price-row">
                <span className="pd-price">{formatPrice(displayPrice)}</span>
                {hasVariants && (
                  <span className="pd-price-note">
                    {activeVariant ? 'for selected variant' : 'starting from'}
                  </span>
                )}
              </div>

              {/* Stock badge */}
              <div className={`pd-stock-badge ${stockMeta.cls}`} aria-label={`Stock: ${stockMeta.label}`}>
                {stockMeta.cls === 'pd-stock-in'  && <CheckIcon />}
                {stockMeta.cls === 'pd-stock-low' && <AlertIcon />}
                {stockMeta.cls === 'pd-stock-out' && <span aria-hidden="true">✕</span>}
                {stockMeta.label}
              </div>

              <div className="pd-section-divider" />

              {/* ── Variant selector ── */}
              {hasVariants && (
                <div className="pd-variants-section">
                  <h2 className="pd-section-label">
                    Select Variant
                    {activeVariant && (
                      <span className="pd-selected-label"> — {activeVariant.name}</span>
                    )}
                  </h2>
                  <div className="pd-variant-grid" role="group" aria-label="Product variants">
                    {product.variants.map((variant, idx) => {
                      const vStock  = variant.stock ?? 0;
                      const isOut   = vStock === 0;
                      const isActive = idx === selectedVariantIdx;
                      return (
                        <button
                          key={variant._id ?? idx}
                          id={`variant-btn-${idx}`}
                          type="button"
                          className={`pd-variant-btn${isActive ? ' is-active' : ''}${isOut ? ' is-sold-out' : ''}`}
                          onClick={() => setSelectedVariantIdx(idx)}
                          aria-pressed={isActive}
                          aria-label={`${variant.name}${isOut ? ' — out of stock' : ''}`}
                          disabled={isOut}
                        >
                          <span className="pd-variant-name">{variant.name}</span>
                          {isOut && <span className="pd-variant-out-tag">Sold Out</span>}
                          {!isOut && (
                            <span className="pd-variant-price">
                              {formatPrice(variant.price)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Attributes ── */}
              {activeVariant?.attributes?.length > 0 && (
                <div className="pd-attributes-section">
                  <h2 className="pd-section-label">Specifications</h2>
                  <dl className="pd-attribute-list">
                    {activeVariant.attributes.map((attr, i) => (
                      <div key={i} className="pd-attribute-row">
                        <dt className="pd-attr-key">{attr.key}</dt>
                        <dd className="pd-attr-value">{attr.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Base product attributes (no variants) */}
              {!hasVariants && product.description && (
                <div className="pd-attributes-section">
                  <h2 className="pd-section-label">Details</h2>
                  <p className="pd-description">{product.description}</p>
                </div>
              )}

              {/* Variant description */}
              {activeVariant?.description && (
                <p className="pd-variant-desc">{activeVariant.description}</p>
              )}

              {/* Base description (always shown for context) */}
              {product.description && hasVariants && (
                <p className="pd-description">{product.description}</p>
              )}

              <div className="pd-section-divider" />

              {/* ── CTA buttons ── */}
              <div className="pd-cta-row">
                <button
                  id="pd-add-to-cart-btn"
                  type="button"
                  className={`pd-btn-primary${displayStock === 0 ? ' is-disabled' : ''}${addedToCart ? ' is-added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={displayStock === 0}
                  aria-label={displayStock === 0 ? 'Out of stock' : 'Add to cart'}
                >
                  {addedToCart ? (
                    <><CheckIcon /> Added to Cart</>
                  ) : displayStock === 0 ? (
                    'Out of Stock'
                  ) : (
                    'Add to Cart'
                  )}
                </button>

                <button
                  id="pd-wishlist-btn"
                  type="button"
                  className={`pd-btn-icon${wishlisted ? ' is-wishlisted' : ''}`}
                  onClick={() => setWishlisted((v) => !v)}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  aria-pressed={wishlisted}
                >
                  <HeartIcon />
                </button>

                <button
                  id="pd-share-btn"
                  type="button"
                  className="pd-btn-icon"
                  aria-label="Share this product"
                  onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                >
                  <ShareIcon />
                </button>
              </div>

              {/* Variant stock note */}
              {hasVariants && !activeVariant && (
                <p className="pd-select-variant-hint">
                  ↑ Select a variant to see availability and price
                </p>
              )}

              {/* Seller info */}
              {product.seller?.fullName && (
                <p className="pd-seller-info">
                  Listed by <strong>{product.seller.fullName}</strong>
                </p>
              )}

            </section>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="pd-footer">
        <span>© 2025 Threadora. All rights reserved.</span>
        <nav aria-label="Legal links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
        </nav>
      </footer>
    </div>
  );
};

export default ProductDetail;
