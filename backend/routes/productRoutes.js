import express from "express";
import Product from "../models/productModel.js";
import asyncHander from "../middleware/asyncHandler.js";
import { getProducts, getProductById, createProduct } from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .get(getProducts) 
  .post(protect, admin, createProduct);

router.get("/:id", getProductById);
export default router;
