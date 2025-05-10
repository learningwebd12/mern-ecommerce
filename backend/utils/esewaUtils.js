const crypto = require("crypto");

const generateEsewaSignature = ({
  total_amount,
  transaction_uuid,
  product_code,
}) => {
  const secretKey = "8gBm/:&EnhH.1/q"; // ✅ Your actual eSewa test/merchant secret key here

  const payload = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(payload)
    .digest("base64");

  return signature;
};

module.exports = { generateEsewaSignature };
