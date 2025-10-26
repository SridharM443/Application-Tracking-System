const Application = require('../models/Application');
const JobPosting = require('../models/JobPosting');
const ActivityLog = require('../models/ActivityLog');

// @desc    Create new application
// @route   POST /api/applications
// @access  Private (Applicant)
exports.createApplication = async (req, res) => {
  try {
    const { jobPostingId, resume, contactInfo } = req.body;

    // Check if job posting exists
    const jobPosting = await JobPosting.findById(jobPostingId);
    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    if (!jobPosting.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer active'
      });
    }

    // Check for duplicate application from this user
    const existingApplication = await Application.findOne({
      applicantId: req.user.id,
      jobPostingId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create application
    const application = await Application.create({
      applicantId: req.user.id,
      jobPostingId,
      roleType: jobPosting.roleType,
      resume,
      contactInfo
    });

    // Log activity
    await ActivityLog.create({
      applicationId: application._id,
      action: 'Application Created',
      performedBy: req.user.id,
      performedByRole: req.user.role,
      newStatus: 'Applied',
      comment: 'New application submitted'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
exports.getApplications = async (req, res) => {
  try {
    let query = {};

    // If user is applicant, show only their applications
    if (req.user.role === 'applicant') {
      query.applicantId = req.user.id;
    }

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by role type if provided
    if (req.query.roleType) {
      query.roleType = req.query.roleType;
    }

    const applications = await Application.find(query)
      .populate('applicantId', 'name email')
      .populate('jobPostingId', 'title department location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicantId', 'name email')
      .populate('jobPostingId')
      .populate('statusHistory.updatedBy', 'name role');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    if (req.user.role === 'applicant' && application.applicantId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get application history
// @route   GET /api/applications/:id/history
// @access  Private
exports.getApplicationHistory = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .select('statusHistory')
      .populate('statusHistory.updatedBy', 'name role');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      history: application.statusHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




