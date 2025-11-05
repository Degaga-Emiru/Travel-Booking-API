const jwt = require('jsonwebtoken');
const { User, PasswordReset } = require('../models');
const { 
  sendWelcomeEmail, 
  sendPasswordResetOTP, 
  sendPasswordUpdated, 
  sendPasswordResetSuccess 
} = require('../utils/emailService');
const { generateOTPWithExpiry, verifyOTP } = require('../utils/otpGenerator');
const { Op } = require('sequelize');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user
    }
  });
};

// Helper function to mask email for security
const maskEmail = (email) => {
  const [name, domain] = email.split('@');
  const maskedName = name.length > 2 
    ? name.substring(0, 2) + '*'.repeat(name.length - 2)
    : name.charAt(0) + '*';
  return `${maskedName}@${domain}`;
};

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: 'customer'
    });

    // Send welcome email
    await sendWelcomeEmail(user);

    createSendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};

// 🔑 ENHANCED UPDATE PASSWORD
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Get user with password
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    if (!(await user.correctPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Check if new password is same as current
    if (await user.correctPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'New password cannot be the same as current password'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send password updated email notification
    await sendPasswordUpdated(user);

    // Return new token
    createSendToken(user, 200, res);

  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, address, dateOfBirth, preferences } = req.body;
    
    const user = await User.findByPk(req.user.id);
    
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
      address: address || user.address,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
      preferences: preferences ? { ...user.preferences, ...preferences } : user.preferences
    });

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// 🔑 ENHANCED FORGOT PASSWORD WITH OTP
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase().trim(),
        isActive: true 
      } 
    });
    
    // For security, don't reveal if email exists or not
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If the email exists in our system, an OTP has been sent'
      });
    }

    // Cleanup expired OTPs first
    await PasswordReset.destroy({
      where: {
        [Op.or]: [
          { expiresAt: { [Op.lt]: new Date() } },
          { isUsed: true }
        ]
      }
    });

    // Generate new OTP
    const { otp, expiresAt } = generateOTPWithExpiry();

    // Delete any existing unused OTPs for this email
    await PasswordReset.destroy({
      where: { 
        email,
        isUsed: false 
      }
    });

    // Create new OTP record
    await PasswordReset.create({
      email: user.email,
      otp,
      expiresAt,
      isUsed: false,
      attempts: 0
    });

    // Send OTP email
    try {
      await sendPasswordResetOTP(user, otp);
      
      res.status(200).json({
        success: true,
        message: 'OTP sent to your email address',
        data: {
          email: maskEmail(user.email), // Mask email for security
          expiresIn: '3 minutes',
          otpLength: 6
        }
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    next(error);
  }
};

// ✅ VERIFY OTP ROUTE
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find the latest valid OTP for this email
    const passwordReset = await PasswordReset.findOne({
      where: { 
        email: email.toLowerCase().trim(),
        isUsed: false,
        expiresAt: { [Op.gt]: new Date() }
      },
      order: [['createdAt', 'DESC']]
    });

    if (!passwordReset) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.'
      });
    }

    // Check attempt limits
    if (passwordReset.attempts >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (passwordReset.otp !== otp) {
      // Increment attempts
      await passwordReset.increment('attempts');
      
      const remainingAttempts = 3 - (passwordReset.attempts + 1);
      const message = remainingAttempts > 0 
        ? `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`
        : 'Too many failed attempts. OTP has been invalidated.';

      if (remainingAttempts <= 0) {
        await passwordReset.update({ isUsed: true });
      }

      return res.status(400).json({
        success: false,
        message
      });
    }

    // Mark OTP as used
    await passwordReset.update({ 
      isUsed: true,
      attempts: passwordReset.attempts + 1
    });

    // Generate reset token (valid for 10 minutes)
    const resetToken = jwt.sign(
      { 
        email: passwordReset.email,
        type: 'password_reset',
        purpose: 'password_reset'
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '10m' }
    );

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        resetToken,
        expiresIn: '10 minutes'
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    next(error);
  }
};

// 🔄 RESEND OTP ROUTE
exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase().trim(),
        isActive: true 
      } 
    });
    
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If the email exists in our system, a new OTP has been sent'
      });
    }

    // Cleanup expired OTPs
    await PasswordReset.destroy({
      where: {
        [Op.or]: [
          { expiresAt: { [Op.lt]: new Date() } },
          { isUsed: true }
        ]
      }
    });

    // Generate new OTP
    const { otp, expiresAt } = generateOTPWithExpiry();

    // Delete any existing OTPs for this email
    await PasswordReset.destroy({
      where: { email: user.email }
    });

    // Create new OTP record
    await PasswordReset.create({
      email: user.email,
      otp,
      expiresAt,
      isUsed: false,
      attempts: 0
    });

    // Send new OTP email
    try {
      await sendPasswordResetOTP(user, otp);

      res.status(200).json({
        success: true,
        message: 'New OTP sent to your email address',
        data: {
          email: maskEmail(user.email),
          expiresIn: '3 minutes',
          otpLength: 6
        }
      });
    } catch (emailError) {
      console.error('Resend OTP email failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again.'
      });
    }

  } catch (error) {
    console.error('Resend OTP error:', error);
    next(error);
  }
};

// 🔑 ENHANCED RESET PASSWORD WITH TOKEN VERIFICATION
exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Verify token type and purpose
    if (decoded.type !== 'password_reset' || decoded.purpose !== 'password_reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      });
    }

    const user = await User.findOne({ 
      where: { 
        email: decoded.email,
        isActive: true 
      } 
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if new password is same as current (optional security check)
    if (await user.correctPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'New password cannot be the same as current password'
      });
    }

    // Update password
    user.password = password;
    await user.save();

    // Send password reset success email
    await sendPasswordResetSuccess(user);

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};