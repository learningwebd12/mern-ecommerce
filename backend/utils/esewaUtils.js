const crypto = require("crypto");

const generateEsewaSignature = ({
  total_amount,
  transaction_uuid,
  product_code,
}) => {
  const secretKey = process.env.ESEWA_SECRET_KEY;

  const payload = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(payload)
    .digest("base64");

  return signature;
};

module.exports = { generateEsewaSignature };
