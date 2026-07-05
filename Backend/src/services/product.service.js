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

  const ALLOWED = ['name', 'description', 'images', 'price', 'category', 'stock', 'variants'];
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
