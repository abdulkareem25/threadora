import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPublicProductById, getRelatedProducts } from '../services/product.api';
import '../styles/productDetail.css';

/* ─── Icons ─────────────────────────────────────────────────────── */
const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const RulerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21.3 8.7 8.7 21.3c-.4.4-.8.6-1.3.6s-.9-.2-1.3-.6L2.7 17.9c-.4-.4-.6-.8-.6-1.3s.2-.9.6-1.3L15.3 2.7c.4-.4.8-.6 1.3-.6s.9.2 1.3.6l3.4 3.4c.4.4.6.8.6 1.3s-.2.9-.6 1.3z" />
    <line x1="7.5" y1="10.5" x2="9" y2="12" />
    <line x1="10.5" y1="7.5" x2="12" y2="9" />
    <line x1="13.5" y1="4.5" x2="15" y2="6" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
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

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

/* ─── Helpers ───────────────────────────────────────────────────── */
const formatPrice = (price) => {
  if (!price) return '—';
  const sym = price.currency === 'INR' ? '₹' : price.currency;
  return `${sym}${Number(price.amount).toLocaleString('en-IN')}`;
};

/* ─── Accordion component ───────────────────────────────────────── */
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`pd2-accordion${open ? ' is-open' : ''}`}>
      <button
        className="pd2-accordion-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        type="button"
      >
        <span>{title}</span>
        <span className="pd2-accordion-icon"><ChevronDownIcon /></span>
      </button>
      <div className="pd2-accordion-body">
        <div className="pd2-accordion-inner">{children}</div>
      </div>
    </div>
  );
};

/* ─── Image Gallery — thumbnails LEFT, main image right ─────────── */
const ImageGallery = ({ images, productName }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const safeImages = images?.length > 0 ? images : [];

  const prev = () => setActiveIdx((i) => (i === 0 ? safeImages.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === safeImages.length - 1 ? 0 : i + 1));

  if (safeImages.length === 0) {
    return (
      <div className="pd2-gallery">
        <div className="pd2-gallery-placeholder" aria-label="No image available">
          <span>No image available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pd2-gallery">
      {/* Vertical thumbnail strip */}
      {safeImages.length > 1 && (
        <div className="pd2-thumbs" role="list" aria-label="Product thumbnails">
          {safeImages.map((src, i) => (
            <button
              key={i}
              role="listitem"
              className={`pd2-thumb-btn${i === activeIdx ? ' is-active' : ''}`}
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

      {/* Main image */}
      <div className="pd2-gallery-main-wrap">
        <img
          className="pd2-gallery-main"
          src={safeImages[activeIdx]}
          alt={`${productName} — image ${activeIdx + 1}`}
          loading="eager"
        />
        {safeImages.length > 1 && (
          <>
            <button className="pd2-arrow pd2-arrow-left" onClick={prev} aria-label="Previous image" type="button">
              <ChevronLeftIcon />
            </button>
            <button className="pd2-arrow pd2-arrow-right" onClick={next} aria-label="Next image" type="button">
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── More From Carousel ────────────────────────────────────────── */
const RelatedProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [wished, setWished] = useState(false);
  const basePrice = product.price;
  const hasDiscount = false; // extend later

  return (
    <div
      className="pd2-related-card"
      onClick={() => navigate(`/products/${product._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/products/${product._id}`)}
      aria-label={`View ${product.name}`}
    >
      <div className="pd2-related-img-wrap">
        <img
          src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/400/400`}
          alt={product.name}
          loading="lazy"
        />
        <button
          className={`pd2-related-heart${wished ? ' is-wished' : ''}`}
          onClick={(e) => { e.stopPropagation(); setWished((v) => !v); }}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          type="button"
        >
          <HeartIcon filled={wished} />
        </button>
      </div>
      <div className="pd2-related-info">
        <p className="pd2-related-name">{product.name}</p>
        <p className="pd2-related-cat">{product.category}</p>
        <p className="pd2-related-price">{formatPrice(basePrice)}</p>
      </div>
    </div>
  );
};

const MoreFromCarousel = ({ category, excludeId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!category) return;
    let cancelled = false;
    setLoading(true);
    getRelatedProducts(category, excludeId, 8)
      .then((data) => { if (!cancelled) setProducts(data.products || []); })
      .catch(() => { if (!cancelled) setProducts([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [category, excludeId]);

  const scroll = (dir) => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector('.pd2-related-card');
    const cardW = card ? card.offsetWidth + 20 : 260;
    trackRef.current.scrollBy({ left: dir * cardW * 2, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="pd2-more-section">
      <div className="pd2-more-header">
        <h2 className="pd2-more-title">More From {category}</h2>
      </div>
      <div className="pd2-related-track">
        {[0,1,2].map((i) => <div key={i} className="pd2-related-skeleton" />)}
      </div>
    </div>
  );

  if (products.length === 0) return null;

  return (
    <section className="pd2-more-section" aria-label={`More from ${category}`}>
      <div className="pd2-more-header">
        <h2 className="pd2-more-title">More From {category}</h2>
        <div className="pd2-more-arrows">
          <button className="pd2-more-arrow" onClick={() => scroll(-1)} aria-label="Scroll left" type="button">
            <ChevronLeftIcon />
          </button>
          <button className="pd2-more-arrow" onClick={() => scroll(1)} aria-label="Scroll right" type="button">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
      <div className="pd2-related-track" ref={trackRef}>
        {products.map((p) => <RelatedProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
};

/* ─── Skeleton ──────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="pd2-skeleton" aria-busy="true" aria-label="Loading…">
    <div className="pd2-skeleton-left">
      <div className="pd2-skeleton-thumbs">
        {[0,1,2,3,4].map((i) => <div key={i} className="pd2-skeleton-thumb" />)}
      </div>
      <div className="pd2-skeleton-main" />
    </div>
    <div className="pd2-skeleton-right">
      <div className="pd2-skel-line is-sm" />
      <div className="pd2-skel-line is-lg" style={{ marginTop: 8 }} />
      <div className="pd2-skel-line is-md" />
      <div className="pd2-skel-line is-sm" style={{ marginTop: 16 }} />
      <div className="pd2-skel-line is-full" style={{ marginTop: 24 }} />
      <div className="pd2-skel-line is-full" />
      <div className="pd2-skel-line is-full is-btn" style={{ marginTop: 32 }} />
      <div className="pd2-skel-line is-full is-btn" style={{ marginTop: 12 }} />
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
  const [addedToBag, setAddedToBag]     = useState(false);
  const [wishlisted, setWishlisted]     = useState(false);
  const [pincode, setPincode]           = useState('');
  const [pincodeMsg, setPincodeMsg]     = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ── Fetch ── */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setFetchError(null);
      setSelectedVariantIdx(null);
      try {
        const data = await getPublicProductById(id);
        if (!cancelled) {
          setProduct(data.product);
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

  /* ── Derived ── */
  const hasVariants    = product?.variants?.length > 0;
  const activeVariant  = hasVariants && selectedVariantIdx !== null
    ? product.variants[selectedVariantIdx]
    : null;
  const displayImages  = activeVariant?.images?.length > 0 ? activeVariant.images : product?.images ?? [];
  const displayPrice   = activeVariant ? activeVariant.price : product?.price;
  const displayStock   = activeVariant !== null ? (activeVariant?.stock ?? 0) : (product?.stock ?? 0);
  const isOutOfStock   = displayStock === 0;

  /* ── Add to bag ── */
  const handleAddToBag = useCallback(() => {
    if (isOutOfStock) return;
    if (hasVariants && selectedVariantIdx === null) return;
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2000);
  }, [isOutOfStock, hasVariants, selectedVariantIdx]);

  /* ── Pincode check ── */
  const handlePincodeCheck = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeMsg({ type: 'error', text: 'Please enter a valid 6-digit pincode.' });
      return;
    }
    setPincodeMsg({ type: 'success', text: `Delivery available to ${pincode}. Expected in 3–5 business days.` });
  };

  const navLinks = ['New & Featured', 'Men', 'Women', 'Kids', 'Jordan', 'Sale'];

  /* ── Render ── */
  return (
    <div className="pd2-page">

      {/* ── Header ── */}
      <header className="pd2-header">
        <div className="pd2-header-top">
          <div className="pd2-header-inner">
            <Link to="/" className="pd2-logo" aria-label="Threadora home">
              <span className="pd2-logo-icon"><LogoIcon /></span>
              <span className="pd2-logo-wordmark">Threadora</span>
            </Link>

            <nav className="pd2-nav" aria-label="Main navigation">
              {navLinks.map((lnk) => (
                <Link key={lnk} to="/" className="pd2-nav-link">{lnk}</Link>
              ))}
            </nav>

            <div className="pd2-header-actions">
              <div className="pd2-search-wrap">
                <span className="pd2-search-icon"><SearchIcon /></span>
                <input
                  className="pd2-search-input"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
              </div>
              <button className="pd2-icon-btn" aria-label="Wishlist" type="button">
                <HeartIcon />
              </button>
              <button className="pd2-icon-btn" aria-label="Bag" type="button">
                <BagIcon />
              </button>
              {user ? (
                <span className="pd2-user-chip">{user.fullName?.split(' ')[0]}</span>
              ) : (
                <Link to="/login" className="pd2-header-sign-in">Sign In</Link>
              )}
            </div>
          </div>
        </div>

        {/* Promo bar */}
        <div className="pd2-promo-bar">
          Enjoy <strong>31% Off</strong> On The Threadora App. Use: <strong>APPS</strong>
          <a href="#" className="pd2-promo-link">Download Now →</a>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="pd2-main" id="main-content">

        {/* Error */}
        {fetchError && !loading && (
          <div className="pd2-error" role="alert">
            <AlertIcon />
            <div>
              <strong>Product not found</strong>
              <p>{fetchError}</p>
              <Link to="/" className="pd2-error-link">Browse all products →</Link>
            </div>
          </div>
        )}

        {/* Skeleton */}
        {loading && <Skeleton />}

        {/* Content */}
        {!loading && !fetchError && product && (
          <>
            <div className="pd2-layout">

              {/* ── Left: Gallery ── */}
              <section className="pd2-gallery-section" aria-label="Product images">
                <ImageGallery images={displayImages} productName={product.name} />
              </section>

              {/* ── Right: Info panel ── */}
              <section className="pd2-info" aria-label="Product details">

                {/* Name + category */}
                <h1 className="pd2-name">{product.name}</h1>
                <p className="pd2-category">{product.category}</p>

                {/* Price */}
                <p className="pd2-price">{formatPrice(displayPrice)}</p>
                <p className="pd2-tax-note">Inclusive of all taxes</p>

                {/* ── Size selector ── */}
                {hasVariants && (
                  <div className="pd2-size-section">
                    <div className="pd2-size-header">
                      <span className="pd2-size-label">Select Size</span>
                      <button className="pd2-size-guide-btn" type="button" aria-label="Size guide">
                        <RulerIcon />
                        <span>Size Guide</span>
                      </button>
                    </div>
                    <div className="pd2-size-grid" role="group" aria-label="Available sizes">
                      {product.variants.map((v, idx) => {
                        const isOut    = (v.stock ?? 0) === 0;
                        const isActive = idx === selectedVariantIdx;
                        return (
                          <button
                            key={v._id ?? idx}
                            id={`size-btn-${idx}`}
                            type="button"
                            className={`pd2-size-btn${isActive ? ' is-active' : ''}${isOut ? ' is-out' : ''}`}
                            onClick={() => !isOut && setSelectedVariantIdx(idx)}
                            aria-pressed={isActive}
                            aria-label={`${v.name}${isOut ? ' — sold out' : ''}`}
                            disabled={isOut}
                            title={isOut ? 'Sold Out' : v.name}
                          >
                            {v.name}
                          </button>
                        );
                      })}
                    </div>
                    {hasVariants && selectedVariantIdx === null && (
                      <p className="pd2-size-hint">Please select a size</p>
                    )}
                  </div>
                )}

                {/* ── CTA ── */}
                <div className="pd2-cta-block">
                  <button
                    id="pd2-add-to-bag-btn"
                    type="button"
                    className={`pd2-add-to-bag${isOutOfStock ? ' is-disabled' : ''}${addedToBag ? ' is-added' : ''}`}
                    onClick={handleAddToBag}
                    disabled={isOutOfStock}
                    aria-label={isOutOfStock ? 'Out of stock' : addedToBag ? 'Added to bag' : 'Add to bag'}
                  >
                    {addedToBag ? '✓ Added to Bag' : isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
                  </button>

                  <button
                    id="pd2-favourite-btn"
                    type="button"
                    className={`pd2-favourite-btn${wishlisted ? ' is-wishlisted' : ''}`}
                    onClick={() => setWishlisted((v) => !v)}
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-pressed={wishlisted}
                  >
                    Favourite
                    <span className="pd2-fav-heart"><HeartIcon filled={wishlisted} /></span>
                  </button>
                </div>

                {/* ── Description ── */}
                {product.description && (
                  <p className="pd2-description">{product.description}</p>
                )}

                {/* Spec bullets */}
                {(product.colourShown || product.styleCode) && (
                  <ul className="pd2-spec-bullets">
                    {product.colourShown && (
                      <li><strong>Colour Shown:</strong> {product.colourShown}</li>
                    )}
                    {product.styleCode && (
                      <li><strong>Style:</strong> {product.styleCode}</li>
                    )}
                  </ul>
                )}

                {/* ── Delivery check ── */}
                <div className="pd2-delivery-section">
                  <p className="pd2-delivery-title">Check delivery date</p>
                  <p className="pd2-delivery-sub">Enter pincode to know exact delivery dates/charges</p>
                  <div className="pd2-pincode-row">
                    <input
                      className="pd2-pincode-input"
                      type="text"
                      placeholder="Pincode"
                      value={pincode}
                      maxLength={6}
                      onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '')); setPincodeMsg(null); }}
                      aria-label="Delivery pincode"
                      onKeyDown={(e) => e.key === 'Enter' && handlePincodeCheck()}
                    />
                    <button className="pd2-pincode-check" type="button" onClick={handlePincodeCheck}>
                      Check
                    </button>
                  </div>
                  {pincodeMsg && (
                    <p className={`pd2-pincode-msg${pincodeMsg.type === 'error' ? ' is-error' : ' is-success'}`}>
                      {pincodeMsg.text}
                    </p>
                  )}
                </div>

                {/* ── Delivery info rows ── */}
                <div className="pd2-info-rows">
                  <div className="pd2-info-row">
                    <span className="pd2-info-row-icon"><RefreshIcon /></span>
                    <span className="pd2-info-row-text">14-day return and size exchange</span>
                    <a href="#" className="pd2-know-more">Know More</a>
                  </div>
                  <div className="pd2-info-row">
                    <span className="pd2-info-row-icon"><TruckIcon /></span>
                    <span className="pd2-info-row-text">Free delivery available</span>
                    <a href="#" className="pd2-know-more">Know More</a>
                  </div>
                </div>

                {/* ── Accordions ── */}
                <div className="pd2-accordions">
                  <Accordion title="Vendor Details">
                    {product.seller?.fullName ? (
                      <div className="pd2-vendor-details">
                        <p><strong>Sold by:</strong> {product.seller.fullName}</p>
                        <p className="pd2-vendor-note">
                          All products are quality-checked and dispatched directly by our verified vendors.
                        </p>
                      </div>
                    ) : (
                      <p className="pd2-vendor-note">Sold and fulfilled by Threadora Official Store.</p>
                    )}
                  </Accordion>

                  <Accordion title="Return And Exchange Policy">
                    <div className="pd2-policy-text">
                      <p>
                        We offer a <strong>14-day return and size exchange</strong> policy from the date of delivery.
                        Items must be unworn, unwashed, and in original packaging with all tags attached.
                      </p>
                      <ul>
                        <li>Initiate a return or exchange from your Orders page within 14 days.</li>
                        <li>Free pick-up is available in most pin codes.</li>
                        <li>Refunds are processed within 5–7 business days after the item is received.</li>
                        <li>Exchange requests are subject to size availability.</li>
                      </ul>
                    </div>
                  </Accordion>
                </div>

              </section>
            </div>

            {/* ── More From ── */}
            <MoreFromCarousel category={product.category} excludeId={product._id} />
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="pd2-footer">
        <span>© 2025 Threadora, Inc. All rights reserved.</span>
        <nav aria-label="Footer links">
          <a href="#">Terms of Use</a>
          <a href="#">Threadora Privacy Policy</a>
          <a href="#">Store Close Policy</a>
        </nav>
      </footer>
    </div>
  );
};

export default ProductDetail;
