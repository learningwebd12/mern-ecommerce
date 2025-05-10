const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const { verifyEsewaPayment } = require("../controllers/orderController");

router.post("/verify", verifyEsewaPayment);
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);
router.get("/admin", getAllOrders);
router.patch("/:orderId/update", protect, updateOrderStatus);

module.exports = router;
