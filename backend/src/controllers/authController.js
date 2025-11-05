const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { 
  sendWelcomeEmail, 
  sendPasswordResetOTP, 
  sendPasswordUpdated, 
  sendPasswordResetSuccess 
} = require('../utils/emailService');
const { generateRandomPassword } = require('../utils/helpers');

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

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { currentPassword, newPassword } = req.body;

    if (!(await user.correctPassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

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

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Send password reset email
    await sendPasswordReset(user, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    user.password = password;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
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