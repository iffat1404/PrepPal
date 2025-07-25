const User = require("../models/user.model")
const { generateToken } = require("../utils/jwt.utils")
const { validationResult } = require("express-validator")
const { AppError } = require("../utils/error.utils")

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new AppError("Validation failed", 400, errors.array()))
    }

    const { fullName, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(new AppError("User already exists with this email", 409))
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      password,
      authProvider: "local",
    })

    await user.save()

    // Generate JWT token
    const token = generateToken(user._id)

    // Set HTTP-only cookie
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    }

    res.cookie("token", token, cookieOptions)

    // Remove password from response
    user.password = undefined

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new AppError("Validation failed", 400, errors.array()))
    }

    const { email, password } = req.body

    // Authenticate user
    const { user, reason } = await User.getAuthenticated(email, password)

    if (!user) {
      return next(new AppError(reason || "Invalid credentials", 401))
    }

    // Generate JWT token
    const token = generateToken(user._id)

    // Set HTTP-only cookie
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    }

    res.cookie("token", token, cookieOptions)

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    // Clear the token cookie
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    res.status(200).json({
      status: "success",
      message: "Logout successful",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = async (req, res, next) => {
  try {
    const user = req.user

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`)
    }

    // Generate JWT token
    const token = generateToken(user._id)

    // Set HTTP-only cookie
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    }

    res.cookie("token", token, cookieOptions)

    // Redirect to frontend dashboard
    res.redirect(`${process.env.CLIENT_URL}/dashboard?auth=success`)
  } catch (error) {
    console.error("Google OAuth callback error:", error)
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`)
  }
}

// @desc    Get current user from token
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return next(new AppError("User not found", 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
const refreshToken = async (req, res, next) => {
  try {
    const user = req.user

    // Generate new JWT token
    const token = generateToken(user._id)

    // Set HTTP-only cookie
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    }

    res.cookie("token", token, cookieOptions)

    res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
      data: {
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  signup,
  login,
  logout,
  googleCallback,
  getMe,
  refreshToken,
}
