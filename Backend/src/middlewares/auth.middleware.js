import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authSeller = async (req, res, next) => {
  
    if (req.user.role !== 'seller') {
      const error = new Error('Forbidden - Only sellers can access this resource');
      error.statusCode = 403;
      throw error;
    }

    next();
};

const authMiddleware = async (req, res, next) => {
  try {
    let token, error;

    token = req.cookies.token;

    if (!token) {
      error = new Error("Unauthorized - No token provided");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      error = new Error("Unauthorized - User not found");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;