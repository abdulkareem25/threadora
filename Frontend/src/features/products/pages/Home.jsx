import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

/* ─── Mock product data ─────────────────────────────────────────────── */
const ALL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Threads Utility Jacket',
    subtitle: "Men's Athletic Outerwear",
    img: '/product-jacket.png',
    swatches: ['#2c2c2e', '#1a3a2a', '#3a1a1a', '#1a1a3a'],
    activeSwatchIdx: 0,
    badge: 'Just In',
    price: 189,
    salePrice: null,
    category: 'Apparel',
  },
  {
    id: 'p2',
    name: 'Apex Training Shorts',
    subtitle: "Men's Training Shorts",
    img: '/product-shorts.png',
    swatches: ['#1a2a4a', '#0c0c0c', '#2a1a0c'],
    activeSwatchIdx: 0,
    badge: null,
    price: 65,
    salePrice: 45,
    category: 'Apparel',
  },
  {
    id: 'p3',
    name: 'Tech Mesh Tee',
    subtitle: "Men's Performance T-Shirt",
    img: '/product-tee.png',
    swatches: ['#0c0c0c', '#f0f0f0', '#2c1a0c'],
    activeSwatchIdx: 0,
    badge: 'Member Exclusive',
    price: 55,
    salePrice: null,
    category: 'Apparel',
  },
  {
    id: 'p4',
    name: 'Motion Training Pants',
    subtitle: "Men's Training Trousers",
    img: '/product-pants.png',
    swatches: ['#2a2e1a', '#0c0c0c', '#1a2a2a', '#3a2a0c'],
    activeSwatchIdx: 0,
    badge: 'Just In',
    price: 95,
    salePrice: null,
    category: 'Apparel',
  },
  {
    id: 'p5',
    name: 'Oversize Fleece Hoodie',
    subtitle: "Unisex Pullover Hoodie",
    img: '/product-hoodie.png',
    swatches: ['#3a0c1a', '#0c0c0c', '#1a1a3a'],
    activeSwatchIdx: 0,
    badge: null,
    price: 125,
    salePrice: 89,
    category: 'Apparel',
  },
  {
    id: 'p6',
    name: 'Aero Running Vest',
    subtitle: "Men's Running Gilet",
    img: '/product-vest.png',
    swatches: ['#2c2c2e', '#1a2a1a', '#0c1a2a'],
    activeSwatchIdx: 0,
    badge: 'Coming Soon',
    price: 145,
    salePrice: null,
    category: 'Apparel',
  },
];

const FILTER_CHIPS = ['All', 'New & Featured', 'Apparel', 'Accessories', 'Sale'];

/* ─── Helper ─────────────────────────────────────────────────────────── */
const calcPctOff = (original, sale) =>
  Math.round(((original - sale) / original) * 100);

/* ─── Swatch dot ──────────────────────────────────────────────────────── */
const SwatchRow = ({ swatches, activeIdx }) => (
  <div className="p-swatches" aria-label="Available colorways">
    {swatches.slice(0, 5).map((color, i) => (
      <span
        key={i}
        className={`p-swatch${i === activeIdx ? ' is-active' : ''}`}
        style={{ backgroundColor: color }}
        aria-label={`Color option ${i + 1}`}
      />
    ))}
    {swatches.length > 5 && (
      <span className="p-swatch-count">+{swatches.length - 5}</span>
    )}
  </div>
);

/* ─── Product card ───────────────────────────────────────────────────── */
const ProductCard = ({ product }) => {
  const pct = product.salePrice
    ? calcPctOff(product.price, product.salePrice)
    : null;

  return (
    <article className="p-card" aria-label={product.name}>
      {/* Image — full-bleed on soft-cloud */}
      <div className="p-card-image-wrap">
        <img
          className="p-card-img"
          src={product.img}
          alt={product.name}
          loading="lazy"
        />

        {/* badge-promo: top-left overlay */}
        {product.badge && (
          <span className="p-badge-promo" aria-label={`Badge: ${product.badge}`}>
            {product.badge}
          </span>
        )}

        {/* Wishlist — button-icon-circular, top-right */}
        <button
          className="p-card-wishlist"
          aria-label={`Add ${product.name} to wishlist`}
          type="button"
        >
          <HeartIcon />
        </button>
      </div>

      {/* Metadata — sits directly below with 8px gap between rows */}
      <div className="p-card-meta">
        <SwatchRow swatches={product.swatches} activeIdx={product.activeSwatchIdx} />

        <p className="p-card-name">{product.name}</p>
        <p className="p-card-subtitle">{product.subtitle}</p>

        {/* Price row */}
        <div className="p-card-price">
          {product.salePrice ? (
            <>
              {/* badge-sale-text: red discounted price */}
              <span className="p-price-sale">
                ${product.salePrice}
              </span>
              {/* strike-through original */}
              <span className="p-price-original">
                ${product.price}
              </span>
              {/* % off in sale color */}
              <span className="p-price-pct">{pct}% off</span>
            </>
          ) : (
            <span className="p-price-regular">${product.price}</span>
          )}
        </div>
      </div>
    </article>
  );
};

/* ─── Home page ──────────────────────────────────────────────────────── */
const Home = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { label: 'New & Featured', to: '#' },
    { label: 'Men', to: '#' },
    { label: 'Women', to: '#' },
    { label: 'Kids', to: '#' },
    { label: 'Sale', to: '#' },
  ];

  const filteredProducts =
    activeFilter === 'All'
      ? ALL_PRODUCTS
      : activeFilter === 'Sale'
      ? ALL_PRODUCTS.filter((p) => p.salePrice !== null)
      : ALL_PRODUCTS.filter((p) => p.category === activeFilter);

  return (
    <div className="products-page">

      {/* ── Utility bar — component.utility-bar ── */}
      <div className="p-utility-bar" role="navigation" aria-label="Secondary navigation">
        <a href="#">Find a Store</a>
        <span className="p-utility-bar-sep">·</span>
        <a href="#">Help</a>
        <span className="p-utility-bar-sep">·</span>
        <Link to="/signup">Join Us</Link>
        <span className="p-utility-bar-sep">·</span>
        <Link to="/login">Sign In</Link>
      </div>

      {/* ── Primary nav — component.primary-nav ── */}
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
          {/* Search pill — component.search-pill */}
          <div
            className="p-search-pill"
            role="search"
            aria-label="Search products"
          >
            <SearchIcon />
            <span>Search</span>
          </div>
          <button
            id="nav-wishlist-btn"
            className="p-icon-btn"
            aria-label="Wishlist"
          >
            <HeartIcon />
          </button>
          <button
            id="nav-bag-btn"
            className="p-icon-btn"
            aria-label="Shopping bag"
          >
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
          <Link to="/login" className="p-btn-primary" style={{ textAlign: 'center' }}>
            Sign In
          </Link>
          <Link to="/signup" className="p-btn-outline-on-image" style={{ textAlign: 'center', background: 'transparent', border: '1px solid var(--p-hairline)', color: 'var(--p-ink)' }}>
            Join Us
          </Link>
        </div>
      </nav>

      {/* ── Campaign hero — component.campaign-tile ── */}
      <section className="p-hero" aria-label="Campaign hero">
        <img
          className="p-hero-img"
          src="/hero-campaign.png"
          alt="A model wearing Threadora athletic wear on an urban rooftop at golden hour"
        />
        <div className="p-hero-overlay" aria-hidden="true" />
        <div className="p-hero-content">
          {/* display-campaign: 96px Bebas Neue, uppercase, line-height 0.9 */}
          <h1 className="p-hero-headline">
            Everything<br />Threads<br />Together
          </h1>
          <p className="p-hero-sub">
            Premium athletic apparel engineered for performance,<br />
            designed for life beyond the court.
          </p>
          {/* button-outline-on-image: white pill, bottom-left anchor */}
          <a href="#featured" className="p-btn-outline-on-image" aria-label="Shop the collection">
            Shop Now
          </a>
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

            {/* Filter chip rail */}
            <div className="p-filter-rail" role="group" aria-label="Filter products by category">
              <div className="p-filter-chips">
                {FILTER_CHIPS.map((chip) => (
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

            {/* Product grid — 3-up desktop, 2-up tablet, 1-up mobile */}
            <div
              className="p-product-grid"
              role="list"
              aria-label="Product listing"
              style={{ marginTop: 'var(--p-xxl)' }}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} role="listitem">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <p className="p-empty">No products match this filter.</p>
              )}
            </div>

          </div>
        </section>

        {/* ── Member benefit band — component.member-benefit-card ── */}
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

      {/* ── Footer — component.footer ── */}
      <footer className="p-footer" aria-label="Site footer">
        <div className="p-container">

          {/* 4-column layout */}
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

          {/* Fine-print row — utility-xs per spec */}
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
