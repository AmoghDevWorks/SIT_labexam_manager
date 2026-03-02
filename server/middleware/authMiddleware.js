const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT token
 * Expects token in Authorization header: "Bearer <token>"
 */
const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
    return res.status(500).json({ message: "Token verification failed." });
  }
};

/**
 * Middleware to verify admin token
 * Checks if the decoded token has role: 'admin'
 */
const verifyAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Authorization failed." });
  }
};

/**
 * Middleware to verify internal examiner token
 * Checks if the decoded token has role: 'internal-examiner'
 */
const verifyInternalExaminer = (req, res, next) => {
  try {
    if (req.user && req.user.role === "internal-examiner") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Internal examiner privileges required." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Authorization failed." });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyInternalExaminer,
};
