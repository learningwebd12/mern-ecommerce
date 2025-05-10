const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  transaction_code: String,
  status: String,
  total_amount: Number,
  transaction_uuid: String,
  product_code: String,
  verified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
