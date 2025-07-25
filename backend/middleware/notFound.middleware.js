const { AppError } = require("../utils/error.utils")

const notFound = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`
  next(new AppError(message, 404))
}

module.exports = {
  notFound,
}
