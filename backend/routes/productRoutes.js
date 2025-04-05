// routes/productRoutes.js

const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");

// Ensure the route is POST /addproduct
router.post("/addproduct", createProduct);

// Other product routes (like getting all products or a specific product)
router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;
