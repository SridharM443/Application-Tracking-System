const Application = require('../models/Application');
const ActivityLog = require('../models/ActivityLog');
const { asyncHandler } = require('../middleware/errorHandler');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * @desc    Update application status manually (Non-technical only)
 * @route   PUT /api/admin/applications/:id/status
 * @access  Private (Admin only)
 */
exports.updateApplicationStatus = async (req, res) => {
  const { status, comment } = req.body;
  const applicationId = req.params.id;

  const application = await Application.findById(applicationId);
  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  application.status = status;
  application.statusHistory.push({
    status,
    updatedBy: req.user.id,
    updatedByRole: req.user.role,
    comment,
    timestamp: new Date()
  });

  await application.save();

  // Log activity
  await ActivityLog.create({
    applicationId: application._id,
    action: 'Status Updated',
    performedBy: req.user.id,
    performedByRole: req.user.role,
    newStatus: status,
    comment
  });

  logger.info(`Admin ${req.user.id} updated application ${applicationId} to ${status}`);

  res.status(200).json({
    success: true,
    message: 'Application status updated successfully',
    application
  });
};

/**
 * @desc    Add comment to application
 * @route   POST /api/admin/applications/:id/comment
 * @access  Private (Admin only)
 */
exports.addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const applicationId = req.params.id;

  logger.info(`Admin ${req.user.id} added comment to application ${applicationId}`);

  res.status(200).json({
    success: true,
    message: 'Comment added successfully',
    data: {
      applicationId,
      comment,
      addedBy: req.user.id,
      addedAt: new Date()
    }
  });
});

/**
 * @desc    Get admin dashboard metrics
 * @route   GET /api/admin/metrics
 * @access  Private (Admin only)
 */
exports.getDashboardMetrics = asyncHandler(async (req, res) => {
  logger.info(`Admin ${req.user.id} requested dashboard metrics`);

  // Total applications count
  const totalApplications = await Application.countDocuments();

  // Technical and non-technical counts
  const technicalApplications = await Application.countDocuments({ roleType: 'technical' });
  const nonTechnicalApplications = await Application.countDocuments({ roleType: 'non-technical' });

  // Status breakdown counts
  const statusList = ['Applied', 'Reviewed', 'Interview', 'Offer', 'Rejected'];
  const statusBreakdown = {};
  for (const status of statusList) {
    statusBreakdown[status] = await Application.countDocuments({ status });
  }

  // Recent activity logs - last 10 (most recent)
  const recentActivities = await ActivityLog.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('action performedBy performedByRole newStatus comment createdAt')
    .lean();

  // Format recentActivities for frontend as needed
  const formattedActivities = recentActivities.map(act => ({
    message: `${act.performedByRole} performed ${act.action} with status ${act.newStatus}. Comment: ${act.comment}`,
    time: act.createdAt
  }));

  res.status(200).json({
    success: true,
    metrics: {
      totalApplications,
      technicalApplications,
      nonTechnicalApplications,
      statusBreakdown,
      recentActivities: formattedActivities
    }
  });
});
