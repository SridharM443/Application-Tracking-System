const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['applicant', 'admin', 'botMimic']).withMessage('Invalid role'),
  handleValidationErrors
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const createApplicationValidation = [
  body('jobPostingId')
    .notEmpty().withMessage('Job posting ID is required')
    .isMongoId().withMessage('Invalid job posting ID'),
  handleValidationErrors
];

const updateStatusValidation = [
  param('id')
    .isMongoId().withMessage('Invalid application ID'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Applied', 'Reviewed', 'Interview', 'Offer', 'Rejected'])
    .withMessage('Invalid status value'),
  body('comment')
    .notEmpty().withMessage('Comment is required for status update')
    .isLength({ min: 5, max: 500 }).withMessage('Comment must be between 5 and 500 characters'),
  handleValidationErrors
];

const addCommentValidation = [
  param('id')
    .isMongoId().withMessage('Invalid application ID'),
  body('comment')
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 5, max: 500 }).withMessage('Comment must be between 5 and 500 characters'),
  handleValidationErrors
];

const createJobPostingValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required'),
  body('description')
    .trim()
    .notEmpty().withMessage('Job description is required'),
  body('roleType')
    .notEmpty().withMessage('Role type is required')
    .isIn(['technical', 'non-technical']).withMessage('Role type invalid'),
  body('department')
    .trim()
    .notEmpty().withMessage('Department is required'),
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),
  handleValidationErrors
];

const mongoIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  createApplicationValidation,
  updateStatusValidation,
  addCommentValidation,
  createJobPostingValidation,
  mongoIdValidation,
  paginationValidation
};
