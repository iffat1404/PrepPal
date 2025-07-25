const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const { AppError } = require("../utils/error.utils")

// Protect routes - JWT authentication
const protect = async (req, res, next) => {
  try {
    let token

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return next(new AppError("Access denied. No token provided.", 401))
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from token
      const user = await User.findById(decoded.id).select("-password")

      if (!user) {
        return next(new AppError("User not found. Token is invalid.", 401))
      }

      // Check if user account is active
      if (!user.isActive) {
        return next(new AppError("User account is deactivated.", 401))
      }

      // Check if user account is locked
      if (user.isLocked) {
        return next(new AppError("User account is temporarily locked.", 401))
      }

      // Add user to request object
      req.user = user
      next()
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return next(new AppError("Invalid token.", 401))
      } else if (error.name === "TokenExpiredError") {
        return next(new AppError("Token expired.", 401))
      } else {
        return next(new AppError("Token verification failed.", 401))
      }
    }
  } catch (error) {
    next(error)
  }
}

// Restrict access to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Access denied. Insufficient permissions.", 403))
    }
    next()
  }
}

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    } else if (req.cookies.token) {
      token = req.cookies.token
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select("-password")

        if (user && user.isActive && !user.isLocked) {
          req.user = user
        }
      } catch (error) {
        // Silently fail for optional auth
        console.log("Optional auth failed:", error.message)
      }
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  protect,
  restrictTo,
  optionalAuth,
}
