import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuth from '../../auth/hooks/useAuth';
import { getPublicProducts } from '../services/product.api';
import '../styles/products.css';

/* ─── Icons ────────────────────────────────────────────────────────── */
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

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
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

/* ─── Categories derived from real data ─────────────────────────────── */
const ALL_FILTER = 'All';

/* ─── Helpers ────────────────────────────────────────────────────────── */
const formatPrice = (price) => {
  if (!price) return '—';
  const sym = price.currency === 'INR' ? '₹' : price.currency;
  return `${sym}${Number(price.amount).toLocaleString('en-IN')}`;
};

/* ─── Skeleton card ──────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="p-skeleton-card" aria-hidden="true">
    <div className="p-skeleton-image" />
    <div className="p-skeleton-body">
      <div className="p-skeleton-line is-full" />
      <div className="p-skeleton-line is-medium" />
      <div className="p-skeleton-line is-short" />
    </div>
  </div>
);

/* ─── Product card ───────────────────────────────────────────────────── */
const ProductCard = ({ product, onClick }) => {
  const hasVariants = product.variants?.length > 0;
  const variantCount = product.variants?.length ?? 0;

  // Collect unique prices across variants to show a price range
  const prices = hasVariants
    ? product.variants.map((v) => v.price?.amount ?? 0)
    : [product.price?.amount ?? 0];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceStr =
    minPrice === maxPrice
      ? formatPrice({ amount: minPrice, currency: product.price?.currency ?? 'INR' })
      : `${formatPrice({ amount: minPrice, currency: product.price?.currency ?? 'INR' })} – ${formatPrice({ amount: maxPrice, currency: product.price?.currency ?? 'INR' })}`;

  const imageUrl = product.images?.[0];
  const totalStock = hasVariants
    ? product.variants.reduce((s, v) => s + (v.stock ?? 0), 0)
    : product.stock;

  return (
    <article
      className="p-card"
      aria-label={product.name}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="p-card-image-wrap">
        {imageUrl ? (
          <img
            className="p-card-img"
            src={imageUrl}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="p-card-img-placeholder" aria-hidden="true">
            <span>No image</span>
          </div>
        )}

        {/* Category badge */}
        {product.category && (
          <span className="p-badge-promo" aria-label={`Category: ${product.category}`}>
            {product.category}
          </span>
        )}

        {/* Wishlist */}
        <button
          className="p-card-wishlist"
          aria-label={`Add ${product.name} to wishlist`}
          type="button"
          onClick={(e) => e.stopPropagation()}
        >
          <HeartIcon />
        </button>
      </div>

      <div className="p-card-meta">
        {/* Variant count pill */}
        {hasVariants && (
          <p className="p-card-subtitle" style={{ marginBottom: 4 }}>
            {variantCount} variant{variantCount !== 1 ? 's' : ''} available
          </p>
        )}

        <p className="p-card-name">{product.name}</p>
        <p className="p-card-subtitle">{product.category}</p>

        <div className="p-card-price">
          <span className="p-price-regular">{priceStr}</span>
        </div>

        {/* Stock indicator */}
        {totalStock === 0 && (
          <p className="p-card-subtitle" style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 4 }}>
            Out of stock
          </p>
        )}
        {totalStock > 0 && totalStock <= 5 && (
          <p className="p-card-subtitle" style={{ color: '#f59e0b', fontSize: '0.75rem', marginTop: 4 }}>
            Only {totalStock} left
          </p>
        )}
      </div>
    </article>
  );
};

/* ─── Home page ──────────────────────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();
  const { logoutUser, fetchCurrentUser } = useAuth();
  const user = useSelector((s) => s.auth.user);

  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([ALL_FILTER]);
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState(null);

  /* ── Fetch user session on mount ──────────────────────────────── */
  useEffect(() => {
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Load products ───────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const data = await getPublicProducts();
        if (!cancelled) {
          setProducts(data.products ?? []);
          // Derive unique categories
          const cats = [...new Set((data.products ?? []).map((p) => p.category).filter(Boolean))];
          setCategories([ALL_FILTER, ...cats]);
        }
      } catch (err) {
        if (!cancelled) setFetchError('Failed to load products. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  /* ── Filtered list ───────────────────────────────────────────── */
  const filteredProducts =
    activeFilter === ALL_FILTER
      ? products
      : products.filter((p) => p.category === activeFilter);

  /* ── Logout handler ──────────────────────────────────────────── */
  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch {
      /* ignore */
    }
  }, [logoutUser, navigate]);

  const navLinks = [
    { label: 'New & Featured', to: '#featured' },
    { label: 'Men',   to: '#' },
    { label: 'Women', to: '#' },
    { label: 'Kids',  to: '#' },
    { label: 'Sale',  to: '#' },
  ];

  return (
    <div className="products-page">

      {/* ── Utility bar ── */}
      <div className="p-utility-bar" role="navigation" aria-label="Secondary navigation">
        <a href="#">Find a Store</a>
        <span className="p-utility-bar-sep">·</span>
        <a href="#">Help</a>
        <span className="p-utility-bar-sep">·</span>
        {user ? (
          <>
            <span style={{ color: 'var(--p-ink-subtle)', fontSize: '0.75rem' }}>
              Hi, {user.fullName?.split(' ')[0]}
            </span>
            <span className="p-utility-bar-sep">·</span>
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit', padding: 0 }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/signup">Join Us</Link>
            <span className="p-utility-bar-sep">·</span>
            <Link to="/login">Sign In</Link>
          </>
        )}
      </div>

      {/* ── Primary nav ── */}
      <nav className="p-nav" aria-label="Primary navigation">
        {/* Hamburger — mobile */}
        <button
          id="nav-hamburger"
          className="p-icon-btn p-nav-hamburger"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          aria-controls="nav-drawer"
        >
          <MenuIcon />
        </button>

        {/* Logo */}
        <Link to="/" className="p-nav-logo" aria-label="Threadora — Go to homepage">
          <span className="p-nav-logo-icon" aria-hidden="true">
            <LogoIcon />
          </span>
          <span className="p-nav-wordmark">Threadora</span>
        </Link>

        {/* Center links */}
        <ul className="p-nav-links" role="list">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.to}
                className={link.label === 'New & Featured' ? 'is-active' : ''}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="p-nav-actions">
          <div className="p-search-pill" role="search" aria-label="Search products">
            <SearchIcon />
            <span>Search</span>
          </div>
          {user ? (
            <Link
              to={user.role === 'seller' ? '/seller/dashboard' : '/'}
              className="p-icon-btn"
              aria-label="My account"
            >
              <UserIcon />
            </Link>
          ) : (
            <Link to="/login" className="p-icon-btn" aria-label="Sign in">
              <UserIcon />
            </Link>
          )}
          <button id="nav-bag-btn" className="p-icon-btn" aria-label="Shopping bag">
            <BagIcon />
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div
        className={`p-nav-drawer-overlay${drawerOpen ? ' is-open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <nav
        id="nav-drawer"
        className={`p-nav-drawer${drawerOpen ? ' is-open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!drawerOpen}
      >
        <button
          className="p-nav-drawer-close"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close navigation menu"
        >
          <CloseIcon />
        </button>
        <ul className="p-nav-drawer-links" role="list">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.to} onClick={() => setDrawerOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {user ? (
            <button
              onClick={handleLogout}
              className="p-btn-primary"
              style={{ textAlign: 'center', border: 'none', cursor: 'pointer', width: '100%' }}
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link to="/login" className="p-btn-primary" style={{ textAlign: 'center' }}>
                Sign In
              </Link>
              <Link
                to="/signup"
                className="p-btn-outline-on-image"
                style={{ textAlign: 'center', background: 'transparent', border: '1px solid var(--p-hairline)', color: 'var(--p-ink)' }}
              >
                Join Us
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Campaign hero ── */}
      <section className="p-hero" aria-label="Campaign hero">
        <img
          className="p-hero-img"
          src="/hero-campaign.png"
          alt="A model wearing Threadora athletic wear on an urban rooftop at golden hour"
        />
        <div className="p-hero-overlay" aria-hidden="true" />
        <div className="p-hero-content">
          <h1 className="p-hero-headline">
            Everything<br />Threads<br />Together
          </h1>
          <p className="p-hero-sub">
            Premium athletic apparel engineered for performance,<br />
            designed for life beyond the court.
          </p>
          {!user && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="#featured" className="p-btn-outline-on-image" aria-label="Shop the collection">
                Shop Now
              </a>
              <Link to="/login" className="p-btn-primary" style={{ padding: '14px 28px', borderRadius: '100px' }}>
                Sign In
              </Link>
            </div>
          )}
          {user && (
            <a href="#featured" className="p-btn-outline-on-image" aria-label="Shop the collection">
              Shop Now
            </a>
          )}
        </div>
      </section>

      {/* ── Main content ── */}
      <main id="main-content">

        {/* ── Featured Products section ── */}
        <section id="featured" className="p-section" aria-labelledby="featured-heading">
          <div className="p-container">

            {/* Section header */}
            <div className="p-section-header">
              <h2 id="featured-heading" className="p-section-title">Featured Products</h2>
              <a href="#" className="p-section-link" aria-label="View all products">View All</a>
            </div>

            {/* Error state */}
            {fetchError && (
              <div
                role="alert"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: '#fef2f2', border: '1px solid #fecaca',
                  color: '#991b1b', borderRadius: '10px', padding: '14px 18px',
                  margin: '24px 0', fontSize: '0.875rem',
                }}
              >
                <AlertIcon /> {fetchError}
              </div>
            )}

            {/* Filter chip rail */}
            {!loading && !fetchError && (
              <div className="p-filter-rail" role="group" aria-label="Filter products by category">
                <div className="p-filter-chips">
                  {categories.map((chip) => (
                    <button
                      key={chip}
                      id={`filter-chip-${chip.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`p-filter-chip${activeFilter === chip ? ' is-active' : ''}`}
                      onClick={() => setActiveFilter(chip)}
                      aria-pressed={activeFilter === chip}
                      type="button"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product grid */}
            <div
              className="p-product-grid"
              role="list"
              aria-label="Product listing"
              style={{ marginTop: 'var(--p-xxl)' }}
            >
              {loading ? (
                /* Skeleton state */
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} role="listitem">
                    <SkeletonCard />
                  </div>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product._id} role="listitem">
                    <ProductCard
                      product={product}
                      onClick={() => navigate(`/products/${product._id}`)}
                    />
                  </div>
                ))
              ) : (
                <p className="p-empty">No products match this filter.</p>
              )}
            </div>

          </div>
        </section>

        {/* ── Member benefit band ── */}
        <section className="p-member-band" aria-label="Member benefits">
          <div className="p-container">
            <div className="p-member-band-inner">
              <div className="p-member-band-copy">
                <p className="p-member-band-eyebrow">Threadora Membership</p>
                <h2 className="p-member-band-headline">
                  Members Get<br />More. Always.
                </h2>
                <Link to="/signup" className="p-btn-secondary-dark" aria-label="Join Threadora membership">
                  Join Free
                </Link>
              </div>

              <div className="p-member-band-stats">
                <div className="p-member-stat">
                  <span className="p-member-stat-num">12K+</span>
                  <span className="p-member-stat-label">Members</span>
                </div>
                <div className="p-member-stat">
                  <span className="p-member-stat-num">Free</span>
                  <span className="p-member-stat-label">Delivery</span>
                </div>
                <div className="p-member-stat">
                  <span className="p-member-stat-num">30%</span>
                  <span className="p-member-stat-label">Off Always</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="p-footer" aria-label="Site footer">
        <div className="p-container">

          <div className="p-footer-cols">
            <div>
              <h3 className="p-footer-col-title">Resources</h3>
              <ul className="p-footer-links">
                <li><a href="#">Size Guide</a></li>
                <li><a href="#">Care Instructions</a></li>
                <li><a href="#">Sustainability</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="p-footer-col-title">Help</h3>
              <ul className="p-footer-links">
                <li><a href="#">Order Status</a></li>
                <li><a href="#">Shipping & Delivery</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="p-footer-col-title">Company</h3>
              <ul className="p-footer-links">
                <li><a href="#">About Threadora</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Investors</a></li>
              </ul>
            </div>
            <div>
              <h3 className="p-footer-col-title">Promotions & Discounts</h3>
              <ul className="p-footer-links">
                <li><a href="#">Student Discount</a></li>
                <li><a href="#">First Responders</a></li>
                <li><a href="#">Military Discount</a></li>
                <li><a href="#">Refer a Friend</a></li>
              </ul>
            </div>
          </div>

          <div className="p-footer-fine">
            <span className="p-footer-copy">
              © 2025 Threadora. All rights reserved.
            </span>
            <nav className="p-footer-fine-links" aria-label="Legal links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Cookie Settings</a>
              <a href="#">Supply Chain Act</a>
            </nav>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Home;
