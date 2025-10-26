const express = require('express');
const router = express.Router();
const {
  createJobPosting,
  getJobPostings,
  getJobPosting,
  updateJobPosting,
  deleteJobPosting
} = require('../controllers/jobPostingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createJobPostingValidation,
  mongoIdValidation,
  paginationValidation
} = require('../utils/validators');

/**
 * @swagger
 * tags:
 *   name: Job Postings
 *   description: Job posting management
 */

/**
 * @swagger
 * /api/job-postings:
 *   post:
 *     summary: Create new job posting (Admin only)
 *     tags: [Job Postings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - roleType
 *               - department
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: Senior Software Engineer
 *               description:
 *                 type: string
 *                 example: We are looking for an experienced software engineer...
 *               roleType:
 *                 type: string
 *                 enum: [technical, non-technical]
 *                 example: technical
 *               department:
 *                 type: string
 *                 example: Engineering
 *               location:
 *                 type: string
 *                 example: Remote
 *     responses:
 *       200:
 *         description: Job posting created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Job posting created
 *                 data:
 *                   type: object
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 */
router.post('/', protect, authorize('admin'), createJobPostingValidation, createJobPosting);

/**
 * @swagger
 * /api/job-postings:
 *   get:
 *     summary: Get all job postings (Public)
 *     tags: [Job Postings]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Job postings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 jobPostings:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: integer
 *                   example: 0
 */
router.get('/', paginationValidation, getJobPostings);

/**
 * @swagger
 * /api/job-postings/{id}:
 *   get:
 *     summary: Get single job posting by ID (Public)
 *     tags: [Job Postings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job posting ID
 *         example: 670abc123def456789012345
 *     responses:
 *       200:
 *         description: Job posting retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 jobPosting:
 *                   type: object
 *       404:
 *         description: Job posting not found
 */
router.get('/:id', mongoIdValidation, getJobPosting);

/**
 * @swagger
 * /api/job-postings/{id}:
 *   put:
 *     summary: Update job posting (Admin only)
 *     tags: [Job Postings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job posting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               roleType:
 *                 type: string
 *                 enum: [technical, non-technical]
 *               department:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job posting updated successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Job posting not found
 */
router.put('/:id', protect, authorize('admin'), mongoIdValidation, updateJobPosting);

/**
 * @swagger
 * /api/job-postings/{id}:
 *   delete:
 *     summary: Delete job posting (Admin only)
 *     tags: [Job Postings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job posting ID
 *         example: 670abc123def456789012345
 *     responses:
 *       200:
 *         description: Job posting deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Job posting deleted
 *                 id:
 *                   type: string
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Job posting not found
 */
router.delete('/:id', protect, authorize('admin'), mongoIdValidation, deleteJobPosting);

module.exports = router;
