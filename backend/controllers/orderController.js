const { v4: uuidv4 } = require("uuid");
const Order = require("../models/Order");
const { generateEsewaSignature } = require("../utils/esewaUtils");

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    // Validate shipping address
    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.email ||
      !shippingAddress?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.zipCode
    ) {
      return res.status(400).json({ message: "Incomplete shipping details" });
    }

    // ✅ Generate a UUID for transaction
    const transaction_uuid = uuidv4();

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      transaction_uuid,
      status: "Pending",
      paymentStatus: "Unpaid",
    });

    await newOrder.save();

    let signature = null;
    if (paymentMethod === "eSewa") {
      signature = generateEsewaSignature({
        total_amount: totalAmount,
        transaction_uuid,
        product_code: "EPAYTEST", // Replace with actual product code in production
      });
    }

    return res.status(201).json({
      order: newOrder,
      signature,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: "Failed to place order" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get orders" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (orderStatus) order.status = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

const verifyEsewaPayment = async (req, res) => {
  try {
    const {
      transaction_uuid,
      total_amount,
      product_code,
      transaction_code,
      status,
    } = req.body;

    // Validate required fields
    if (
      !transaction_uuid ||
      !total_amount ||
      !product_code ||
      status !== "COMPLETE"
    ) {
      return res.status(400).json({
        message: "Missing or invalid payment verification data",
      });
    }

    const order = await Order.findOne({ transaction_uuid });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Optionally match the amount to prevent fraud
    if (order.totalAmount !== Number(total_amount)) {
      return res
        .status(400)
        .json({ message: "Payment amount mismatch with order total" });
    }

    order.paymentStatus = "Paid";
    order.paymentVerified = true;
    order.paymentVerifiedAt = new Date();
    if (transaction_code) order.transaction_code = transaction_code; // Optional field

    await order.save();

    res.status(200).json({ message: "Payment verified", order });
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  verifyEsewaPayment,
};
