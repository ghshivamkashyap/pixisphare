const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const partnerRoutes = require("./routes/partner");
const adminRoutes = require("./routes/admin");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(bodyParser.json());
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api/admin", adminRoutes);

// Connect to MongoDB

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
