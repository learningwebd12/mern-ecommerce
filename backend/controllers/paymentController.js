const crypto = require('crypto');

// Generate eSewa signature on the backend
const generateEsewaSignature = (amount, productId) => {
  const secretKey = "8gBm/XPpx2P7+UeucGZbzA=="; // Your eSewa merchant secret key

  const payload = `amt=${amount},txAmt=0,psc=0,pdc=0,scd=EPAYTEST,pid=${productId},su=http://localhost:3000/success,fu=http://localhost:3000/fail`;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('hex');

  return signature;
};

// Endpoint to place an order
const placeOrder = async (req, res) => {
  const { orderData, totalAmount } = req.body;

  // Generate signature
  const signature = generateEsewaSignature(totalAmount, orderData._id);

  // Return order data with signature to frontend
  res.json({
    success: true,
    message: "Order placed successfully!",
    orderId: orderData._id,
    signature,
  });
};

module.exports = { placeOrder };
