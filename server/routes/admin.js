const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');
const { authenticate, requireRole } = require('../middlewares/auth');

// GET /api/admin/verifications
router.get('/verifications', authenticate, requireRole('admin'), authController.getPendingPartners);

// PUT /api/admin/verify/:id
router.put('/verify/:id', authenticate, requireRole('admin'), authController.verifyPartner);

// PUT /api/admin/feature-partner/:id
router.put('/feature-partner/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { isFeatured: !!isFeatured },
      { new: true }
    ).select('-password');
    if (!user || user.role !== 'partner') {
      return res.status(404).json({ message: 'Partner not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
