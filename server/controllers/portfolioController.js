const Portfolio = require("../models/Portfolio");

// Add a portfolio item for a partner
exports.addPortfolioItem = async (req, res) => {
  try {
    const partnerId = req.user.userId;
    const { imageUrl, description, index } = req.body;
    const item = new Portfolio({
      partnerId,
      imageUrl,
      description,
      index,
    });
    await item.save();
    res.status(201).json({ portfolio: item });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all portfolio items for the logged-in partner, sorted by index
exports.getPortfolio = async (req, res) => {
  try {
    const partnerId = req.user.userId;
    const items = await Portfolio.find({ partnerId }).sort({ index: 1 });
    res.json({ portfolio: items });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Edit a portfolio item (update description and/or index)
exports.editPortfolioItem = async (req, res) => {
  try {
    const partnerId = req.user.userId;
    const { id } = req.params;
    const { description, index } = req.body;
    const item = await Portfolio.findOneAndUpdate(
      { _id: id, partnerId },
      { description, index },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }
    res.json({ portfolio: item });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a portfolio item
exports.deletePortfolioItem = async (req, res) => {
  try {
    const partnerId = req.user.userId;
    const { id } = req.params;
    const item = await Portfolio.findOneAndDelete({ _id: id, partnerId });
    if (!item) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }
    res.json({ message: "Portfolio item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
