const otpGenerator = require('otp-generator');
const crypto = require('crypto');

/**
 * Generate OTP code
 */
const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  });
};

/**
 * Generate OTP with expiration (3 minutes)
 */
const generateOTPWithExpiry = () => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
  
  return {
    otp,
    expiresAt
  };
};

/**
 * Verify OTP (check if valid and not expired)
 */
const verifyOTP = (storedOTP, inputOTP, expiresAt) => {
  if (!storedOTP || !inputOTP || !expiresAt) {
    return false;
  }
  
  // Check if OTP matches
  if (storedOTP !== inputOTP) {
    return false;
  }
  
  // Check if OTP is expired
  if (new Date() > new Date(expiresAt)) {
    return false;
  }
  
  return true;
};

/**
 * Generate secure token for password reset
 */
const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = {
  generateOTP,
  generateOTPWithExpiry,
  verifyOTP,
  generateSecureToken
};