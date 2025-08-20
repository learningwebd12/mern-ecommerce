const fetch = require("node-fetch");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const { generateEsewaSignature } = require("../utils/esewaUtils");

// Generate Signature for Payment
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

// Verify eSewa Payment with Enhanced Error Handling
const verifyEsewaPayment = async (req, res) => {
  const {
    transaction_code,
    status,
    total_amount,
    transaction_uuid,
    product_code,
  } = req.body;

  console.log("Received payment verification:", req.body);

  // Validate required fields
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
    // Primary verification method - New eSewa API
    const verifyUrl = `https://uat.esewa.com.np/epay/transaction-status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

    console.log("Verifying with URL:", verifyUrl);

    const verifyResponse = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 10000, // 10 second timeout
    });

    if (!verifyResponse.ok) {
      console.error("eSewa API error:", verifyResponse.status);

      // Fallback to legacy API if new API fails
      return await verifyWithLegacyAPI(req.body, res);
    }

    const result = await verifyResponse.json();
    console.log("eSewa verification response:", result);

    if (!result || result.status !== "COMPLETE") {
      console.error("Payment verification failed:", result);
      return res.status(400).json({
        success: false,
        message: `Payment verification failed. Status: ${
          result?.status || "Unknown"
        }`,
      });
    }

    // Process successful verification
    return await processSuccessfulPayment(req.body, res);
  } catch (error) {
    console.error("Primary verification failed:", error);

    // Fallback to legacy API
    return await verifyWithLegacyAPI(req.body, res);
  }
};

// Fallback Legacy API Verification
const verifyWithLegacyAPI = async (paymentData, res) => {
  const { transaction_code, total_amount, transaction_uuid } = paymentData;

  try {
    console.log("Attempting legacy API verification...");

    const result = await fetch("https://uat.esewa.com.np/epay/transrec", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amt: total_amount,
        rid: transaction_code,
        pid: transaction_uuid,
        scd: process.env.ESEWA_PRODUCT_CODE,
      }),
      timeout: 10000,
    });

    const responseText = await result.text();
    console.log("Legacy API response:", responseText);

    const isSuccess = responseText.includes(
      "<response_code>Success</response_code>"
    );

    if (isSuccess) {
      return await processSuccessfulPayment(paymentData, res);
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed in legacy API",
        response: responseText,
      });
    }
  } catch (error) {
    console.error("Legacy API verification failed:", error);
    return res.status(500).json({
      success: false,
      message: "Both primary and legacy verification methods failed",
    });
  }
};

// Process Successful Payment
const processSuccessfulPayment = async (paymentData, res) => {
  const { transaction_code, total_amount, transaction_uuid, product_code } =
    paymentData;

  try {
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
    console.log("Payment saved:", payment._id);

    // Update corresponding order
    const order = await Order.findOne({ transaction_uuid });
    if (!order) {
      console.warn("No order found for transaction_uuid:", transaction_uuid);
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
    console.log("Order updated:", order._id);

    return res.status(200).json({
      success: true,
      message: "Payment verified and order updated successfully",
      order: {
        id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Error processing successful payment:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating payment records",
    });
  }
};

module.exports = {
  generateSignature,
  verifyEsewaPayment,
};
