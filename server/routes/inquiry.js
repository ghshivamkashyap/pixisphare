const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { authenticate, requireRole } = require('../middlewares/auth');
const Category = require('../models/Category');
const Location = require('../models/Location');

/**
 * @swagger
 * /api/inquiry/inquiry:
 *   post:
 *     summary: Create an inquiry (client only)
 *     tags: [Inquiry]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               budget:
 *                 type: number
 *               city:
 *                 type: string
 *               referenceImageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inquiry created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/inquiry', authenticate, requireRole('client'), inquiryController.createInquiry);

/**
 * @swagger
 * /api/inquiry/partner/leads:
 *   get:
 *     summary: Get assigned inquiries for partner
 *     tags: [Inquiry]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned inquiries
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/partner/leads', authenticate, requireRole('partner'), inquiryController.getAssignedInquiries);

// GET /api/inquiry/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/locations', async (req, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 });
    res.json({ locations });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
