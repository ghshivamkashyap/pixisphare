const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate, requireRole } = require("../middlewares/auth");

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */
router.post("/signup", authController.signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", authController.login);

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
  "/partner/onboard",
  authenticate,
  requireRole("partner"),
  authController.partnerOnboarding
);

/**
 * @swagger
 * /api/admin/verifications:
 *   get:
 *     summary: Get all partners with pending verification
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending partners
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/admin/verifications",
  authenticate,
  requireRole("admin"),
  authController.getPendingPartners
);

/**
 * @swagger
 * /api/admin/verify/{id}:
 *   put:
 *     summary: Approve or reject a partner by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Partner user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [verified, rejected]
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partner status updated
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.put(
  "/admin/verify/:id",
  authenticate,
  requireRole("admin"),
  authController.verifyPartner
);

module.exports = router;
