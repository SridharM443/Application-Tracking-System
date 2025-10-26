/**
 * Middleware to check if user has required role
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Middleware to check if user owns the resource or is admin
 */
const authorizeOwnerOrAdmin = (resourceUserIdField = 'applicantId') => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.resource ? req.resource[resourceUserIdField] : null;
    
    if (resourceUserId && resourceUserId.toString() === req.user.id) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this resource'
    });
  };
};

/**
 * Check if application role type matches allowed types for the user role
 */
const checkApplicationRoleType = (req, res, next) => {
  const userRole = req.user.role;
  const application = req.application; // Assume this is set by previous middleware

  if (!application) {
    return res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  }

  // Admin can manage non-technical roles manually
  if (userRole === 'admin' && application.roleType === 'technical') {
    return res.status(403).json({
      success: false,
      message: 'Technical role applications are managed by bot automation. Use Bot Mimic role to update.'
    });
  }

  // Bot Mimic can only manage technical roles
  if (userRole === 'botMimic' && application.roleType === 'non-technical') {
    return res.status(403).json({
      success: false,
      message: 'Non-technical role applications are managed manually by admins. Bot automation not allowed.'
    });
  }

  next();
};

module.exports = {
  authorize,
  authorizeOwnerOrAdmin,
  checkApplicationRoleType
};
