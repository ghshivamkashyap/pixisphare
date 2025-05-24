const Inquiry = require("../models/Inquiry");
const User = require("../models/User");

// Create an inquiry from client and assign matching partners
exports.createInquiry = async (req, res) => {
  try {
    const { category, date, budget, city, referenceImageUrl } = req.body;
    const clientId = req.user.userId;
    // Find partners matching category in serviceDetails and city
    const partners = await User.find({
      role: "partner",
      serviceDetails: { $regex: category, $options: "i" },
      // city: city,
    }).select("_id");


    console.log('partners: ', partners);
    
    const assignedPartners = partners.map((p) => p._id);

    const inquiry = new Inquiry({
      clientId,
      category,
      date,
      budget,
      city,
      referenceImageUrl,
      assignedPartners,
    });
    await inquiry.save();
    res.status(201).json({ inquiry });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get inquiries assigned to the logged-in partner
exports.getAssignedInquiries = async (req, res) => {
  try {
    const partnerId = req.user.userId;
    const inquiries = await Inquiry.find({
      assignedPartners: partnerId,
    })
      .populate("clientId", "name email")
      .exec();
    res.json({ inquiries });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
