import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
// POST /api/orders  (Private)
export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  // 1 - Validate: must have items
  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }
  // 2 - Normalize orderItems:
  //    - copy fields from the frontend
  //    - attach product: x._id (the product’s ObjectId)
  //    - remove the client-side _id (we don’t store that on each line)
  const normalizedItems = orderItems.map((x) => ({
    ...x,
    product: x._id,
    _id: undefined,
  }));

  // 3 - Construct & save the order
  const order = new Order({
    orderItems: normalizedItems,
    user: req.user._id, // set by "protect middleware"
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });
  const createdOrder = await order.save();
  // 4 - Respond with 201 + created resource
  res.status(201).json(createdOrder);
});

// GET /api/orders/mine  (Private)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});
// GET /api/orders/:id  (Private in this tutorial’s scaffold)
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// PUT /api/orders/:id/pay  (Private)
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  res.send("Update order to paid");
});
// PUT /api/orders/:id/deliver  (Private/Admin)
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send("Update order to delivered");
});
// GET /api/orders  (Private/Admin)
export const getOrders = asyncHandler(async (req, res) => {
  res.send("Get all orders");
});
