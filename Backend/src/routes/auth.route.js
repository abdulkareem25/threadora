import express from "express";
import {
  signupValidator,
  loginValidator,
  emailValidator,
  tokenValidator,
} from "../validators/auth.validator.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  signupController,
  loginController,
  getUserController,
  logoutController
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 * @access Public
 * @body { fullName, email, phone, password, role }
 */

router.post(
  "/signup",
  signupValidator,
  validateMiddleware,
  signupController
);

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { credential, password }
 */

router.post(
  "/login",
  loginValidator,
  validateMiddleware,
  loginController
);

/**
 * @route GET /api/auth/me
 * @desc Get current logged in user
 * @access Private
 * @cookies { token }
 */

router.get(
  "/me",
  authMiddleware,
  getUserController
);

/**
 * @route POST /api/auth/logout
 * @desc Logout user (handled on client side by deleting token)
 * @access Private
 * @cookies { token }
 */

  router.post(
    "/logout",
    authMiddleware,
    logoutController
  )

export default router;