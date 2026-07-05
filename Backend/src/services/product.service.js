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
