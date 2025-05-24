const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const User = require("../models/User");
const { authenticate, requireRole } = require("../middlewares/auth");

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
  "/verifications",
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
  "/verify/:id",
  authenticate,
  requireRole("admin"),
  authController.verifyPartner
);

/**
 * @swagger
 * /api/admin/feature-partner/{id}:
 *   put:
 *     summary: Toggle isFeatured for a partner
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
 *               isFeatured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Partner feature status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Partner not found
 */
router.put(
  "/feature-partner/:id",
  authenticate,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { isFeatured } = req.body;
      const user = await User.findByIdAndUpdate(
        id,
        { isFeatured: !!isFeatured },
        { new: true }
      ).select("-password");
      if (!user || user.role !== "partner") {
        return res.status(404).json({ message: "Partner not found" });
      }
      res.json({ user });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

module.exports = router;
