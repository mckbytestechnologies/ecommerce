import express from "express";
import { getProducts, createProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);   // GET all products
router.post("/", createProduct); // POST new product

export default router;
