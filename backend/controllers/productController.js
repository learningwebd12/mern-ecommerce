const Product = require("../models/Product");

// Create product
const createProduct = async (req, res) => {
  const { name, price, description, category, countInStock } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : ""; // Image path from multer

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      countInStock,
      image, // Save the image URL
    });

    await product.save();
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all products (with category populated)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a product by ID (with category populated)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createProduct, getProducts, getProductById };
