const cron = require('node-cron');
const Application = require('../models/Application');
const ActivityLog = require('../models/ActivityLog');
const logger = require('../utils/logger');

// Status progression flow
const STATUS_FLOW = ['Applied', 'Reviewed', 'Interview', 'Offer'];

// Automated comments for each status transition
const AUTO_COMMENTS = {
  'Applied': 'Application received and queued for review',
  'Reviewed': 'Automated review completed - Profile matches job requirements',
  'Interview': 'Interview scheduled automatically - HR will contact you soon',
  'Offer': 'Congratulations! Offer letter generated automatically'
};

/**
 * Progress application to next status
 * @param {Object} application - Application document
 * @param {String} botUserId - Bot user ID
 * @returns {Object} Updated application
 */
const progressApplicationStatus = async (application, botUserId) => {
  try {
    const currentStatus = application.status;
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);

    // Check if can progress
    if (currentIndex === -1 || currentIndex >= STATUS_FLOW.length - 1) {
      logger.warn(`Application ${application._id} cannot be progressed. Current status: ${currentStatus}`);
      return null;
    }

    const nextStatus = STATUS_FLOW[currentIndex + 1];
    const oldStatus = application.status;

    // Update application
    application.status = nextStatus;
    application.updatedAt = new Date();

    // Add to status history
    application.statusHistory.push({
      status: nextStatus,
      updatedBy: botUserId,
      updatedByRole: 'botMimic',
      comment: AUTO_COMMENTS[nextStatus] || 'Automated status update',
      timestamp: new Date()
    });

    await application.save();

    // Log activity
    await ActivityLog.create({
      applicationId: application._id,
      action: 'Automated Status Update',
      performedBy: botUserId,
      performedByRole: 'botMimic',
      oldStatus,
      newStatus: nextStatus,
      comment: AUTO_COMMENTS[nextStatus] || 'Automated status update',
      metadata: {
        automated: true,
        previousStatus: oldStatus,
        workflow: 'technical-role-automation'
      }
    });

    logger.info(`Application ${application._id} progressed from ${oldStatus} to ${nextStatus}`);
    
    return application;
  } catch (error) {
    logger.error(`Error progressing application ${application._id}: ${error.message}`);
    throw error;
  }
};

/**
 * Process all technical applications for automation
 * @param {String} botUserId - Bot user ID
 */
const processAutomatedApplications = async (botUserId) => {
  try {
    logger.info('Starting automated application processing...');

    // Find all technical applications not in final status
    const applications = await Application.find({
      roleType: 'technical',
      status: { $nin: ['Offer', 'Rejected'] }
    });

    logger.info(`Found ${applications.length} technical applications to process`);

    let processedCount = 0;
    let errorCount = 0;

    for (const app of applications) {
      try {
        const updated = await progressApplicationStatus(app, botUserId);
        if (updated) {
          processedCount++;
        }
      } catch (error) {
        errorCount++;
        logger.error(`Failed to process application ${app._id}: ${error.message}`);
      }
    }

    logger.info(`Automation complete. Processed: ${processedCount}, Errors: ${errorCount}`);

    return {
      total: applications.length,
      processed: processedCount,
      errors: errorCount
    };
  } catch (error) {
    logger.error(`Error in processAutomatedApplications: ${error.message}`);
    throw error;
  }
};

/**
 * Schedule automated processing (runs every hour)
 * @param {String} botUserId - Bot user ID
 */
const scheduleAutomation = (botUserId) => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('Cron job triggered: Running scheduled automation');
    try {
      await processAutomatedApplications(botUserId);
    } catch (error) {
      logger.error(`Scheduled automation failed: ${error.message}`);
    }
  });

  logger.info('✅ Bot automation scheduled (runs every hour)');
};

/**
 * Process specific application by ID
 * @param {String} applicationId - Application ID
 * @param {String} botUserId - Bot user ID
 */
const processSpecificApplication = async (applicationId, botUserId) => {
  try {
    const application = await Application.findById(applicationId);

    if (!application) {
      throw new Error('Application not found');
    }

    if (application.roleType !== 'technical') {
      throw new Error('Only technical role applications can be automated');
    }

    return await progressApplicationStatus(application, botUserId);
  } catch (error) {
    logger.error(`Error processing application ${applicationId}: ${error.message}`);
    throw error;
  }
};

module.exports = {
  progressApplicationStatus,
  processAutomatedApplications,
  scheduleAutomation,
  processSpecificApplication,
  STATUS_FLOW,
  AUTO_COMMENTS
};
