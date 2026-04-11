const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redisClient = require('../config/redis');

// General rate limiter
const generalLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased to 20 for auth to handle login + OTP combinations better
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Payment endpoint rate limiter
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many payment attempts from this IP, please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Search endpoint rate limiter (more generous)
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    success: false,
    message: 'Too many search requests from this IP, please try again after 1 minute.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  generalLimiter,
  authLimiter,
  paymentLimiter,
  searchLimiter
};