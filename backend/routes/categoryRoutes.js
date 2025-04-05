const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");

// POST: Add category
router.post("/", createCategory);

// GET: Fetch all categories
router.get("/", getCategories);

module.exports = router;
