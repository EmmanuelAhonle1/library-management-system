/**
 * Validation middleware for user authentication and registration endpoints
 * Provides various validation functions for user data, types, and required fields
 */

import FormatValidator from "../../Format Validator/FormatValidator.js";

// Allowed user types for the application
const allowedUserTypes = ["client", "librarian"];

/**
 * Middleware to validate user type from URL parameters
 * Ensures only valid user types (client, librarian) are allowed
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object|void} Returns error response if invalid, otherwise calls next()
 */
export const validateUserType = (req, res, next) => {
  const { userType } = req.params;

  if (!allowedUserTypes.includes(userType)) {
    return res.status(400).json({
      error: `User type '${userType}' is not allowed.`,
    });
  }

  next();
};

/**
 * Higher-order function that creates middleware to validate required fields in request body
 * Returns a middleware function that checks for missing required fields
 *
 * @param {Array<string>} requiredFields - Array of field names that must be present in req.body
 * @returns {Function} Express middleware function
 *
 * @example
 * // Usage: router.post('/signup', validateRequiredFields(['email', 'password']), controller)
 */
export const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
    next();
  };
};

/**
 * Utility function to validate user data structure and format
 * Performs comprehensive validation of user fields including required fields and format validation
 * This is not middleware - it's a utility function that returns validation results
 *
 * @param {Object} user - User data object to validate
 * @returns {Object} Validation result object
 * @returns {boolean} returns.isValid - Whether validation passed
 * @returns {Array<string>} returns.errors - Array of validation error messages
 *
 * @example
 * const { isValid, errors } = validateUser(userData);
 * if (!isValid) {
 *   console.log('Validation errors:', errors);
 * }
 */
export const validateUser = (user) => {
  const validationErrors = [];

  // Check for required fields - validate presence before format
  if (!user.first_name) validationErrors.push("first_name is required");
  if (!user.last_name) validationErrors.push("last_name is required");
  if (!user.email) validationErrors.push("email is required");
  if (!user.password) validationErrors.push("password is required");

  // Validate field formats (only if field exists to avoid redundant errors)
  if (user.first_name && !FormatValidator.isValidName(user.first_name)) {
    validationErrors.push("Invalid first_name format");
  }
  if (user.last_name && !FormatValidator.isValidName(user.last_name)) {
    validationErrors.push("Invalid last_name format");
  }
  if (user.email && !FormatValidator.isValidEmail(user.email)) {
    validationErrors.push("Invalid email format");
  }
  // Note: Password format validation is commented out until FormatValidator.isValidPassword is implemented
  // if (user.password && !FormatValidator.isValidPassword(user.password)) {
  //   validationErrors.push("Invalid password format");
  // }

  return {
    isValid: validationErrors.length === 0,
    errors: validationErrors, // Array of validation error messages
  };
};
