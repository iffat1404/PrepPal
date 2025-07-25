const jwt = require("jsonwebtoken")

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  })
}

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

// Decode JWT token without verification
const decodeToken = (token) => {
  return jwt.decode(token)
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
}
