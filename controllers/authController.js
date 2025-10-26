// const User = require('../models/User');
// const { generateToken } = require('../config/jwt');
// const { asyncHandler } = require('../middleware/errorHandler');
// const emailService = require('../services/emailService');
// const logger = require('../utils/logger');

// /**
//  * @desc    Register user (Applicant, Admin, or Bot Mimic)
//  * @route   POST /api/auth/register
//  * @access  Public
//  */
// exports.register = asyncHandler(async (req, res) => {
//   const { name, email, password, role } = req.body;

//   // Check if user already exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return res.status(400).json({
//       success: false,
//       message: 'User already exists with this email'
//     });
//   }

//   // Create user
//   const user = await User.create({
//     name,
//     email,
//     password,
//     role: role || 'applicant' // Default to applicant
//   });

//   // Send welcome email (async, don't wait)
//   emailService.sendWelcomeEmail(email, name).catch(err => {
//     logger.error(`Failed to send welcome email: ${err.message}`);
//   });

//   // Generate token
//   const token = generateToken(user._id);

//   logger.info(`New user registered: ${email} with role ${user.role}`);

//   res.status(201).json({
//     success: true,
//     message: 'User registered successfully',
//     token,
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role
//     }
//   });
// });

// /**
//  * @desc    Login user
//  * @route   POST /api/auth/login
//  * @access  Public
//  */
// exports.login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   // Validate input
//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: 'Please provide email and password'
//     });
//   }

//   // Check for user (include password for comparison)
//   const user = await User.findOne({ email }).select('+password');
  
//   if (!user) {
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid credentials'
//     });
//   }

//   // Check if password matches
//   const isMatch = await user.comparePassword(password);
  
//   if (!isMatch) {
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid credentials'
//     });
//   }

//   // Generate token
//   const token = generateToken(user._id);

//   logger.info(`User logged in: ${email}`);

//   res.status(200).json({
//     success: true,
//     message: 'Login successful',
//     token,
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role
//     }
//   });
// });

// /**
//  * @desc    Get current user
//  * @route   GET /api/auth/me
//  * @access  Private
//  */
// exports.getMe = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id);

//   res.status(200).json({
//     success: true,
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role
//     }
//   });
// });



const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { asyncHandler } = require('../middleware/errorHandler');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'applicant'
  });

  emailService.sendWelcomeEmail(email, name).catch(err => {
    logger.error(`Failed to send welcome email: ${err.message}`);
  });

  const token = generateToken(user._id);

  logger.info(`New user registered: ${email} with role ${user.role}`);

  // Manually construct user object without password
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Now we can simply find user without .select()
  const user = await User.findOne({ email });
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Password will now be available
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const token = generateToken(user._id);

  logger.info(`User logged in: ${email}`);

  // toJSON() will automatically remove password
  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});



/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

