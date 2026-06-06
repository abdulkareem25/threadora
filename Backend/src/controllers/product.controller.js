import asyncHandler from '../utils/asyncHandler.js';
import {
  createProduct,
  getProducts
} from '../services/product.service.js';

export const createProductController = asyncHandler(async (req, res) => {

  const seller = req.user._id;

  const { name, description, images, price, category, stock } = req.body;

  const product = await createProduct({
    name,
    description,
    images,
    price,
    category,
    stock,
    seller
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product
  });
});

export const getProductsController = asyncHandler(async (req, res) => {

  const products = await getProducts(req.user._id);

  res.status(200).json({
    success: true,
    message: 'Products retrieved successfully',
    products
  });
});