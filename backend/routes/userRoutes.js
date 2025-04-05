const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.get("/profile", protect, getUserProfile);

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

module.exports = router;
