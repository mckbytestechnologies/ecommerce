import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

// ----------------------
// Authenticate Middleware
// ----------------------
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid token payload.",
      });
    }

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid token. User not found.",
      });
    }

    if (user.status !== "active") {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Account is inactive or suspended.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Token expired.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Invalid token.",
      });
    }

    return res.status(401).json({
      success: false,
      error: true,
      message: "Authentication failed.",
    });
  }
};

// ----------------------
// Authorize Middleware
// ----------------------
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "User not authenticated.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: true,
        message: "Access denied. You don't have permission.",
      });
    }

    next();
  };
};
