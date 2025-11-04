const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email with template
 */
const sendEmail = async (to, subject, templateName, templateData) => {
  try {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templateName}.html`);
    }

    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace template variables
    Object.keys(templateData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, templateData[key]);
    });

    const mailOptions = {
      from: `"Travel Booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} successfully: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
/**
 * Send password reset OTP email
 */
const sendPasswordResetOTP = async (user, otp) => {
  const subject = 'Password Reset OTP - Travel Booking';
  
  const templateData = {
    userName: user.getFullName(),
    otpCode: otp,
    expiryMinutes: 3,
    supportEmail: 'support@travelbooking.com'
  };

  return await sendEmail(user.email, subject, 'passwordResetOTP', templateData);
};

/**
 * Send password updated confirmation email
 */
const sendPasswordUpdated = async (user) => {
  const subject = 'Password Updated - Travel Booking';
  
  const templateData = {
    userName: user.getFullName(),
    updateTime: new Date().toLocaleString(),
    supportEmail: 'support@travelbooking.com',
    contactEmail: 'support@travelbooking.com'
  };

  return await sendEmail(user.email, subject, 'passwordUpdated', templateData);
};

/**
 * Send password reset success email
 */
const sendPasswordResetSuccess = async (user) => {
  const subject = 'Password Reset Successful - Travel Booking';
  
  const templateData = {
    userName: user.getFullName(),
    resetTime: new Date().toLocaleString(),
    supportEmail: 'support@travelbooking.com'
  };

  return await sendEmail(user.email, subject, 'passwordResetSuccess', templateData);
};

/**
 * Send booking confirmation email
 */
const sendBookingConfirmation = async (user, booking) => {
  const subject = `Booking Confirmation - ${booking.bookingReference}`;
  
  const templateData = {
    userName: user.getFullName(),
    bookingReference: booking.bookingReference,
    bookingType: booking.bookingType,
    totalAmount: booking.finalAmount,
    currency: booking.currency,
    bookingDate: new Date(booking.bookingDate).toLocaleDateString(),
    supportEmail: 'support@travelbooking.com'
  };

  return await sendEmail(user.email, subject, 'bookingConfirmation', templateData);
};

/**
 * Send payment confirmation email
 */
const sendPaymentConfirmation = async (user, payment, booking) => {
  const subject = `Payment Confirmation - ${payment.paymentReference}`;
  
  const templateData = {
    userName: user.getFullName(),
    paymentReference: payment.paymentReference,
    amount: payment.amount,
    currency: payment.currency,
    paymentDate: new Date(payment.paymentDate).toLocaleDateString(),
    bookingReference: booking.bookingReference,
    supportEmail: 'support@travelbooking.com'
  };

  return await sendEmail(user.email, subject, 'paymentConfirmation', templateData);
};

/**
 * Send password reset email
 */
const sendPasswordReset = async (user, resetToken) => {
  const subject = 'Password Reset Request';
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  
  const templateData = {
    userName: user.getFullName(),
    resetUrl,
    supportEmail: 'support@travelbooking.com'
  };

  return await sendEmail(user.email, subject, 'passwordReset', templateData);
};

/**
 * Example: Send Welcome Email
 */
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Travel Booking';
  
  const templateData = {
    userName: user.getFullName(),
    loginUrl: `${process.env.CLIENT_URL}/login`,
    supportEmail: 'support@travelbooking.com',
  };

  return await sendEmail(user.email, subject, 'welcome', templateData);
};


/**
 * Send booking cancellation email
 */
const sendBookingCancellation = async (user, booking) => {
  const subject = `Booking Cancelled - ${booking.bookingReference}`;
  
  const templateData = {
    userName: user.getFullName(),
    bookingReference: booking.bookingReference,
    refundAmount: booking.finalAmount,
    currency: booking.currency,
    cancellationDate: new Date().toLocaleDateString(),
    supportEmail: 'support@travelbooking.com'
  };

  return await sendEmail(user.email, subject, 'bookingCancellation', templateData);
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendPaymentConfirmation,
  sendPasswordReset,
  sendWelcomeEmail,
  sendBookingCancellation,
  sendPasswordResetOTP,
  sendPasswordUpdated,
  sendPasswordResetSuccess
};