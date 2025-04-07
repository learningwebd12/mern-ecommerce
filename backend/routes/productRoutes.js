const express = require("express");
const router = express.Router(); // Define the router
const {
  createProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController"); // Import controller functions

// Route to create a product
router.post("/", createProduct);

// Route to get all products
router.get("/", getProducts);

// Route to get a product by ID
router.get("/:id", getProductById);

module.exports = router; // Export the router
