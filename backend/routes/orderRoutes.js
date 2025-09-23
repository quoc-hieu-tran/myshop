import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();
// /api/orders
router
  .route("/")
  .post(protect, addOrderItems) // create order (private)
  .get(protect, admin, getOrders); // list all (admin)
// /api/orders/mine
router.get("/mine", protect, getMyOrders);
// /api/orders/:id
router.get("/:id", protect, getOrderById); // this scaffold uses admin for by-ID
// /api/orders/:id/pay
router.put("/:id/pay", protect, updateOrderToPaid);
// /api/orders/:id/deliver
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);
export default router;
