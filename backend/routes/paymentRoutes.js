const express = require("express");
const { placeOrder } = require("../controllers/paymentController");
const router = express.Router();

router.post("/place-order", placeOrder);

module.exports = router;
