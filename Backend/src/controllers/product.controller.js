import asyncHandler from '../utils/asyncHandler.js';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
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
 * @route   PATCH /api/products/:id
 * @desc    Partially update a product owned by the authenticated seller
 * @access  Private – Seller only
 */
export const updateProductController = asyncHandler(async (req, res) => {

  const product = await updateProduct(req.params.id, req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    product,
  });
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product owned by the authenticated seller
 * @access  Private – Seller only
 */
export const deleteProductController = asyncHandler(async (req, res) => {

  await deleteProduct(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
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

/**
 * @route   GET /api/products/public
 * @desc    Get all products (buyer-facing, no auth required)
 * @access  Public
 */
export const getPublicProductsController = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const skip  = parseInt(req.query.skip)  || 0;

  const products = await getAllProducts({ limit, skip });

  res.status(200).json({
    success: true,
    message: 'Products retrieved successfully',
    products,
  });
});

/**
 * @route   GET /api/products/public/:id
 * @desc    Get a single product by ID (buyer-facing, no auth required)
 * @access  Public
 */
export const getPublicProductByIdController = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Product retrieved successfully',
    product,
  });
});