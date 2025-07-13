import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs/dist/bcrypt.js";
/**
 * Secret key used for signing and verifying JWT tokens
 * In production, this should be set as an environment variable
 */
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Middleware to authenticate users based on JWT token
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next middleware or returns 401 error
 * @description Extracts the JWT token from the Authorization header,
 *              verifies its validity, and attaches the decoded user
 *              information to the request object for use in subsequent
 *              middleware or route handlers
 */
export const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user info to request object
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

/**
 * Middleware factory that creates authorization middleware for specific user types
 *
 * @param {Array<string>} allowedTypes - Array of user types allowed to access the route
 * @returns {Function} Express middleware that checks if the authenticated user's type
 *                    is included in the allowed types
 * @description Creates middleware that restricts access to routes based on user type.
 *              Must be used after the authenticateUser middleware since it depends on
 *              the req.user object being populated
 */
export const authorizeUserType = (allowedTypes) => {
  return (req, res, next) => {
    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

/**
 * Hashes a plaintext password using bcrypt
 *
 * @param {string} password - The plaintext password to hash
 * @returns {Promise<string>} A promise that resolves to the hashed password
 * @description Uses bcrypt to securely hash passwords with a salt factor of 10,
 *              which provides a good balance between security and performance.
 *              The resulting hash includes the salt and can be directly stored
 *              in the database and later used with bcrypt.compare()
 */
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Generates a JWT token for a user
 *
 * @param {Object} user - User object containing data to encode in the token
 * @param {string} userType - Type of user (client, librarian, etc.)
 * @returns {string} JWT token signed with the secret key
 * @description Creates a signed JWT token containing user information and type.
 *              The token expires in 24 hours by default.
 */
export const generateToken = (user, userType) => {
  const payload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    userType: userType,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};
