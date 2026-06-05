import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import config from "../config/config.js";

export const signup = async ({
  fullName,
  email,
  phone,
  password,
  role
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    fullName,
    email,
    phone,
    password,
    role
  });

  const token = jwt.sign({
    id: user._id
  }, config.JWT_SECRET, {
    expiresIn: "7d"
  });

  return {
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token
  };
};

export const login = async ({ credential, password }) => {
  const user = await User.findOne({
    $or: [
      { email: credential },
      { phone: credential }
    ]
  });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  const token = jwt.sign({
    id: user._id
  }, config.JWT_SECRET, {
    expiresIn: "7d"
  });

  return {
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token
  };
};

export const google = async ({
  id,
  displayName,
  email
}) => {
  let user = await User.findOne({
    email
  })

  // remove nickname from display name
  displayName = displayName.split(' (')[0];

  if (!user) {
    user = await User.create({
      email,
      googleId: id,
      fullName: displayName,
    })
  }

  const token = jwt.sign({
    id: user._id,
  }, config.JWT_SECRET, {
    expiresIn: "7d"
  })

  return token;
};

export const getUser = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};