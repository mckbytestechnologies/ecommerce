import express from "express";
import {
  registerWarranty,
  submitInnovation,
  checkWarranty,
  getAllWarranties,
} from "../controllers/warrantyController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerWarranty);
router.post("/innovation", submitInnovation);
router.post("/check", checkWarranty);

// Admin routes
router.get("/admin/all", authenticate, authorize("admin"), getAllWarranties);

export default router;