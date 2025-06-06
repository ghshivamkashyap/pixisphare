const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const partnerRoutes = require("./routes/partner");
const adminRoutes = require("./routes/admin");
const inquiryRoutes = require("./routes/inquiry");
const categoryRoutes = require("./routes/category");
const locationRoutes = require("./routes/location");
const reviewRoutes = require("./routes/review");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

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
app.use("/api/inquiry", inquiryRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/admin/locations", locationRoutes);
app.use("/api/reviews", reviewRoutes);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pixisphere API",
      version: "1.0.0",
      description: "API documentation for Pixisphere platform",
    },
    servers: [{ url: "http://localhost:" + (process.env.PORT || 5000) }],
  },
  apis: ["./routes/*.js", "./models/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
