const { body, param, query } = require("express-validator")
const CONSTANTS = require("../config/constants")

// Common validation rules
const commonValidations = {
  mongoId: (field) => param(field).isMongoId().withMessage(`Invalid ${field}`),

  email: () => body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),

  password: () =>
    body("password")
      .isLength({ min: CONSTANTS.SECURITY.PASSWORD_MIN_LENGTH })
      .withMessage(`Password must be at least ${CONSTANTS.SECURITY.PASSWORD_MIN_LENGTH} characters long`)
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),

  fullName: () =>
    body("fullName")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Full name must be between 2 and 100 characters"),

  pagination: () => [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: CONSTANTS.PAGINATION.MAX_LIMIT })
      .withMessage(`Limit must be between 1 and ${CONSTANTS.PAGINATION.MAX_LIMIT}`),
  ],
}

module.exports = {
  commonValidations,
}
