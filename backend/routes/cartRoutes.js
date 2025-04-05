const express = require("express");
const router = express.Router();
const {
  addToCart,
  updateCart, // ✅ Make sure this is being imported
  getCart,
  removeFromCart,
} = require("../controllers/cartController");

const protect = require("../middleware/authMiddleware");

// POST /api/cart/add
router.post("/add", protect, addToCart);

// PUT /api/cart/update
router.put("/update", protect, updateCart); // ✅ No parentheses

// GET /api/cart
router.get("/", protect, getCart);

// DELETE /api/cart/remove
router.delete("/remove", protect, removeFromCart);

module.exports = router;
