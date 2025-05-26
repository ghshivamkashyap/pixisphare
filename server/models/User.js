const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "partner", "admin"],
      default: "client",
      required: true,
    },
    otp: {
      type: String,
      required: false,
    },
    serviceDetails: {
      type: String,
      required: false,
      trim: true,
    },
    price: {
      type: Number,
      required: function() { return this.role === "partner"; },
      min: 0,
    },
    documentInfo: {
      aadharNumber: {
        type: String,
        required: false,
      },
    },
    portfolioSamples: [
      {
        type: String,
        required: false,
      },
    ],
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verificationComment: {
      type: String,
      required: false,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
