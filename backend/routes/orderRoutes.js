const express = require("express");
const {
  createOrder,
  getUserOrders,
} = require("../controllers/orderController");
const protect = require("../middleware/authMiddleware");
const { getAllOrders } = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);
router.get("/admin", getAllOrders);

module.exports = router;
