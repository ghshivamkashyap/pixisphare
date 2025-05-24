const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, requireRole } = require('../middlewares/auth');

// GET /api/admin/verifications
router.get('/verifications', authenticate, requireRole('admin'), authController.getPendingPartners);

// PUT /api/admin/verify/:id
router.put('/verify/:id', authenticate, requireRole('admin'), authController.verifyPartner);

module.exports = router;
