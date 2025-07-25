const User = require("../models/user.model")
const InterviewSession = require("../models/interview-session.model")
const { AppError } = require("../utils/error.utils")

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return next(new AppError("User not found", 404))
    }

    // Get user statistics
    const stats = await InterviewSession.getUserStats(user._id)

    res.status(200).json({
      status: "success",
      data: {
        user,
        stats,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, avatar } = req.body
    const userId = req.user.id

    // Build update object
    const updateData = {}
    if (fullName) updateData.fullName = fullName
    if (avatar) updateData.avatar = avatar

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    })

    if (!user) {
      return next(new AppError("User not found", 404))
    }

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user's interview sessions
// @route   GET /api/user/sessions
// @access  Private
const getSessions = async (req, res, next) => {
  try {
    const userId = req.user.id
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const status = req.query.status
    const topic = req.query.topic
    const sortBy = req.query.sortBy || "createdAt"
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

    // Build filter object
    const filter = { userId }
    if (status) filter.status = status
    if (topic) filter.topic = { $regex: topic, $options: "i" }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder

    // Get sessions with pagination
    const sessions = await InterviewSession.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("userId", "fullName email avatar")

    // Get total count for pagination
    const totalSessions = await InterviewSession.countDocuments(filter)
    const totalPages = Math.ceil(totalSessions / limit)

    res.status(200).json({
      status: "success",
      data: {
        sessions,
        pagination: {
          currentPage: page,
          totalPages,
          totalSessions,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user dashboard data
// @route   GET /api/user/dashboard
// @access  Private
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id

    // Get user stats
    const stats = await InterviewSession.getUserStats(userId)

    // Get recent sessions (last 5)
    const recentSessions = await InterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("topic experienceLevel status createdAt completedAt feedback.overallScore")

    // Get performance trends (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const performanceTrend = await InterviewSession.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: thirtyDaysAgo },
          "feedback.overallScore": { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          averageScore: { $avg: "$feedback.overallScore" },
          sessionCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.status(200).json({
      status: "success",
      data: {
        stats,
        recentSessions,
        performanceTrend,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id

    // Delete all user's interview sessions
    await InterviewSession.deleteMany({ userId })

    // Delete user account
    await User.findByIdAndDelete(userId)

    // Clear the token cookie
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    res.status(200).json({
      status: "success",
      message: "Account deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getSessions,
  getDashboard,
  deleteAccount,
}
