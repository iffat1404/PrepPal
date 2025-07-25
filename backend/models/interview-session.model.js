const mongoose = require("mongoose")

const questionAnswerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      default: "",
      trim: true,
    },
    answeredAt: {
      type: Date,
      default: null,
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0,
    },
  },
  { _id: false },
)

const feedbackSchema = new mongoose.Schema(
  {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    strengths: [
      {
        type: String,
        trim: true,
      },
    ],
    improvements: [
      {
        type: String,
        trim: true,
      },
    ],
    detailedFeedback: {
      type: String,
      trim: true,
      default: "",
    },
    questionFeedback: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },
        score: {
          type: Number,
          min: 0,
          max: 10,
          required: true,
        },
        feedback: {
          type: String,
          trim: true,
          required: true,
        },
      },
    ],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
)

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: [true, "Interview topic is required"],
      trim: true,
      maxlength: [200, "Topic cannot exceed 200 characters"],
    },
    experienceLevel: {
      type: String,
      required: [true, "Experience level is required"],
      enum: ["beginner", "intermediate", "advanced", "expert"],
      lowercase: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
      lowercase: true,
    },
    numberOfQuestions: {
      type: Number,
      required: true,
      min: [1, "Must have at least 1 question"],
      max: [20, "Cannot exceed 20 questions"],
      default: 5,
    },
    questions: [questionAnswerSchema],
    status: {
      type: String,
      enum: ["created", "in-progress", "completed", "evaluated"],
      default: "created",
    },
    feedback: feedbackSchema,
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    evaluatedAt: {
      type: Date,
      default: null,
    },
    totalTimeSpent: {
      type: Number, // in seconds
      default: 0,
    },
    metadata: {
      aiModel: {
        type: String,
        default: "gemini-pro",
      },
      promptVersion: {
        type: String,
        default: "1.0",
      },
      generationTime: {
        type: Number, // in milliseconds
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v
        return ret
      },
    },
  },
)

// Indexes
interviewSessionSchema.index({ userId: 1, createdAt: -1 })
interviewSessionSchema.index({ status: 1 })
interviewSessionSchema.index({ topic: 1 })
interviewSessionSchema.index({ experienceLevel: 1 })

// Virtual for completion percentage
interviewSessionSchema.virtual("completionPercentage").get(function () {
  if (this.questions.length === 0) return 0
  const answeredQuestions = this.questions.filter((q) => q.answer && q.answer.trim() !== "").length
  return Math.round((answeredQuestions / this.questions.length) * 100)
})

// Virtual for average question score
interviewSessionSchema.virtual("averageScore").get(function () {
  if (!this.feedback || !this.feedback.questionFeedback || this.feedback.questionFeedback.length === 0) {
    return null
  }

  const totalScore = this.feedback.questionFeedback.reduce((sum, qf) => sum + qf.score, 0)
  return Math.round((totalScore / this.feedback.questionFeedback.length) * 10) / 10 // Round to 1 decimal
})

// Instance method to mark question as answered
interviewSessionSchema.methods.answerQuestion = function (questionIndex, answer) {
  if (questionIndex < 0 || questionIndex >= this.questions.length) {
    throw new Error("Invalid question index")
  }

  this.questions[questionIndex].answer = answer
  this.questions[questionIndex].answeredAt = new Date()

  // Update status if this was the first answer
  if (this.status === "created") {
    this.status = "in-progress"
    this.startedAt = new Date()
  }

  // Check if all questions are answered
  const allAnswered = this.questions.every((q) => q.answer && q.answer.trim() !== "")
  if (allAnswered && this.status === "in-progress") {
    this.status = "completed"
    this.completedAt = new Date()
  }

  return this.save()
}

// Instance method to calculate total time spent
interviewSessionSchema.methods.calculateTotalTime = function () {
  this.totalTimeSpent = this.questions.reduce((total, q) => total + (q.timeSpent || 0), 0)
  return this.totalTimeSpent
}

// Static method to get user statistics
interviewSessionSchema.statics.getUserStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        completedSessions: {
          $sum: { $cond: [{ $in: ["$status", ["completed", "evaluated"]] }, 1, 0] },
        },
        averageScore: {
          $avg: "$feedback.overallScore",
        },
        totalTimeSpent: { $sum: "$totalTimeSpent" },
        topicDistribution: { $push: "$topic" },
        levelDistribution: { $push: "$experienceLevel" },
      },
    },
  ])

  return (
    stats[0] || {
      totalSessions: 0,
      completedSessions: 0,
      averageScore: null,
      totalTimeSpent: 0,
      topicDistribution: [],
      levelDistribution: [],
    }
  )
}

module.exports = mongoose.model("InterviewSession", interviewSessionSchema)
