import { Router } from 'express';
import authMiddleware, { authSeller } from '../middlewares/auth.middleware.js';
import validateMiddleware from '../middlewares/validate.middleware.js';
import {
  createProductValidator
} from '../validators/product.validator.js';
import {
  createProductController,
  getProductsController
} from '../controllers/product.controller.js';

const router = Router();

/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Private (Seller only)
 * @body { name, description, images, price, category, stock }
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
 * @route GET /api/products
 * @desc Get all products for the authenticated seller
 * @access Private (Seller only)
 * @returns { products }
 */

router.get(
  '/',
  authMiddleware,
  authSeller,
  getProductsController
);

export default router;