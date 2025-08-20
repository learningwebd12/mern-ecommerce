const fetch = require("node-fetch");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const { generateEsewaSignature } = require("../utils/esewaUtils");

// Generate Signature for eSewa
const generateSignature = (req, res) => {
  try {
    const { total_amount, transaction_uuid, product_code } = req.body;

    if (!total_amount || !transaction_uuid || !product_code) {
      return res.status(400).json({
        message: "Missing required fields for signature",
      });
    }

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

// Verify eSewa Payment
const verifyEsewaPayment = async (req, res) => {
  const {
    transaction_code,
    status,
    total_amount,
    transaction_uuid,
    product_code,
  } = req.body;

  console.log("Payment verification request:", req.body);

  if (
    !transaction_code ||
    !total_amount ||
    !transaction_uuid ||
    !product_code
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required payment verification fields",
    });
  }

  try {
    // Use correct eSewa verification endpoint
    const verifyUrl = `https://uat.esewa.com.np/epay/transaction-status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

    const verifyResponse = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      console.error("eSewa API error:", errorText);
      return res.status(502).json({
        success: false,
        message: "Error communicating with eSewa API",
      });
    }

    const result = await verifyResponse.json();
    console.log("eSewa verification response:", result);

    if (!result || result.status !== "COMPLETE") {
      return res.status(400).json({
        success: false,
        message: `Payment verification failed. Status: ${
          result?.status || "Unknown"
        }`,
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ transaction_uuid });
    if (existingPayment) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }

    // Save payment record
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

    // Update order
    const order = await Order.findOne({ transaction_uuid });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found for this payment",
      });
    }

    order.paymentStatus = "Paid";
    order.paymentVerified = true;
    order.paymentVerifiedAt = new Date();
    order.status = "Completed";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and order updated successfully",
    });
  } catch (error) {
    console.error("eSewa verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
};

module.exports = {
  generateSignature,
  verifyEsewaPayment,
};
