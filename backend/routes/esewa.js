// routes/esewa.js
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

// POST /api/esewa-signature
router.post("/signature", (req, res) => {
  const { total_amount, transaction_uuid, product_code } = req.body;

  const secret = "8gBm/:&EnhH.1/q("; // Test Secret Key
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("base64");

  res.json({ signature });
});

module.exports = router;
