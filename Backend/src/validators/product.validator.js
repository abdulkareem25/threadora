import { body } from 'express-validator';

export const createProductValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3 }).withMessage('Product name must be at least 3 characters long'),

  body('description')
    .trim()
    .notEmpty().withMessage('Product description is required')
    .isLength({ min: 10 }).withMessage('Product description must be at least 10 characters long'),

  body('images')
    .isArray({ min: 1, max: 7 })
    .withMessage('Product must have between 1 and 7 image URLs'),

  body('images.*')
    .isURL().withMessage('Each image must be a valid URL'),

  body('price.amount')
    .notEmpty().withMessage('Product price is required')
    .isFloat({ gt: 0 }).withMessage('Product price must be a positive number'),

  body('price.currency')
    .notEmpty().withMessage('Product currency is required')
    .isIn(['USD', 'EUR', 'GBP', 'JPY', 'INR'])
    .withMessage('Invalid currency. Allowed: USD, EUR, GBP, JPY, INR'),

  body('category')
    .trim()
    .notEmpty().withMessage('Product category is required')
    .isLength({ min: 3 }).withMessage('Product category must be at least 3 characters'),

  body('stock')
    .notEmpty().withMessage('Product stock is required')
    .isInt({ min: 0 }).withMessage('Product stock must be a non-negative integer'),

  // Variants — optional array
  body('variants')
    .optional()
    .isArray().withMessage('Variants must be an array'),

  body('variants.*.name')
    .optional()
    .trim()
    .notEmpty().withMessage('Variant name is required')
    .isLength({ min: 1 }).withMessage('Variant name cannot be empty'),

  body('variants.*.price.amount')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Variant price must be a positive number'),

  body('variants.*.price.currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'JPY', 'INR'])
    .withMessage('Invalid variant currency'),

  body('variants.*.stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Variant stock must be a non-negative integer'),

  body('variants.*.images')
    .optional()
    .isArray({ max: 7 }).withMessage('Variant can have at most 7 images'),

  body('variants.*.images.*')
    .optional()
    .isURL().withMessage('Each variant image must be a valid URL'),
];