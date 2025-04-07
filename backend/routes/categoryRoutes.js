// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");

router.post("/", createCategory);
router.get("/", getCategories); // Fetch all categories

module.exports = router;
