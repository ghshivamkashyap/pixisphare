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
