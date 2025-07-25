const InterviewSession = require("../models/interview-session.model")
const { generateQuestions, evaluateInterview } = require("../services/ai.service")
const { validationResult } = require("express-validator")
const { AppError } = require("../utils/error.utils")

// @desc    Generate interview questions
// @route   POST /api/interview/generate
// @access  Private
const generateInterview = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new AppError("Validation failed", 400, errors.array()))
    }

    const { topic, experienceLevel, difficulty, numberOfQuestions } = req.body
    const userId = req.user.id

    const startTime = Date.now()

    // Generate questions using AI service
    const questions = await generateQuestions({
      topic,
      experienceLevel,
      difficulty: difficulty || "medium",
      numberOfQuestions: numberOfQuestions || 5,
    })

    const generationTime = Date.now() - startTime

    // Create new interview session
    const interviewSession = new InterviewSession({
      userId,
      topic,
      experienceLevel,
      difficulty: difficulty || "medium",
      numberOfQuestions: numberOfQuestions || 5,
      questions: questions.map((q) => ({ question: q, answer: "", answeredAt: null })),
      status: "created",
      metadata: {
        aiModel: "gemini-2.5-flash",
        promptVersion: "1.0",
        generationTime,
      },
    })

    await interviewSession.save()

    res.status(201).json({
      status: "success",
      message: "Interview questions generated successfully",
      data: {
        sessionId: interviewSession._id,
        questions: questions,
        topic,
        experienceLevel,
        difficulty: difficulty || "medium",
        numberOfQuestions: numberOfQuestions || 5,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Submit answer to a question
// @route   POST /api/interview/submit-answer
// @access  Private
const submitAnswer = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new AppError("Validation failed", 400, errors.array()))
    }

    const { sessionId, questionIndex, answer, timeSpent } = req.body
    const userId = req.user.id

    // Find the interview session
    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId,
    })

    if (!session) {
      return next(new AppError("Interview session not found", 404))
    }

    // Validate question index
    if (questionIndex < 0 || questionIndex >= session.questions.length) {
      return next(new AppError("Invalid question index", 400))
    }

    // Check if question is already answered
    if (session.questions[questionIndex].answer && session.questions[questionIndex].answer.trim() !== "") {
      return next(new AppError("Question already answered", 400))
    }

    // Update the question with the answer
    session.questions[questionIndex].answer = answer
    session.questions[questionIndex].answeredAt = new Date()
    session.questions[questionIndex].timeSpent = timeSpent || 0

    // Update session status
    if (session.status === "created") {
      session.status = "in-progress"
      session.startedAt = new Date()
    }

    // Check if all questions are answered
    const allAnswered = session.questions.every((q) => q.answer && q.answer.trim() !== "")
    if (allAnswered) {
      session.status = "completed"
      session.completedAt = new Date()
      session.totalTimeSpent = session.questions.reduce((total, q) => total + (q.timeSpent || 0), 0)
    }

    await session.save()

    res.status(200).json({
      status: "success",
      message: "Answer submitted successfully",
      data: {
        sessionId: session._id,
        questionIndex,
        completionPercentage: session.completionPercentage,
        isCompleted: session.status === "completed",
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get interview session summary with AI evaluation
// @route   GET /api/interview/summary/:sessionId
// @access  Private
const getSessionSummary = async (req, res, next) => {
  try {
    const { sessionId } = req.params
    const userId = req.user.id

    // Find the interview session
    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId,
    }).populate("userId", "fullName email")

    if (!session) {
      return next(new AppError("Interview session not found", 404))
    }

    // Check if session is completed
    if (session.status !== "completed" && session.status !== "evaluated") {
      return next(new AppError("Interview session is not completed yet", 400))
    }

    // If already evaluated, return existing feedback
    if (session.status === "evaluated" && session.feedback) {
      return res.status(200).json({
        status: "success",
        data: {
          session,
        },
      })
    }

    // Generate AI evaluation
    const evaluation = await evaluateInterview({
      topic: session.topic,
      experienceLevel: session.experienceLevel,
      questions: session.questions.map((q) => ({
        question: q.question,
        answer: q.answer,
      })),
    })

    // Update session with feedback
    session.feedback = {
      overallScore: evaluation.overallScore,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      detailedFeedback: evaluation.detailedFeedback,
      questionFeedback: evaluation.questionFeedback,
      generatedAt: new Date(),
    }

    session.status = "evaluated"
    session.evaluatedAt = new Date()

    await session.save()

    res.status(200).json({
      status: "success",
      message: "Interview evaluation completed",
      data: {
        session,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get interview session details
// @route   GET /api/interview/session/:sessionId
// @access  Private
const getSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params
    const userId = req.user.id

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId,
    }).populate("userId", "fullName email avatar")

    if (!session) {
      return next(new AppError("Interview session not found", 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        session,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete interview session
// @route   DELETE /api/interview/session/:sessionId
// @access  Private
const deleteSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params
    const userId = req.user.id

    const session = await InterviewSession.findOneAndDelete({
      _id: sessionId,
      userId,
    })

    if (!session) {
      return next(new AppError("Interview session not found", 404))
    }

    res.status(200).json({
      status: "success",
      message: "Interview session deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get interview analytics
// @route   GET /api/interview/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id

    // Performance over time
    const performanceOverTime = await InterviewSession.aggregate([
      {
        $match: {
          userId: userId,
          status: "evaluated",
          "feedback.overallScore": { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          averageScore: { $avg: "$feedback.overallScore" },
          sessionCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Topic performance
    const topicPerformance = await InterviewSession.aggregate([
      {
        $match: {
          userId: userId,
          status: "evaluated",
          "feedback.overallScore": { $exists: true },
        },
      },
      {
        $group: {
          _id: "$topic",
          averageScore: { $avg: "$feedback.overallScore" },
          sessionCount: { $sum: 1 },
          bestScore: { $max: "$feedback.overallScore" },
          worstScore: { $min: "$feedback.overallScore" },
        },
      },
      { $sort: { averageScore: -1 } },
    ])

    // Experience level distribution
    const levelDistribution = await InterviewSession.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $group: {
          _id: "$experienceLevel",
          count: { $sum: 1 },
          averageScore: { $avg: "$feedback.overallScore" },
        },
      },
    ])

    res.status(200).json({
      status: "success",
      data: {
        performanceOverTime,
        topicPerformance,
        levelDistribution,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  generateInterview,
  submitAnswer,
  getSessionSummary,
  getSession,
  deleteSession,
  getAnalytics,
}
