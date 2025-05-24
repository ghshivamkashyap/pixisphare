const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, requireRole } = require('../middlewares/auth');

// GET /api/admin/reviews
router.get('/reviews', authenticate, requireRole('admin'), reviewController.getReviews);

// PUT /api/admin/reviews/:id
router.put('/reviews/:id', authenticate, requireRole('admin'), reviewController.editReview);

// DELETE /api/admin/reviews/:id
router.delete('/reviews/:id', authenticate, requireRole('admin'), reviewController.deleteReview);

module.exports = router;
