const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id; // Get the userId from the authenticated user

    // Create a new order
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: "Pending", // default status
    });

    // Save order to the database
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

module.exports = { createOrder, getUserOrders };
