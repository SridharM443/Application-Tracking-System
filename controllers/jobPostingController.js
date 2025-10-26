const JobPosting = require('../models/JobPosting');
const Application = require('../models/Application');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * @desc    Create job posting
 * @route   POST /api/job-postings
 * @access  Private/Admin
 */
exports.createJobPosting = asyncHandler(async (req, res) => {
  const { title, description, roleType, department, location } = req.body;

  // Create the job posting in database
  const jobPosting = await JobPosting.create({
    title,
    description,
    roleType,
    department,
    location,
    createdBy: req.user.id
  });

  logger.info(`Job posting created: ${title} by admin ${req.user.id}`);

  res.status(201).json({
    success: true,
    message: 'Job posting created successfully',
    data: jobPosting
  });
});

/**
 * @desc    Get all job postings
 * @route   GET /api/job-postings
 * @access  Public
 */
exports.getJobPostings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, roleType } = req.query;

  // Build query
  const query = { isActive: true };

  
  if (roleType) {
    query.roleType = roleType;
  }

  // Fetch from database
  const jobPostings = await JobPosting.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('createdBy', 'name email');

  const count = await JobPosting.countDocuments(query);

  res.status(200).json({
    success: true,
    jobPostings,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page)
  });
});

/**
 * @desc    Get single job posting
 * @route   GET /api/job-postings/:id
 * @access  Public
 */
exports.getJobPosting = asyncHandler(async (req, res) => {
  const jobPosting = await JobPosting.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!jobPosting) {
    return res.status(404).json({
      success: false,
      message: 'Job posting not found'
    });
  }

  res.status(200).json({
    success: true,
    jobPosting
  });
});

/**
 * @desc    Update job posting
 * @route   PUT /api/job-postings/:id
 * @access  Private/Admin
 */
exports.updateJobPosting = asyncHandler(async (req, res) => {
  let jobPosting = await JobPosting.findById(req.params.id);

  if (!jobPosting) {
    return res.status(404).json({
      success: false,
      message: 'Job posting not found'
    });
  }

  // Update the job posting
  jobPosting = await JobPosting.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  logger.info(`Job posting updated: ${jobPosting.title} by admin ${req.user.id}`);

  res.status(200).json({
    success: true,
    message: 'Job posting updated successfully',
    data: jobPosting
  });
});

/**
 * @desc    Delete job posting
 * @route   DELETE /api/job-postings/:id
 * @access  Private/Admin
 */
exports.deleteJobPosting = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  // Delete related applications first
  const deleteApplicationsResult = await Application.deleteMany({ jobPostingId: jobId });
  console.log(`Deleted ${deleteApplicationsResult.deletedCount} applications for job ${jobId}`);

  // Then delete job posting itself
  const job = await JobPosting.findByIdAndDelete(jobId);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Job posting and related applications deleted'
  });
});
