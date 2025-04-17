const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    const newOrder = new Order({
      userId: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      status: "Pending",
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

module.exports = { createOrder };
