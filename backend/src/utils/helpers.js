const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

/**
 * Generate a unique booking reference
 */
const generateBookingReference = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TB';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate a unique payment reference
 */
const generatePaymentReference = () => {
  return 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

/**
 * Calculate total amount with tax and discounts
 */
const calculateTotalAmount = (baseAmount, taxRate = 0, discountAmount = 0) => {
  const taxAmount = (baseAmount * taxRate) / 100;
  return {
    baseAmount: parseFloat(baseAmount),
    taxAmount: parseFloat(taxAmount),
    discountAmount: parseFloat(discountAmount),
    finalAmount: parseFloat(baseAmount) + parseFloat(taxAmount) - parseFloat(discountAmount)
  };
};

/**
 * Format currency
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Generate QR code for booking
 */
const generateQRCode = async (data) => {
  try {
    const qrCodeData = JSON.stringify(data);
    const qrCode = await QRCode.toDataURL(qrCodeData);
    return qrCode;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Calculate duration between two dates in days
 */
const calculateDuration = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  return end.diff(start, 'days');
};

/**
 * Format date for display
 */
const formatDate = (date, format = 'YYYY-MM-DD') => {
  return moment(date).format(format);
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate random password
 */
const generateRandomPassword = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

/**
 * Sanitize user input
 */
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  return input;
};

/**
 * Calculate loyalty points based on booking amount
 */
const calculateLoyaltyPoints = (amount) => {
  return Math.floor(amount / 10); // 1 point for every $10 spent
};

/**
 * Paginate results
 */
const paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return {
    offset,
    limit: parseInt(limit)
  };
};

/**
 * Generate filter conditions for Sequelize
 */
const generateFilters = (filters) => {
  const where = {};
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      if (typeof filters[key] === 'string') {
        where[key] = { [Op.iLike]: `%${filters[key]}%` };
      } else {
        where[key] = filters[key];
      }
    }
  });
  
  return where;
};

module.exports = {
  generateBookingReference,
  generatePaymentReference,
  calculateTotalAmount,
  formatCurrency,
  generateQRCode,
  calculateDuration,
  formatDate,
  isValidEmail,
  generateRandomPassword,
  sanitizeInput,
  calculateLoyaltyPoints,
  paginate,
  generateFilters
};