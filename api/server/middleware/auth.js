import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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

export const authorizeUserType = (allowedTypes) => {
  return (req, res, next) => {
    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};
