const express = require("express");
const router = express.Router();
const upload = require("../config/multerconfig"); // Import multer config
const {
  createProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController"); // Import controller functions

// Route to create a product
router.post("/", upload.single("image"), createProduct); // Handle file upload before the controller

// Route to get all products
router.get("/", getProducts);

// Route to get a product by ID
router.get("/:id", getProductById);

module.exports = router; // Export the router
