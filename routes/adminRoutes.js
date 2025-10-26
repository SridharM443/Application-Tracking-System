const express = require('express');
const router = express.Router();
const {
  updateApplicationStatus,
  addComment,
  getDashboardMetrics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  updateStatusValidation,
  addCommentValidation
} = require('../utils/validators');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/admin/applications/{id}/status:
 *   put:
 *     summary: Update application status (Non-technical roles)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - comment
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Applied, Reviewed, Interview, Offer, Rejected]
 *                 example: Reviewed
 *               comment:
 *                 type: string
 *                 example: Application reviewed and shortlisted
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized (admin only)
 */
router.put('/applications/:id/status', protect, authorize('admin'), updateStatusValidation, updateApplicationStatus);

/**
 * @swagger
 * /api/admin/applications/{id}/comment:
 *   post:
 *     summary: Add comment to application
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 example: Candidate has excellent communication skills
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       401:
 *         description: Not authorized
 */
router.post('/applications/:id/comment', protect, authorize('admin'), addCommentValidation, addComment);

/**
 * @swagger
 * /api/admin/metrics:
 *   get:
 *     summary: Get dashboard metrics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 metrics:
 *                   type: object
 *       401:
 *         description: Not authorized
 */
router.get('/metrics', protect, authorize('admin'), getDashboardMetrics);



module.exports = router;
