const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, requireRole } = require('../middlewares/auth');

/**
 * @swagger
 * /api/admin/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reviews
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/reviews', authenticate, requireRole('admin'), reviewController.getReviews);

/**
 * @swagger
 * /api/admin/reviews/{id}:
 *   put:
 *     summary: Edit a review by id
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Review updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 *   delete:
 *     summary: Delete a review by id
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Review not found
 */
router.put('/reviews/:id', authenticate, requireRole('admin'), reviewController.editReview);
router.delete('/reviews/:id', authenticate, requireRole('admin'), reviewController.deleteReview);

/**
 * @swagger
 * /api/review:
 *   post:
 *     summary: Create a review for a partner
 *     tags: [Review]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               partnerId:
 *                 type: string
 *                 description: Partner user ID
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Bad request or duplicate review
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/create',
  authenticate,
  requireRole('client'),
  reviewController.createReview
);

module.exports = router;
