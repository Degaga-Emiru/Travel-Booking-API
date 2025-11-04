const express = require('express');
const {
  register,
  login,
  getMe,
  updatePassword,
  verifyOTP,
  forgotPassword,
  resendOTP,
  resetPassword,
  updateProfile,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, validateRegistration, register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/verify-otp', authLimiter, validateVerifyOTP, verifyOTP);
router.post('/resend-otp', authLimiter, validateForgotPassword, resendOTP);
router.put('/reset-password/:resetToken', authLimiter, resetPassword);
router.post('/logout', protect, logout);

module.exports = router;