// middleware/auth.js
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
        error: true,
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid token. User not found.",
        error: true,
        success: false,
      });
    }

    if (user.status !== "active") {
      return res.status(401).json({
        message: "Account is inactive or suspended.",
        error: true,
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token.",
      error: true,
      success: false,
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
        error: true,
        success: false,
      });
    }
    next();
  };
};