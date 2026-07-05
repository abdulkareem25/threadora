import mongoose from 'mongoose';

/* ── Attribute sub-schema ─────────────────────────────────────── */
const attributeSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
}, { _id: false });

/* ── Variant sub-schema ───────────────────────────────────────── */
const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: (arr) => arr.length <= 7,
      message: 'A variant can have at most 7 images',
    },
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'INR'],
      default: 'INR',
    },
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  attributes: {
    type: [attributeSchema],
    default: [],
  },
}, { _id: true, timestamps: false });

/* ── Product schema ───────────────────────────────────────────── */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String],
    validate: {
      validator: (arr) => arr.length >= 1 && arr.length <= 7,
      message: 'Product must have between 1 and 7 images',
    },
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'INR'],
      default: 'INR',
    },
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  variants: {
    type: [variantSchema],
    default: [],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;