import { Router } from 'express';
import authMiddleware, { authSeller } from '../middlewares/auth.middleware.js';
import validateMiddleware from '../middlewares/validate.middleware.js';
import { createProductValidator } from '../validators/product.validator.js';
import {
  createProductController,
  getProductsController,
  imagekitAuthController,
} from '../controllers/product.controller.js';

const router = Router();

/**
 * @route   GET /api/products/imagekit-auth
 * @desc    Get ImageKit authentication params for client-side upload
 * @access  Private (Seller only)
 */
router.get(
  '/imagekit-auth',
  authMiddleware,
  authSeller,
  imagekitAuthController
);

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

export default router;