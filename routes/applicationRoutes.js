const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplication,
  getApplicationHistory
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createApplicationValidation,
  mongoIdValidation,
  paginationValidation
} = require('../utils/validators');

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job application management
 */

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit new job application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobPostingId
 *             properties:
 *               jobPostingId:
 *                 type: string
 *                 example: 670abc123def456789012345
 *     responses:
 *       200:
 *         description: Application submitted successfully
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, authorize('applicant'), createApplicationValidation, createApplication);

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get all applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 */
router.get('/', protect, paginationValidation, getApplications);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get single application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application retrieved
 */
router.get('/:id', protect, mongoIdValidation, getApplication);

/**
 * @swagger
 * /api/applications/{id}/history:
 *   get:
 *     summary: Get application status history
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: History retrieved
 */
router.get('/:id/history', protect, mongoIdValidation, getApplicationHistory);

// Already present sample:



module.exports = router;
