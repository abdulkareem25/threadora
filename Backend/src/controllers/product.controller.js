import asyncHandler from '../utils/asyncHandler.js';
import {
  createProduct,
  getProducts
} from '../services/product.service.js';
import { getImageKitAuthParams } from '../services/storage.service.js';

/**
 * @route   POST /api/products
 * @desc    Create a new product (images already uploaded to ImageKit by client)
 * @access  Private – Seller only
 */
export const createProductController = asyncHandler(async (req, res) => {

  const seller = req.user._id;

  const { name, description, images, price, category, stock, variants } = req.body;

  // variants arrives as a JSON string from multipart or regular JSON
  let parsedVariants = [];
  if (variants) {
    parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
  }

  const product = await createProduct({
    name,
    description,
    images,          // array of ImageKit URLs sent by the client
    price,
    category,
    stock,
    variants: parsedVariants,
    seller,
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product,
  });
});

/**
 * @route   GET /api/products
 * @desc    Get all products for the authenticated seller
 * @access  Private – Seller only
 */
export const getProductsController = asyncHandler(async (req, res) => {

  const products = await getProducts(req.user._id);

  res.status(200).json({
    success: true,
    message: 'Products retrieved successfully',
    products,
  });
});

/**
 * @route   GET /api/products/imagekit-auth
 * @desc    Return ImageKit authentication parameters for client-side upload
 * @access  Private – Seller only
 */
export const imagekitAuthController = asyncHandler(async (req, res) => {
  const params = getImageKitAuthParams();
  res.status(200).json({ success: true, ...params });
});