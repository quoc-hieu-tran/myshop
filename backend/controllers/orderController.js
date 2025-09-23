import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
// POST /api/orders  (Private)
export const addOrderItems = asyncHandler(async (req, res) => {
  res.send('Add order items');
});
// GET /api/orders/mine  (Private)
export const getMyOrders = asyncHandler(async (req, res) => {
  res.send('Get my orders');
});
// GET /api/orders/:id  (Private/Admin in this tutorial’s scaffold)
export const getOrderById = asyncHandler(async (req, res) => {
  res.send('Get order by ID');
});

// PUT /api/orders/:id/pay  (Private)
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  res.send('Update order to paid');
});
// PUT /api/orders/:id/deliver  (Private/Admin)
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send('Update order to delivered');
});
// GET /api/orders  (Private/Admin)
export const getOrders = asyncHandler(async (req, res) => {
  res.send('Get all orders');
});
