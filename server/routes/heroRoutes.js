import express from "express";
import {
  getAllHeroSections,
  getActiveHeroSections,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
  reorderHeroSections,
  debugHeroSections  // Add this
} from "../controllers/heroController.js";

import { authenticate, authorize } from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/active", getActiveHeroSections);
router.get("/debug", debugHeroSections);  // Debug route

// Admin Routes
router.route("/")
  .get(authenticate, authorize("admin"), getAllHeroSections)
  .post(authenticate, authorize("admin"), upload.single("backgroundImage"), createHeroSection);

router.put("/reorder", authenticate, authorize("admin"), reorderHeroSections);

router.route("/:id")
  .put(authenticate, authorize("admin"), upload.single("backgroundImage"), updateHeroSection)
  .delete(authenticate, authorize("admin"), deleteHeroSection);

export default router;