import express from "express";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleLikeReview,
  getMyReviews,
} from "../controllers/reviewController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/product/:productId", getProductReviews);

// Protected routes (with authenticate inside each route)
router.get("/user/my-reviews", authenticate, getMyReviews);
router.post("/", authenticate, createReview);
router.put("/:id", authenticate, updateReview);
router.delete("/:id", authenticate, deleteReview);
router.put("/:id/like", authenticate, toggleLikeReview);

// 404 handler for undefined routes
router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: true,
    message: "Route not found. Available endpoints: /product/:productId, /user/my-reviews, / (POST)"
  });
});

export default router;