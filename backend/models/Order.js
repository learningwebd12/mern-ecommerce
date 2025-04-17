const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // Price at the time of order
      name: { type: String, required: true }, // Name of the product
      image: { type: String }, // Optional product image URL
    },
  ],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    address: String,
    city: String,
    country: String,
    postalCode: String,
  },
  paymentMethod: {
    type: String,
    enum: ["Esewa", "CashOnDelivery"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  paymentTransactionId: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);
