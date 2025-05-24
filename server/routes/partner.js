const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const portfolioController = require("../controllers/portfolioController");
const { authenticate, requireRole } = require("../middlewares/auth");

// POST /api/partner/onboard
router.post(
  "/onboard",
  authenticate,
  requireRole("partner"),
  authController.partnerOnboarding
);

// Portfolio routes for partners
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

module.exports = router;
