const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    if (
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode
    ) {
      return res.status(400).json({ message: "Incomplete shipping details" });
    }

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "Pending",
    });

    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(400).json({ message: "Failed to place order" });
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

module.exports = { createOrder, getUserOrders, getAllOrders };
