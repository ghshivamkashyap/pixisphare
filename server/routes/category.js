const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, requireRole } = require('../middlewares/auth');

// POST /api/admin/categories
router.post('/categories', authenticate, requireRole('admin'), categoryController.addCategory);

// GET /api/admin/categories
router.get('/categories', authenticate, requireRole('admin'), categoryController.getCategories);

// PUT /api/admin/categories/:id
router.put('/categories/:id', authenticate, requireRole('admin'), categoryController.updateCategory);

// DELETE /api/admin/categories/:id
router.delete('/categories/:id', authenticate, requireRole('admin'), categoryController.deleteCategory);

module.exports = router;
