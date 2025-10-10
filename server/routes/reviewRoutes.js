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

// Protected routes
router.use(authenticate);
router.get("/user/my-reviews", getMyReviews);
router.post("/", createReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);
router.put("/:id/like", toggleLikeReview);

export default router;