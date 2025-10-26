const express = require('express');
const router = express.Router();
const {
  triggerAutomation,
  triggerBatchAutomation,
  getTechnicalApplications,
  getAutomationLogs
} = require('../controllers/botMimicController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Bot Mimic
 *   description: Automated bot for technical role applications
 */

/**
 * @swagger
 * /api/bot/trigger/{id}:
 *   post:
 *     summary: Trigger automation for single technical application
 *     tags: [Bot Mimic]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *         example: 670abc123def456789012345
 *     responses:
 *       200:
 *         description: Automation triggered successfully
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
 *                   example: Automation triggered successfully
 *                 applicationId:
 *                   type: string
 *                   example: 670abc123def456789012345
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access forbidden (Bot Mimic role required)
 */
router.post('/trigger/:id', protect, authorize('botMimic'), triggerAutomation);

/**
 * @swagger
 * /api/bot/trigger-batch:
 *   post:
 *     summary: Trigger batch automation for multiple applications
 *     tags: [Bot Mimic]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Batch automation triggered
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
 *                   example: Batch automation triggered
 *                 processed:
 *                   type: integer
 *                   example: 0
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access forbidden
 */
router.post('/trigger-batch', protect, authorize('botMimic'), triggerBatchAutomation);

/**
 * @swagger
 * /api/bot/technical-apps:
 *   get:
 *     summary: Get all technical role applications
 *     tags: [Bot Mimic]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Technical applications retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: integer
 *                   example: 0
 *       401:
 *         description: Not authorized
 */
router.get('/technical-apps', protect, authorize('botMimic'), getTechnicalApplications);

/**
 * @swagger
 * /api/bot/logs:
 *   get:
 *     summary: Get automation activity logs
 *     tags: [Bot Mimic]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: integer
 *                   example: 0
 *       401:
 *         description: Not authorized
 */
router.get('/logs', protect, authorize('botMimic'), getAutomationLogs);

module.exports = router;
