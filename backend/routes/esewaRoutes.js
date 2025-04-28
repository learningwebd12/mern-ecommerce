// routes/esewaRoutes.js
const express = require("express");
const crypto = require("crypto");

const router = express.Router();

router.post("/signature", (req, res) => {
  try {
    const { total_amount, transaction_uuid, product_code } = req.body;

    const secret_key = "8gBm/:&EnhH.1/q"; // <-- USE correct test key

    const payload = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    const signature = crypto
      .createHmac("sha256", secret_key)
      .update(payload)
      .digest("base64");

    return res.json({ signature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate signature" });
  }
});

module.exports = router;
