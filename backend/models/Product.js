const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  countInStock: { type: Number, required: true }, // Ensure this is required
  image: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
