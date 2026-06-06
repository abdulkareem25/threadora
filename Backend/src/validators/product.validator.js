import { body, param } from 'express-validator';

export const createProductValidator = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3 })
    .withMessage('Product name must be at least 3 characters long'),
  body('description')
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10 })
    .withMessage('Product description must be at least 10 characters long'),
  body('images')
    .isArray()
    .withMessage('Product images must be an array of URLs')
    .isLength({ min: 1, max: 7 })
    .withMessage('Product must have between 1 and 7 images'),
  body('price.amount')
    .notEmpty()
    .withMessage('Product price is required')
    .isFloat({ gt: 0 })
    .withMessage('Product price must be a positive number'),
  body('price.currency')
    .notEmpty()
    .withMessage('Product currency is required')
    .isIn(['USD', 'EUR', 'GBP', 'JPY', 'INR'])
    .withMessage('Invalid currency. Allowed values are USD, EUR, GBP, JPY, INR'),
  body('category')
    .notEmpty()
    .withMessage('Product category is required')
    .isLength({ min: 3 })
    .withMessage('Product category must be at least 3 characters long'),
  body('stock')
    .notEmpty()
    .withMessage('Product stock is required')
    .isInt({ min: 0 })
    .withMessage('Product stock must be a non-negative integer'),
];