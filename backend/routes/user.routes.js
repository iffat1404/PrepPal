const express = require("express")
const { body } = require("express-validator")
const {
  getProfile,
  updateProfile,
  getSessions,
  getDashboard,
  deleteAccount,
} = require("../controllers/user.controller")
const { protect } = require("../middleware/auth.middleware")

const router = express.Router()

// All routes are protected
router.use(protect)

// Validation middleware
const updateProfileValidation = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("avatar").optional().isURL().withMessage("Avatar must be a valid URL"),
]

// Routes
router.get("/profile", getProfile)
router.put("/profile", updateProfileValidation, updateProfile)
router.get("/sessions", getSessions)
router.get("/dashboard", getDashboard)
router.delete("/account", deleteAccount)

module.exports = router
