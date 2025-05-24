const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const { authenticate, requireRole } = require('../middlewares/auth');

/**
 * @swagger
 * /api/admin/locations:
 *   post:
 *     summary: Add a new location
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Location created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   get:
 *     summary: Get all locations
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of locations
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/locations', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { name } = req.body;
    const location = new Location({ name });
    await location.save();
    res.status(201).json({ location });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.get('/locations', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const locations = await Location.find().sort({ name: 1 });
    res.json({ locations });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/admin/locations/{id}:
 *   put:
 *     summary: Update a location by id
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Location ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Location updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Location not found
 *   delete:
 *     summary: Delete a location by id
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Location deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Location not found
 */
router.put('/locations/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const location = await Location.findByIdAndUpdate(id, { name }, { new: true });
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ location });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.delete('/locations/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByIdAndDelete(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
