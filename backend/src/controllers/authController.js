const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, PasswordReset, RefreshToken, LoginAttempt, PasswordHistory, Referral, Role } = require('../models');
const redisClient = require('../config/redis');
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
    const { firstName, lastName, email, password, phone, referralCode } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: 'customer' // Maintaining enum compatibility while creating UserRole association
    });

    // Handle Referral System
    if (referralCode) {
      const referrer = await User.findOne({ where: { referralCode } });
      if (referrer) {
        await Referral.create({
          referrerId: referrer.id,
          referredId: user.id,
          referralCode,
          status: 'completed'
        });
        referrer.addLoyaltyPoints(500); // 500 points for successful referral
      }
    }

    // Generate user's own referral code
    const ownReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    user.referralCode = ownReferralCode;
    await user.save();

    // Verify Email Code Setup
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    await redisClient.setex(`email_verify:${user.id}`, 24 * 60 * 60, verificationCode); // 24 hours expiry

    // Try to send email, but swallow error if ethereal/nodemailer fails locally
    try {
      await sendWelcomeEmail(user);
      console.log(`Email Verification Code for ${user.email} is: ${verificationCode}`); // For easy dev test
    } catch (e) {
      console.log("Email mock failure, code:", verificationCode);
    }

    createSendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check login attempts
    let loginAttempt = await LoginAttempt.findOne({ where: { email, ipAddress } });
    if (loginAttempt && loginAttempt.lockUntil && loginAttempt.lockUntil > new Date()) {
      return res.status(403).json({
        success: false,
        message: 'Account locked due to multiple failed attempts. Try again in 15 minutes.'
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.correctPassword(password))) {
      // Record failed attempt
      if (!loginAttempt) {
        loginAttempt = await LoginAttempt.create({ email, ipAddress, attempts: 1 });
      } else {
        loginAttempt.attempts += 1;
        if (loginAttempt.attempts >= 5) {
          loginAttempt.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // lock for 15 mins
        }
        await loginAttempt.save();
      }

      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    // Reset login attempts on success
    if (loginAttempt) {
        await loginAttempt.destroy();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate Refresh Token
    const refreshTokenValue = crypto.randomBytes(40).toString('hex');
    await RefreshToken.create({
      userId: user.id,
      token: refreshTokenValue,
      deviceId: crypto.randomBytes(16).toString('hex'), // In real scenario get from headers
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    res.cookie('refreshToken', refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const tokenDoc = await RefreshToken.findOne({ where: { token: refreshToken, isRevoked: false } });

    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await User.findByPk(tokenDoc.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const newAccessToken = signToken(user.id);
    
    // Optional: Rotate refresh token logic could go here

    res.status(200).json({
      success: true,
      token: newAccessToken
    });
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

// ✅ VERIFY EMAIL ROUTE
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified' });
    }

    const savedCode = await redisClient.get(`email_verify:${user.id}`);
    
    if (!savedCode || savedCode !== code) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    user.isEmailVerified = true;
    await user.save();
    
    await redisClient.del(`email_verify:${user.id}`);

    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
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
    const refreshToken = req.cookies.refreshToken;
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Blacklist access token in Redis
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        const expiry = decoded.exp - Math.floor(Date.now() / 1000);
        if (expiry > 0) {
          await redisClient.setex(`bl_${token}`, expiry, token);
        }
      } catch (e) {
        // Token might be invalid, ignore
      }
    }

    // Delete refresh token from DB
    if (refreshToken) {
      await RefreshToken.destroy({ where: { token: refreshToken } });
    }

    res.cookie('refreshToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};