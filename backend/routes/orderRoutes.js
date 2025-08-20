const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  verifyEsewaPayment, // Ensure it's imported
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createOrder); // Create order
router.get("/my-orders", protect, getUserOrders); // Get user's orders
router.get("/admin", getAllOrders); // Get all orders (admin)
router.patch("/:orderId/update", protect, updateOrderStatus); // Update order status

module.exports = router;
