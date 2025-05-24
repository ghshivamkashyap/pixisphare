const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, requireRole } = require('../middlewares/auth');

// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/partner/onboard
router.post('/partner/onboard', authenticate, requireRole('partner'), authController.partnerOnboarding);

// GET /api/admin/verifications
router.get('/admin/verifications', authenticate, requireRole('admin'), authController.getPendingPartners);

// PUT /api/admin/verify/:id
router.put('/admin/verify/:id', authenticate, requireRole('admin'), authController.verifyPartner);

module.exports = router;
