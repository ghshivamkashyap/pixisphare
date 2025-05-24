const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, requireRole } = require('../middlewares/auth');

// POST /api/partner/onboard
router.post('/onboard', authenticate, requireRole('partner'), authController.partnerOnboarding);

module.exports = router;
