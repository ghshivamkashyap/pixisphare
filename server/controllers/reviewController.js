const Review = require('../models/Review');

// Get all reviews (admin)
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('partnerId', 'name email')
      .populate('clientId', 'name email')
      .sort({ date: -1 });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Edit a review (admin)
exports.editReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, date } = req.body;
    const review = await Review.findByIdAndUpdate(
      id,
      { rating, comment, date },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ review });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a review (admin)
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a review (client)
exports.createReview = async (req, res) => {
  try {
    const clientId = req.user.userId;
    const { partnerId, rating, comment } = req.body;
    if (!partnerId || !rating) {
      return res.status(400).json({ message: 'partnerId and rating are required' });
    }
    // Prevent duplicate review by same client for same partner (optional)
    const existing = await Review.findOne({ partnerId, clientId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this partner' });
    }
    const review = new Review({ partnerId, clientId, rating, comment });
    await review.save();
    res.status(201).json({ review });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
