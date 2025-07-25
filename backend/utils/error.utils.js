// Custom error class
class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"
    this.isOperational = true
    this.errors = errors

    Error.captureStackTrace(this, this.constructor)
  }
}

// Async error handler wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

module.exports = {
  AppError,
  catchAsync,
}
