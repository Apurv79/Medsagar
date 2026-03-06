const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests"
});

module.exports = rateLimiter;