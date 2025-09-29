// routes/orderRoutes.js
import express from "express";
import { createOrder, getOrders } from "../controllers/orderController.js";

const router = express.Router();

// ✅ both need a handler function
router.get("/", getOrders);
router.post("/", createOrder);

export default router;
