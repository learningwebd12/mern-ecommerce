const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
    },
    paymentMethod: {
      type: String,
      enum: ["Esewa", "CashOnDelivery", "Khalti", "Card"], // Add all valid options here
      required: true,
    },
    transaction_uuid: {
      type: String,
      required: true,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentVerified: {
      type: Boolean,
      default: false,
    },
    paymentVerifiedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
