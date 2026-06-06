import Product from '../models/product.model.js';

export const createProduct = async ({
  name,
  description, 
  images, 
  price, 
  category, 
  stock
}) => {

  let product = await Product.findOne({ name, seller: req.user._id });

  if (product) {
    const error = new Error('Product with the same name already exists, just update the stock instead');
    error.statusCode = 409;
    throw error;
  }

  product = await Product.create({
    name,
    description,
    images,
    price,
    category,
    stock,
    seller: req.user._id
  });

  return product;
};

export const getProducts = async (sellerId) => {

  const products = await Product.find({ seller: sellerId });

  if (products.length === 0) {
    const error = new Error('No products found for this seller');
    error.statusCode = 404;
    throw error;
  }

  return products;
};
