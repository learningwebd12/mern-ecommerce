const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const upload = require("./config/multerconfig"); // Import multer configuration

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Define Routes with image upload middleware
app.use("/api/cart", require("./routes/cartRoutes")); // Cart routes
app.use("/api/users", require("./routes/userRoutes"));
app.use(
  "/api/products",
  upload.single("image"),
  require("./routes/productRoutes")
); // Use multer for image upload
app.use("/api/categories", require("./routes/categoryRoutes"));

// Set static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
