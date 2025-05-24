const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT and attach user to req.user
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Optionally, fetch user from DB:
    // req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware for role-based access
const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    console.log(`Access denied for user with`, role, "-", req.user.role);

    return res
      .status(403)
      .json({ message: "Access denied: insufficient permissions" });
  }
  next();
};

module.exports = { authenticate, requireRole };
