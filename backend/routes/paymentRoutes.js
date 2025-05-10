const express = require("express");
const router = express.Router();
const { verifyEsewaPayment } = require("../controllers/esewaController");

router.post("/verify", verifyEsewaPayment);

module.exports = router;
