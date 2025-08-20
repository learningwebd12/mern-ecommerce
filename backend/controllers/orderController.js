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

    // Generate UUID for transaction
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
        product_code: process.env.ESEWA_PRODUCT_CODE,
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
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = orderStatus;
    order.paymentStatus = paymentStatus;
    order.paymentVerified = paymentStatus === "Paid";
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
