import { Router } from 'express';
import authMiddleware, { authSeller } from '../middlewares/auth.middleware.js';
import validateMiddleware from '../middlewares/validate.middleware.js';
import { createProductValidator } from '../validators/product.validator.js';
import {
  createProductController,
  getProductsController,
  updateProductController,
  deleteProductController,
  imagekitAuthController,
  getPublicProductsController,
  getPublicProductByIdController,
} from '../controllers/product.controller.js';


const router = Router();

/**
 * @route   GET /api/products/imagekit-auth
 * @desc    Get ImageKit authentication params for client-side upload
 * @access  Private (Seller only)
 * NOTE: Must be declared BEFORE /:id routes so Express doesn't mistake
 *       "imagekit-auth" for a dynamic :id segment.
 */
router.get(
  '/imagekit-auth',
  authMiddleware,
  authSeller,
  imagekitAuthController
);

/**
 * @route   GET /api/products/public
 * @desc    Get all products — buyer-facing, no auth required
 * NOTE: Must be before /:id so Express doesn't treat "public" as a product ID.
 */
router.get('/public', getPublicProductsController);

/**
 * @route   GET /api/products/public/:id
 * @desc    Get a single product by ID — buyer-facing, no auth required
 */
router.get('/public/:id', getPublicProductByIdController);


/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private (Seller only)
 * @body    { name, description, images: string[], price, category, stock, variants? }
 *          images are ImageKit URLs obtained via client-side upload
 * @returns { product }
 */
router.post(
  '/',
  authMiddleware,
  authSeller,
  createProductValidator,
  validateMiddleware,
  createProductController
);

/**
 * @route   GET /api/products
 * @desc    Get all products for the authenticated seller
 * @access  Private (Seller only)
 * @returns { products }
 */
router.get(
  '/',
  authMiddleware,
  authSeller,
  getProductsController
);

/**
 * @route   PATCH /api/products/:id
 * @desc    Partially update a product owned by the authenticated seller
 * @access  Private (Seller only)
 * @body    Any subset of { name, description, images, price, category, stock, variants }
 * @returns { product }
 */
router.patch(
  '/:id',
  authMiddleware,
  authSeller,
  updateProductController
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product owned by the authenticated seller
 * @access  Private (Seller only)
 * @returns { message }
 */
router.delete(
  '/:id',
  authMiddleware,
  authSeller,
  deleteProductController
);

export default router;