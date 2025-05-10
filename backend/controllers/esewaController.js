// controllers/esewaController.js
const fetch = require("node-fetch");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const { generateEsewaSignature } = require("../utils/esewaUtils");

// Generate Signature Endpoint
const generateSignature = (req, res) => {
  try {
    const { total_amount, transaction_uuid, product_code } = req.body;

    const signature = generateEsewaSignature({
      total_amount,
      transaction_uuid,
      product_code,
    });

    return res.json({ signature });
  } catch (error) {
    console.error("Signature generation error:", error);
    res.status(500).json({ message: "Failed to generate signature" });
  }
};

// Verify Payment from eSewa
const verifyEsewaPayment = async (req, res) => {
  const {
    transaction_code, // also known as refId
    status,
    total_amount,
    transaction_uuid,
    product_code,
  } = req.body;

  console.log("Verification request received:", req.body);

  try {
    console.log("Verifying with:", { transaction_uuid, product_code });

    // Assuming GET request is correct for verification
    const verifyResponse = await fetch(
      `https://rc-epay.esewa.com.np/api/epay/transaction/status?transaction_uuid=${transaction_uuid}&product_code=${product_code}`,
      {
        method: "GET", // Change to GET if POST isn't supported
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      console.error("eSewa API error:", errorText);
      return res.status(500).json({
        success: false,
        message: "Error communicating with eSewa API.",
      });
    }

    const result = await verifyResponse.json();
    console.log("eSewa verification response:", result);

    // Check if the response is valid
    if (!result || typeof result !== "object") {
      console.warn("Unexpected response format from eSewa:", result);
      return res
        .status(400)
        .json({ success: false, message: "Invalid response from eSewa" });
    }

    // Verify status and handle accordingly
    if (result.status !== "COMPLETE") {
      console.error("Payment verification failed. Status:", result.status);
      return res.status(400).json({
        success: false,
        message: `Payment verification failed. Status: ${result.status}`,
      });
    }

    // Check for duplicate payment
    const existingPayment = await Payment.findOne({ transaction_uuid });
    if (existingPayment) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified and recorded.",
      });
    }

    // Save payment details
    const payment = new Payment({
      transaction_code,
      status: "Success",
      total_amount: parseFloat(total_amount),
      transaction_uuid,
      product_code,
      verified: true,
      verifiedAt: new Date(),
    });

    await payment.save();
    console.log("Payment saved:", payment);

    // Update Order status
    const order = await Order.findOne({ transaction_uuid });
    if (!order) {
      console.warn(
        "No matching order found for transaction:",
        transaction_uuid
      );
      return res.status(404).json({
        success: false,
        message: "Order not found for this payment.",
      });
    }

    order.paymentStatus = "PAID";
    order.paymentVerified = true;
    order.paymentVerifiedAt = new Date();

    await order.save();
    console.log("Order updated:", order);

    return res.status(200).json({
      success: true,
      message: "Payment verified and saved.",
    });
  } catch (error) {
    console.error("eSewa verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during verification.",
    });
  }
};

module.exports = {
  generateSignature,
  verifyEsewaPayment,
};
