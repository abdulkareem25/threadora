import Product from '../models/product.model.js';

export const createProduct = async ({
  name,
  description,
  images,
  price,
  category,
  stock,
  variants,
  seller,
}) => {

  const existing = await Product.findOne({ name, seller });

  if (existing) {
    const error = new Error('A product with this name already exists. Update the stock instead.');
    error.statusCode = 409;
    throw error;
  }

  const product = await Product.create({
    name,
    description,
    images,
    price,
    category,
    stock,
    variants: variants || [],
    seller,
  });

  return product;
};

export const getProducts = async (sellerId) => {

  const products = await Product.find({ seller: sellerId }).sort({ createdAt: -1 });

  return products;
};

/**
 * Partially update a product owned by the given seller.
 * Only whitelisted fields are applied so callers cannot overwrite `seller`.
 */
export const updateProduct = async (id, sellerId, data) => {

  const ALLOWED = ['name', 'description', 'images', 'price', 'category', 'colourShown', 'styleCode', 'stock', 'variants'];
  const update = {};
  ALLOWED.forEach((key) => {
    if (data[key] !== undefined) update[key] = data[key];
  });

  const product = await Product.findOneAndUpdate(
    { _id: id, seller: sellerId },
    { $set: update },
    { new: true, runValidators: true }
  );

  if (!product) {
    const error = new Error('Product not found or you do not own this product.');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

/**
 * Permanently delete a product owned by the given seller.
 */
export const deleteProduct = async (id, sellerId) => {

  const product = await Product.findOneAndDelete({ _id: id, seller: sellerId });

  if (!product) {
    const error = new Error('Product not found or you do not own this product.');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

/**
 * Fetch all products (public — no seller filter).
 * @param {{ limit?: number, skip?: number, category?: string, excludeId?: string }} opts
 */
export const getAllProducts = async ({ limit = 50, skip = 0, category, excludeId } = {}) => {
  const filter = {};
  if (category) filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
  if (excludeId) filter._id = { $ne: excludeId };

  const products = await Product
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('seller', 'fullName');

  return products;
};

/**
 * Fetch a single product by its _id (public).
 * @param {string} id
 */
export const getProductById = async (id) => {
  const product = await Product
    .findById(id)
    .populate('seller', 'fullName');

  if (!product) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  return product;
};
