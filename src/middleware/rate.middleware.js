const rateLimit = require("express-rate-limit");

// Apply rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 requests per minute per IP
  message: { error: "Too many requests, please slow down" }
});

module.exports = { authLimiter };
