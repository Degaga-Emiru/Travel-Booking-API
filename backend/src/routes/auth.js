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
const { 
  validateRegistration, 
  validateLogin, 
  validateUpdatePassword,
  validateForgotPassword,
  validateVerifyOTP,
  validateResetPassword 
} = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

// Public routes
router.post('/register', authLimiter, validateRegistration, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/forgot-password', authLimiter, validateForgotPassword, forgotPassword);
router.post('/verify-otp', authLimiter, validateVerifyOTP, verifyOTP);
router.post('/resend-otp', authLimiter, validateForgotPassword, resendOTP);
router.put('/reset-password/:resetToken', authLimiter, validateResetPassword, resetPassword);

// Protected routes
router.use(protect); // All routes below this require authentication

router.get('/me', getMe);
router.put('/update-password', validateUpdatePassword, updatePassword);
router.put('/profile', updateProfile);
router.post('/logout', logout);
module.exports = router;