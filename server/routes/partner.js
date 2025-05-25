const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const portfolioController = require("../controllers/portfolioController");
const { authenticate, requireRole } = require("../middlewares/auth");

/**
 * @swagger
 * /api/partner/onboard:
 *   post:
 *     summary: Partner onboarding
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceDetails:
 *                 type: string
 *               documentInfo:
 *                 type: object
 *               portfolioSamples:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Partner onboarded
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/onboard",
  authenticate,
  requireRole("partner"),
  authController.partnerOnboarding
);

/**
 * @swagger
 * /api/partner/portfolio:
 *   post:
 *     summary: Add a portfolio item
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *               description:
 *                 type: string
 *               index:
 *                 type: number
 *     responses:
 *       201:
 *         description: Portfolio item added
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   get:
 *     summary: Get all portfolio items for the logged-in partner
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of portfolio items
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/portfolio",
  authenticate,
  requireRole("partner"),
  portfolioController.addPortfolioItem
);
router.get(
  "/portfolio",
  authenticate,
  requireRole("partner"),
  portfolioController.getPortfolio
);

/**
 * @swagger
 * /api/partner/portfolio/{id}:
 *   put:
 *     summary: Edit a portfolio item
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Portfolio item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               index:
 *                 type: number
 *     responses:
 *       200:
 *         description: Portfolio item updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Portfolio item not found
 *   delete:
 *     summary: Delete a portfolio item
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Portfolio item ID
 *     responses:
 *       200:
 *         description: Portfolio item deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Portfolio item not found
 */
router.put(
  "/portfolio/:id",
  authenticate,
  requireRole("partner"),
  portfolioController.editPortfolioItem
);
router.delete(
  "/portfolio/:id",
  authenticate,
  requireRole("partner"),
  portfolioController.deletePortfolioItem
);

/**
 * @swagger
 * /api/partners:
 *   get:
 *     summary: Get all partners
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of partners
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/partners",
  authenticate,
  requireRole("admin"),
  authController.getAllPartners
);

/**
 * @swagger
 * /api/partners/{id}:
 *   get:
 *     summary: Get a partner by ID (with portfolio and reviews)
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Partner user ID
 *     responses:
 *       200:
 *         description: Partner details with portfolio and reviews
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Partner not found
 */
router.get(
  "/partners/:id",
  authenticate,
  authController.getPartnerById
);

module.exports = router;
