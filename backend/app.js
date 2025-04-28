const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());
// Set static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// Define Routes

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes")); // Remove the upload middleware from here
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/esewa", require("./routes/esewaRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
