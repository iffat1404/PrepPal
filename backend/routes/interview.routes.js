const express = require("express")
const { body, param } = require("express-validator")
const {
  generateInterview,
  submitAnswer,
  getSessionSummary,
  getSession,
  deleteSession,
  getAnalytics,
} = require("../controllers/interview.controller")
const { protect } = require("../middleware/auth.middleware")

const router = express.Router()

// All routes are protected
router.use(protect)

// Validation middleware
const generateInterviewValidation = [
  body("topic").trim().isLength({ min: 2, max: 200 }).withMessage("Topic must be between 2 and 200 characters"),
  body("experienceLevel")
    .isIn(["beginner", "intermediate", "advanced", "expert"])
    .withMessage("Experience level must be one of: beginner, intermediate, advanced, expert"),
  body("difficulty")
    .optional()
    .isIn(["easy", "medium", "hard"])
    .withMessage("Difficulty must be one of: easy, medium, hard"),
  body("numberOfQuestions")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Number of questions must be between 1 and 20"),
]

const submitAnswerValidation = [
  body("sessionId").isMongoId().withMessage("Invalid session ID"),
  body("questionIndex").isInt({ min: 0 }).withMessage("Question index must be a non-negative integer"),
  body("answer").trim().isLength({ min: 1, max: 5000 }).withMessage("Answer must be between 1 and 5000 characters"),
  body("timeSpent").optional().isInt({ min: 0 }).withMessage("Time spent must be a non-negative integer"),
]

const sessionIdValidation = [param("sessionId").isMongoId().withMessage("Invalid session ID")]

// Routes
router.post("/generate", generateInterviewValidation, generateInterview)
router.post("/submit-answer", submitAnswerValidation, submitAnswer)
router.get("/summary/:sessionId", sessionIdValidation, getSessionSummary)
router.get("/session/:sessionId", sessionIdValidation, getSession)
router.delete("/session/:sessionId", sessionIdValidation, deleteSession)
router.get("/analytics", getAnalytics)

module.exports = router
