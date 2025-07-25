// Application constants
const CONSTANTS = {
  // User roles
  USER_ROLES: {
    USER: "user",
    ADMIN: "admin",
  },

  // Interview session statuses
  SESSION_STATUS: {
    CREATED: "created",
    IN_PROGRESS: "in-progress",
    COMPLETED: "completed",
    EVALUATED: "evaluated",
  },

  // Experience levels
  EXPERIENCE_LEVELS: {
    BEGINNER: "beginner",
    INTERMEDIATE: "intermediate",
    ADVANCED: "advanced",
    EXPERT: "expert",
  },

  // Difficulty levels
  DIFFICULTY_LEVELS: {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard",
  },

  // Auth providers
  AUTH_PROVIDERS: {
    LOCAL: "local",
    GOOGLE: "google",
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },

  // Account security
  SECURITY: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCK_TIME: 2 * 60 * 60 * 1000, // 2 hours
    PASSWORD_MIN_LENGTH: 6,
    BCRYPT_ROUNDS: 12,
  },

  // Interview constraints
  INTERVIEW: {
    MIN_QUESTIONS: 1,
    MAX_QUESTIONS: 20,
    DEFAULT_QUESTIONS: 5,
    MAX_ANSWER_LENGTH: 5000,
    MAX_TOPIC_LENGTH: 200,
  },
}

module.exports = CONSTANTS
