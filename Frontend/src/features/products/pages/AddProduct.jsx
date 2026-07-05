import React, { useState, useRef, useCallback, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useProduct from '../hooks/useProduct';
import '../styles/addProduct.css';

/* ─────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────── */
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
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

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
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

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const UploadCloudIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
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

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
const CATEGORIES = [
  'Clothing', 'Footwear', 'Accessories', 'Bags',
  'Sports', 'Electronics', 'Home & Living', 'Beauty', 'Other',
];

/* ─────────────────────────────────────────────────────────────────────
   IMAGE DROPZONE COMPONENT
───────────────────────────────────────────────────────────────────── */
// Each image entry shape:
//   { file: File | null, previewUrl: string, url: string | null }
// - file       : the raw File object while it's staged (before upload); null after upload
// - previewUrl : a blob URL for immediate preview (always available once selected)
// - url        : the final ImageKit URL (set after upload; null while staged)
const ImageDropzone = ({
  images,           // Array of { previewUrl: string, url: string | null }
  onFilesSelected,  // (files: File[]) => void
  onRemove,         // (index: number) => void
  maxImages = 7,
  error,
  compact = false,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const inputId = useId();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    );
    if (files.length > 0) onFilesSelected(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) onFilesSelected(files);
    e.target.value = '';
  };

  const remaining = maxImages - images.length;
  const canAdd = remaining > 0 && !disabled;

  return (
    <div>
      {canAdd && (
        <div
          className={`ap-dropzone${compact ? ' ap-dropzone-compact' : ''}${isDragging ? ' is-dragging' : ''}${error ? ' is-error' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload images"
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            style={{ display: 'none' }}
            disabled={!canAdd}
            aria-hidden="true"
          />

          <div className="ap-dropzone-icon">
            <UploadCloudIcon />
          </div>
          <p className="ap-dropzone-title">
            {isDragging ? 'Drop your images here' : 'Drag & drop or click to upload'}
          </p>
          <p className="ap-dropzone-subtitle">PNG, JPG, WEBP supported</p>
          <div className="ap-dropzone-badge">
            <ImageIcon style={{ width: 12, height: 12 }} />
            {images.length}/{maxImages} images
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="ap-image-grid" style={{ marginTop: canAdd ? 14 : 0 }}>
          {images.map((img, idx) => (
            <div key={idx} className="ap-image-thumb">
              {/* Always show the preview — blob URL while staged, ImageKit URL after upload */}
              <img
                src={img.previewUrl}
                alt={`Product image ${idx + 1}`}
                loading="lazy"
              />
              <div className="ap-image-thumb-overlay">
                <button
                  type="button"
                  className="ap-image-remove-btn"
                  onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                  aria-label={`Remove image ${idx + 1}`}
                >
                  <XIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="ap-image-count">
          {images.length} of {maxImages} images · {remaining > 0 ? `${remaining} slot${remaining !== 1 ? 's' : ''} left` : 'Maximum reached'}
        </p>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   VARIANT CARD COMPONENT
───────────────────────────────────────────────────────────────────── */
const VariantCard = ({
  variant,
  index,
  onChange,
  onRemove,
  errors = {},
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const update = (field, value) => {
    onChange(index, { ...variant, [field]: value });
  };

  const updatePrice = (field, value) => {
    onChange(index, {
      ...variant,
      price: { ...variant.price, [field]: value },
    });
  };

  const handleImagesSelected = (files) => {
    const remaining = 7 - variant.images.length;
    const toAdd = files.slice(0, remaining);

    // Immediately show local previews — no upload yet
    const staged = toAdd.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      url: null,
    }));
    onChange(index, {
      ...variant,
      images: [...variant.images, ...staged],
    });
  };

  const removeVariantImage = (imgIdx) => {
    const removed = variant.images[imgIdx];
    // Revoke blob URL to free memory
    if (removed?.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(removed.previewUrl);
    }
    const newImages = variant.images.filter((_, i) => i !== imgIdx);
    onChange(index, { ...variant, images: newImages });
  };

  const addAttribute = () => {
    onChange(index, {
      ...variant,
      attributes: [...variant.attributes, { key: '', value: '' }],
    });
  };

  const updateAttribute = (attrIdx, field, value) => {
    const attrs = variant.attributes.map((a, i) =>
      i === attrIdx ? { ...a, [field]: value } : a
    );
    onChange(index, { ...variant, attributes: attrs });
  };

  const removeAttribute = (attrIdx) => {
    onChange(index, {
      ...variant,
      attributes: variant.attributes.filter((_, i) => i !== attrIdx),
    });
  };

  const uploadedCount = variant.images.length;

  return (
    <div className="ap-variant-card" aria-label={`Variant ${index + 1}`}>
      {/* Header / toggle */}
      <div
        className="ap-variant-header"
        onClick={() => setIsOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <svg
          className={`ap-variant-chevron${isOpen ? ' is-open' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>

        <div className="ap-variant-title-wrap">
          <p className="ap-variant-name">
            {variant.name || `Variant ${index + 1}`}
          </p>
          <p className="ap-variant-meta">
            {uploadedCount} image{uploadedCount !== 1 ? 's' : ''}
            {variant.price.amount ? ` · ${variant.price.currency} ${variant.price.amount}` : ''}
            {variant.stock !== '' ? ` · Stock: ${variant.stock}` : ''}
          </p>
        </div>

        <div className="ap-variant-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="ap-btn ap-btn-sm ap-btn-danger ap-btn-icon"
            onClick={() => onRemove(index)}
            aria-label={`Delete variant ${index + 1}`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="ap-variant-body">
          {/* Basic fields */}
          <div className="ap-field">
            <label className="ap-label ap-label-required">Variant Name</label>
            <input
              className={`ap-input${errors.name ? ' is-error' : ''}`}
              placeholder="e.g. Red / XL, Navy Blue, Limited Edition…"
              value={variant.name}
              onChange={(e) => update('name', e.target.value)}
            />
            {errors.name && (
              <span className="ap-error-text"><AlertCircleIcon /> {errors.name}</span>
            )}
          </div>

          <div className="ap-field">
            <label className="ap-label">Description</label>
            <textarea
              className="ap-textarea"
              placeholder="Describe what makes this variant unique…"
              value={variant.description}
              onChange={(e) => update('description', e.target.value)}
              rows={2}
            />
          </div>

          {/* Images */}
          <div className="ap-field">
            <p className="ap-subsection-label">Images</p>
            <ImageDropzone
              images={variant.images}
              onFilesSelected={handleImagesSelected}
              onRemove={removeVariantImage}
              maxImages={7}
              compact
            />
          </div>

          {/* Price + Stock */}
          <div className="ap-field-row-3">
            <div className="ap-field">
              <label className="ap-label ap-label-required">Price</label>
              <input
                type="number"
                className={`ap-input${errors['price.amount'] ? ' is-error' : ''}`}
                placeholder="0.00"
                min="0"
                step="0.01"
                value={variant.price.amount}
                onChange={(e) => updatePrice('amount', e.target.value)}
              />
            </div>
            <div className="ap-field">
              <label className="ap-label">Currency</label>
              <select
                className="ap-select"
                value={variant.price.currency}
                onChange={(e) => updatePrice('currency', e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="ap-field">
              <label className="ap-label ap-label-required">Stock</label>
              <input
                type="number"
                className={`ap-input${errors.stock ? ' is-error' : ''}`}
                placeholder="0"
                min="0"
                value={variant.stock}
                onChange={(e) => update('stock', e.target.value)}
              />
            </div>
          </div>

          {/* Attributes */}
          <div className="ap-field">
            <p className="ap-subsection-label">Attributes</p>

            {variant.attributes.length > 0 && (
              <div className="ap-attributes-list" style={{ marginBottom: 8 }}>
                {variant.attributes.map((attr, attrIdx) => (
                  <div key={attrIdx} className="ap-attribute-row">
                    <input
                      className="ap-input"
                      placeholder="Key (e.g. Color)"
                      value={attr.key}
                      onChange={(e) => updateAttribute(attrIdx, 'key', e.target.value)}
                      aria-label={`Attribute ${attrIdx + 1} key`}
                    />
                    <input
                      className="ap-input"
                      placeholder="Value (e.g. Red)"
                      value={attr.value}
                      onChange={(e) => updateAttribute(attrIdx, 'value', e.target.value)}
                      aria-label={`Attribute ${attrIdx + 1} value`}
                    />
                    <button
                      type="button"
                      className="ap-attr-remove-btn"
                      onClick={() => removeAttribute(attrIdx)}
                      aria-label={`Remove attribute ${attrIdx + 1}`}
                    >
                      <XIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="ap-btn ap-btn-ghost ap-btn-sm"
              onClick={addAttribute}
              style={{ alignSelf: 'flex-start' }}
            >
              <PlusIcon /> Add attribute
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   CREATE EMPTY VARIANT HELPER
───────────────────────────────────────────────────────────────────── */
const createEmptyVariant = () => ({
  name: '',
  description: '',
  images: [],
  price: { amount: '', currency: 'INR' },
  stock: '',
  attributes: [],
});

/* ─────────────────────────────────────────────────────────────────────
   MAIN COMPONENT — ADD PRODUCT
───────────────────────────────────────────────────────────────────── */
const AddProduct = () => {
  const navigate = useNavigate();
  const { uploadImage, addProduct, loading, uploadingImages, error, success, reset } = useProduct();

  // Revoke all blob URLs when component unmounts to prevent memory leaks
  const revokeAllBlobUrls = useCallback((imageList) => {
    imageList.forEach((img) => {
      if (img?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });
  }, []);

  /* ── Form State ─────────────────────────────────────────────── */
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priceAmount, setPriceAmount] = useState('');
  const [priceCurrency, setPriceCurrency] = useState('INR');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState([]);    // [{ file, previewUrl, url }]
  const [variants, setVariants] = useState([]); // VariantCard[]
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /* ── Stage product-level images (local preview only, no upload yet) ── */
  const handleProductImagesSelected = (files) => {
    const remaining = 7 - images.length;
    const toAdd = files.slice(0, remaining);

    // Create blob preview URLs immediately — upload happens only on publish
    const staged = toAdd.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      url: null,
    }));
    setImages((prev) => [...prev, ...staged]);
    // Clear any previous image error when new images are added
    setFieldErrors((p) => ({ ...p, images: undefined }));
  };

  const removeProductImage = (idx) => {
    setImages((prev) => {
      // Revoke the blob URL to free memory
      if (prev[idx]?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(prev[idx].previewUrl);
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  /* ── Variant helpers ────────────────────────────────────────── */
  const addVariant = () => {
    setVariants((prev) => [...prev, createEmptyVariant()]);
  };

  const updateVariant = useCallback((idx, updated) => {
    setVariants((prev) => prev.map((v, i) => i === idx ? updated : v));
  }, []);

  const removeVariant = (idx) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ── Validation ─────────────────────────────────────────────── */
  const validate = () => {
    const errors = {};

    if (!name.trim()) errors.name = 'Product name is required.';
    else if (name.trim().length < 3) errors.name = 'Name must be at least 3 characters.';

    if (!description.trim()) errors.description = 'Description is required.';
    else if (description.trim().length < 10) errors.description = 'Description must be at least 10 characters.';

    // Images are staged (file present) or already uploaded (url present)
    if (images.length < 1) errors.images = 'At least 1 product image is required.';

    if (!priceAmount) errors.priceAmount = 'Price is required.';
    else if (parseFloat(priceAmount) <= 0) errors.priceAmount = 'Price must be a positive number.';

    if (!category) errors.category = 'Category is required.';

    if (stock === '' || stock === null) errors.stock = 'Stock is required.';
    else if (parseInt(stock, 10) < 0) errors.stock = 'Stock cannot be negative.';

    // Validate variants
    variants.forEach((v, idx) => {
      if (!v.name.trim()) {
        errors[`variant_${idx}_name`] = 'Variant name is required.';
      }
      if (!v.price.amount || parseFloat(v.price.amount) <= 0) {
        errors[`variant_${idx}_price`] = 'Valid price is required.';
      }
      if (v.stock === '' || parseInt(v.stock, 10) < 0) {
        errors[`variant_${idx}_stock`] = 'Valid stock is required.';
      }
    });

    return errors;
  };

  /* ── Submit ─────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to first error
      document.querySelector('.is-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setFieldErrors({});

    // ── Step 1: Upload all staged product images to ImageKit ──────
    let productImageUrls;
    try {
      productImageUrls = await Promise.all(
        images.map((img) =>
          img.url
            ? Promise.resolve(img.url)          // already uploaded (edge case)
            : uploadImage(img.file, 'Threadora/products')
        )
      );
    } catch {
      setFieldErrors((p) => ({ ...p, images: 'One or more images failed to upload. Please try again.' }));
      return;
    }

    // ── Step 2: Upload all staged variant images to ImageKit ──────
    let resolvedVariants;
    try {
      resolvedVariants = await Promise.all(
        variants.map(async (v) => {
          const variantImageUrls = await Promise.all(
            v.images.map((img) =>
              img.url
                ? Promise.resolve(img.url)
                : uploadImage(img.file, 'Threadora/variants')
            )
          );
          return {
            name: v.name.trim(),
            description: v.description.trim(),
            images: variantImageUrls,
            price: {
              amount: parseFloat(v.price.amount),
              currency: v.price.currency,
            },
            stock: parseInt(v.stock, 10),
            attributes: v.attributes.filter((a) => a.key.trim() && a.value.trim()),
          };
        })
      );
    } catch {
      setFieldErrors((p) => ({ ...p, images: 'One or more variant images failed to upload. Please try again.' }));
      return;
    }

    // ── Step 3: POST the product with all resolved image URLs ─────
    const productData = {
      name: name.trim(),
      description: description.trim(),
      images: productImageUrls,
      price: {
        amount: parseFloat(priceAmount),
        currency: priceCurrency,
      },
      category,
      stock: parseInt(stock, 10),
      variants: resolvedVariants,
    };

    const ok = await addProduct(productData);
    if (ok) {
      // Revoke all blob URLs now that we're done
      revokeAllBlobUrls(images);
      variants.forEach((v) => revokeAllBlobUrls(v.images));
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="ap-page">
      {/* ── Top Bar ── */}
      <div className="ap-topbar">
        <div className="ap-topbar-left">
          <Link to="/seller/dashboard" className="ap-back-btn" aria-label="Back to Seller Dashboard">
            <ArrowLeftIcon />
          </Link>

          <Link to="/" className="ap-topbar-logo" aria-label="Threadora homepage">
            <span className="ap-topbar-logo-icon"><LogoIcon /></span>
            <span className="ap-topbar-wordmark">Threadora</span>
          </Link>

          <div className="ap-breadcrumb" aria-label="Breadcrumb">
            <Link to="/seller/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Seller Dashboard</Link>
            <span className="ap-breadcrumb-sep">/</span>
            <span className="ap-breadcrumb-current">Add Product</span>
          </div>
        </div>

        <div className="ap-topbar-actions">
          <button
            type="button"
            className="ap-btn ap-btn-ghost"
            disabled
            aria-label="Save as draft (coming soon)"
          >
            Save Draft
          </button>
          <button
            type="submit"
            form="add-product-form"
            id="publish-product-btn"
            className="ap-btn ap-btn-primary"
            disabled={loading || uploadingImages}
            aria-label="Publish product"
          >
            {loading
              ? <><span className="ap-btn-spinner" aria-hidden="true" />Publishing…</>
              : uploadingImages
              ? <><span className="ap-btn-spinner" aria-hidden="true" />Uploading…</>
              : 'Publish Product'
            }
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="ap-main" id="main-content">
        <div className="ap-page-header">
          <p className="ap-page-eyebrow">Seller Dashboard</p>
          <h1 className="ap-page-title">Add New Product</h1>
          <p className="ap-page-subtitle">
            Fill in the details below to list your product on Threadora.
          </p>
        </div>

        {/* Feedback banners */}
        {error && (
          <div className="ap-global-error" role="alert" aria-live="assertive">
            <AlertCircleIcon /> {error}
          </div>
        )}
        {submitSuccess && (
          <div className="ap-global-success" role="alert" aria-live="polite">
            <CheckCircleIcon /> Product published! Redirecting to dashboard…
          </div>
        )}

        <form id="add-product-form" onSubmit={handleSubmit} noValidate>
          {/* ── Section 1: Basic Info ── */}
          <section className="ap-section" aria-labelledby="section-basics">
            <div className="ap-section-header">
              <div className="ap-section-icon"><PackageIcon /></div>
              <div>
                <h2 id="section-basics" className="ap-section-title">Basic Information</h2>
                <p className="ap-section-subtitle">Product name, description and category</p>
              </div>
            </div>
            <div className="ap-section-body">
              {/* Name */}
              <div className="ap-field">
                <label htmlFor="product-name" className="ap-label ap-label-required">
                  Product Name
                </label>
                <input
                  id="product-name"
                  className={`ap-input${fieldErrors.name ? ' is-error' : ''}`}
                  placeholder="e.g. Threads Utility Jacket"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFieldErrors((p) => ({ ...p, name: undefined }));
                  }}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  maxLength={120}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {fieldErrors.name
                    ? <span id="name-error" className="ap-error-text" role="alert"><AlertCircleIcon /> {fieldErrors.name}</span>
                    : <span />
                  }
                  <span className="ap-char-count">{name.length}/120</span>
                </div>
              </div>

              {/* Description */}
              <div className="ap-field">
                <label htmlFor="product-description" className="ap-label ap-label-required">
                  Description
                </label>
                <textarea
                  id="product-description"
                  className={`ap-textarea${fieldErrors.description ? ' is-error' : ''}`}
                  placeholder="Describe your product — materials, features, sizing, care instructions…"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setFieldErrors((p) => ({ ...p, description: undefined }));
                  }}
                  rows={4}
                  aria-required="true"
                  aria-invalid={!!fieldErrors.description}
                  aria-describedby={fieldErrors.description ? 'desc-error' : undefined}
                  maxLength={2000}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {fieldErrors.description
                    ? <span id="desc-error" className="ap-error-text" role="alert"><AlertCircleIcon /> {fieldErrors.description}</span>
                    : <span />
                  }
                  <span className="ap-char-count">{description.length}/2000</span>
                </div>
              </div>

              {/* Category */}
              <div className="ap-field" style={{ maxWidth: 320 }}>
                <label htmlFor="product-category" className="ap-label ap-label-required">
                  Category
                </label>
                <select
                  id="product-category"
                  className={`ap-select${fieldErrors.category ? ' is-error' : ''}`}
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setFieldErrors((p) => ({ ...p, category: undefined }));
                  }}
                  aria-required="true"
                >
                  <option value="" disabled>Select a category…</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {fieldErrors.category && (
                  <span className="ap-error-text" role="alert"><AlertCircleIcon /> {fieldErrors.category}</span>
                )}
              </div>
            </div>
          </section>

          {/* ── Section 2: Product Images ── */}
          <section className="ap-section" aria-labelledby="section-images" style={{ marginTop: 12 }}>
            <div className="ap-section-header">
              <div className="ap-section-icon"><ImageIcon /></div>
              <div>
                <h2 id="section-images" className="ap-section-title">Product Images</h2>
                <p className="ap-section-subtitle">Min 1 · Max 7 images. First image is the cover.</p>
              </div>
            </div>
            <div className="ap-section-body">
              <ImageDropzone
                images={images}
                onFilesSelected={handleProductImagesSelected}
                onRemove={removeProductImage}
                maxImages={7}
                error={fieldErrors.images}
              />
              {fieldErrors.images && (
                <span className="ap-error-text" role="alert"><AlertCircleIcon /> {fieldErrors.images}</span>
              )}
            </div>
          </section>

          {/* ── Section 3: Pricing & Stock ── */}
          <section className="ap-section" aria-labelledby="section-pricing" style={{ marginTop: 12 }}>
            <div className="ap-section-header">
              <div className="ap-section-icon"><TagIcon /></div>
              <div>
                <h2 id="section-pricing" className="ap-section-title">Pricing & Stock</h2>
                <p className="ap-section-subtitle">Set the base price and available inventory</p>
              </div>
            </div>
            <div className="ap-section-body">
              <div className="ap-field-row-3">
                {/* Price amount */}
                <div className="ap-field">
                  <label htmlFor="product-price" className="ap-label ap-label-required">
                    Price
                  </label>
                  <input
                    id="product-price"
                    type="number"
                    className={`ap-input${fieldErrors.priceAmount ? ' is-error' : ''}`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={priceAmount}
                    onChange={(e) => {
                      setPriceAmount(e.target.value);
                      setFieldErrors((p) => ({ ...p, priceAmount: undefined }));
                    }}
                    aria-required="true"
                  />
                  {fieldErrors.priceAmount && (
                    <span className="ap-error-text" role="alert"><AlertCircleIcon /> {fieldErrors.priceAmount}</span>
                  )}
                </div>

                {/* Currency */}
                <div className="ap-field">
                  <label htmlFor="product-currency" className="ap-label">Currency</label>
                  <select
                    id="product-currency"
                    className="ap-select"
                    value={priceCurrency}
                    onChange={(e) => setPriceCurrency(e.target.value)}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Stock */}
                <div className="ap-field">
                  <label htmlFor="product-stock" className="ap-label ap-label-required">
                    Stock
                  </label>
                  <input
                    id="product-stock"
                    type="number"
                    className={`ap-input${fieldErrors.stock ? ' is-error' : ''}`}
                    placeholder="0"
                    min="0"
                    step="1"
                    value={stock}
                    onChange={(e) => {
                      setStock(e.target.value);
                      setFieldErrors((p) => ({ ...p, stock: undefined }));
                    }}
                    aria-required="true"
                  />
                  {fieldErrors.stock && (
                    <span className="ap-error-text" role="alert"><AlertCircleIcon /> {fieldErrors.stock}</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 4: Variants ── */}
          <section className="ap-section" aria-labelledby="section-variants" style={{ marginTop: 12 }}>
            <div className="ap-section-header">
              <div className="ap-section-icon"><LayersIcon /></div>
              <div>
                <h2 id="section-variants" className="ap-section-title">Product Variants</h2>
                <p className="ap-section-subtitle">Optional — add size, color or style variants with their own pricing and inventory</p>
              </div>
            </div>
            <div className="ap-section-body">
              {variants.length > 0 && (
                <div className="ap-variants-list">
                  {variants.map((variant, idx) => (
                    <VariantCard
                      key={idx}
                      variant={variant}
                      index={idx}
                      onChange={updateVariant}
                      onRemove={removeVariant}
                      errors={{
                        name: fieldErrors[`variant_${idx}_name`],
                        'price.amount': fieldErrors[`variant_${idx}_price`],
                        stock: fieldErrors[`variant_${idx}_stock`],
                      }}
                    />
                  ))}
                </div>
              )}

              <button
                type="button"
                className="ap-add-variant-btn"
                onClick={addVariant}
                id="add-variant-btn"
                aria-label="Add a product variant"
              >
                <PlusIcon />
                Add Variant
              </button>
            </div>
          </section>

          {/* ── Form Footer ── */}
          <div className="ap-form-footer">
            <button
              type="button"
              className="ap-btn ap-btn-ghost"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ap-btn ap-btn-primary"
              disabled={loading || uploadingImages}
              aria-label="Publish product"
            >
              {loading
                ? <><span className="ap-btn-spinner" aria-hidden="true" />Publishing…</>
                : uploadingImages
                ? <><span className="ap-btn-spinner" aria-hidden="true" />Uploading images…</>
                : 'Publish Product'
              }
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
