const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { log } = require("console");
const jwt = require("jsonwebtoken");

// Signup controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, price } = req.body;
    console.log("Signup request body:", req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      price: price ? price : null,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log("Signup error:", err);

    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Create JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ success: true, token });
  } catch (err) {
    console.log("Login error:", err);

    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Partner onboarding controller
exports.partnerOnboarding = async (req, res) => {
  try {
    const userId = req.user.userId; // req.user is set by authenticate middleware
    const { serviceDetails, documentInfo, portfolioSamples } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        serviceDetails,
        documentInfo,
        portfolioSamples,
        verificationStatus: "pending",
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all partners with pending verification
exports.getPendingPartners = async (req, res) => {
  try {
    const pendingPartners = await User.find({
      role: "partner",
      verificationStatus: "pending",
    }).select("-password");
    res.json({ users: pendingPartners });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Approve or reject a partner by ID
exports.verifyPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body; // status: 'verified' or 'rejected'
    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        verificationStatus: status,
        verificationComment: comment || "",
      },
      { new: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const [clients, partners, inquiries, pendingVerifications] =
      await Promise.all([
        User.countDocuments({ role: "client" }),
        User.countDocuments({ role: "partner" }),
        require("../models/Inquiry").countDocuments(),
        User.countDocuments({ role: "partner", verificationStatus: "pending" }),
      ]);
    res.json({
      clients,
      partners,
      inquiries,
      pendingVerifications,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all verified partners with filtering, sorting, and pagination
exports.getAllPartners = async (req, res) => {
  try {
    const {
      category,
      city,
      minPrice,
      maxPrice,
      rating,
      sortBy = "price",
      sortOrder = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {
      role: "partner",
      verificationStatus: "verified",
    };
    if (category) {
      filter.serviceDetails = { $regex: category, $options: "i" };
    }
    if (city) {
      filter.city = city;
    }
    if (minPrice || maxPrice) {
      filter["serviceDetails.price"] = {};
      if (minPrice) filter["serviceDetails.price"].$gte = Number(minPrice);
      if (maxPrice) filter["serviceDetails.price"].$lte = Number(maxPrice);
    }

    // Aggregate for rating filter and sorting
    const aggregate = [
      { $match: filter },
      // Join reviews for rating
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "partnerId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          avgRating: { $avg: "$reviews.rating" },
        },
      },
    ];
    if (rating) {
      aggregate.push({ $match: { avgRating: { $gte: Number(rating) } } });
    }
    // Sorting
    let sortField = sortBy === "rating" ? "avgRating" : "serviceDetails.price";
    let sort = {};
    sort[sortField] = sortOrder === "desc" ? -1 : 1;
    aggregate.push({ $sort: sort });
    // Pagination
    aggregate.push(
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) }
    );
    // Exclude password
    aggregate.push({ $project: { password: 0, reviews: 0 } });

    const partners = await User.aggregate(aggregate);

    res.json({ partners });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get a partner by ID, including portfolio and reviews
exports.getPartnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await User.findOne({ _id: id, role: "partner" })
      .select("-password")
      .lean();
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    // Populate portfolio
    const Portfolio = require("../models/Portfolio");
    const portfolio = await Portfolio.find({ partnerId: id }).sort({
      index: 1,
    });
    // Populate reviews
    const Review = require("../models/Review");
    const reviews = await Review.find({ partnerId: id }).sort({ date: -1 });
    // Prepare response
    res.json({
      name: partner.name,
      bio: partner.serviceDetails || "",
      price: partner.price || null,
      tags: partner.serviceDetails?.tags || [],
      styles: partner.serviceDetails?.styles || [],
      gallery: portfolio,
      reviews: reviews,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
