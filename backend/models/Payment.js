const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    transactionUuid: {
      type: String,
      required: true,
      unique: true,
    },
    transactionCode: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["INITIATED", "COMPLETE", "FAILED", "PENDING"],
      default: "INITIATED",
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "ESEWA",
    },
    paymentDetails: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
