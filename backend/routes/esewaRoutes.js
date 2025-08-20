// routes/esewaRoutes.js
const express = require("express");
const {
  generateSignature,
  verifyEsewaPayment,
} = require("../controllers/esewaController");
const router = express.Router();

router.post("/signature", generateSignature);
router.post("/verify-esewa", verifyEsewaPayment);

module.exports = router;
