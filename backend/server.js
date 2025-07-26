const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const rateLimit = require("express-rate-limit")
const passport = require("passport")
require("dotenv").config()

// Import routes
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const interviewRoutes = require("./routes/interview.routes")

// Import middleware
const { globalErrorHandler } = require("./middleware/error.middleware")
const { notFound } = require("./middleware/notFound.middleware")

// Import passport config
require("./config/passport.config")

const app = express()

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)


const allowedOrigins = [
  "https://preppal.vercel.app",
  process.env.CLIENT_URL, // Your Vercel frontend URL from .env
  "http://localhost:5173", // Your local Vite dev server
  "http://localhost:3000", // A common alternative local dev server
]

const corsOptions = {
  // 2. Use a function for the origin to check against the whitelist.
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, mobile apps, or curl)
    if (!origin) return callback(null, true)
    
    // If the request origin is in our whitelist, allow it.
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      // Otherwise, block it.
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true, // This is essential for sending cookies (JWT) across domains.
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}

app.use(cors(corsOptions))
// <<< CHANGE END >>>

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(cookieParser())

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
} else {
  app.use(morgan("combined"))
}

// Passport middleware
app.use(passport.initialize())

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "AI Interviewer API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/interview", interviewRoutes)

// 404 handler
app.use(notFound)

// Global error handler
app.use(globalErrorHandler)

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("Database connection error:", error.message)
    process.exit(1)
  }
}

// Start server
const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`)
  })

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...")
    server.close(() => {
      console.log("Process terminated")
      mongoose.connection.close()
    })
  })

  process.on("SIGINT", () => {
    console.log("SIGINT received. Shutting down gracefully...")
    server.close(() => {
      console.log("Process terminated")
      mongoose.connection.close()
    })
  })
}

startServer().catch((error) => {
  console.error("Failed to start server:", error)
  process.exit(1)
})

module.exports = app