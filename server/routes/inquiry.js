const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { authenticate, requireRole } = require('../middlewares/auth');

// POST /api/inquiry (client only)
router.post('/inquiry', authenticate, requireRole('client'), inquiryController.createInquiry);

// GET /api/partner/leads (partner only)
router.get('/partner/leads', authenticate, requireRole('partner'), inquiryController.getAssignedInquiries);

module.exports = router;
