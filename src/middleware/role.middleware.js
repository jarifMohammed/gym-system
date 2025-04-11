// src/middleware/role.middleware.js

const User = require('../modules/auth/auth.model');  // Make sure this path is correct

const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;  // Assuming userId is set in req.user from JWT or session
      const user = await User.findById(userId);

      if (!user || user.role !== role) {
        // Send proper error message if user role is not matching
        return res.status(404).json({
          success: false,
          message: `Access denied. You must be an ${role} to perform this action.`
        });
      }

      next();  // Proceed to the next middleware/route handler
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

module.exports = checkRole;
