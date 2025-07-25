const express = require("express")
const passport = require("passport")
const { body } = require("express-validator")
const { signup, login, logout, googleCallback, getMe, refreshToken } = require("../controllers/auth.controller")
const { protect } = require("../middleware/auth.middleware")

const router = express.Router()

// Validation middleware
const signupValidation = [
  body("fullName").trim().isLength({ min: 2, max: 100 }).withMessage("Full name must be between 2 and 100 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
]

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]

// Routes
router.post("/signup", signupValidation, signup)
router.post("/login", loginValidation, login)
router.post("/logout", logout)

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    session: false,
  }),
  googleCallback,
)

// Protected routes
router.get("/me", protect, getMe)
router.post("/refresh", protect, refreshToken)

module.exports = router
