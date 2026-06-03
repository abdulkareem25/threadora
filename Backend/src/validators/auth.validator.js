import e from "express";
import { body, query } from "express-validator";

export const signupValidator = [
  body("fullName")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits")
    .isNumeric()
    .withMessage("Phone number must contain only digits"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("role")
    .optional()
    .isIn(["buyer", "seller"])
    .withMessage("Role must be either 'buyer' or 'seller'"),
];

export const loginValidator = [
  body("credential")
    .notEmpty()
    .withMessage("Email or phone number is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const tokenValidator = [
  query("token")
    .notEmpty()
    .withMessage("Verification token is required")
];

export const emailValidator = [
  body("email")
    .notEmpty()
    .withMessage("Verification email is required")
];