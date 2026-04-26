const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
// Import all models - they are already initialized classes
const User = require('./User');
const Booking = require('./Booking');
const Flight = require('./Flight');
const Hotel = require('./Hotel');
const Destination = require('./Destination');
const Package = require('./Package');
const Payment = require('./Payment');
const Review = require('./Review');
const Notification = require('./Notification');
const PasswordReset = require('./PasswordReset');
const Role = require('./Role');
const UserRole = require('./UserRole');
const RefreshToken = require('./RefreshToken');
const LoginAttempt = require('./LoginAttempt');
const PasswordHistory = require('./PasswordHistory');
const Referral = require('./Referral');
const UserVerification = require('./UserVerification');
const VendorProfile = require('./VendorProfile');
const RefundRequest = require('./RefundRequest');
const Message = require('./Message');
const AuditLog = require('./AuditLog');

// Define associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

Flight.hasMany(Booking, { foreignKey: 'flightId' });
Booking.belongsTo(Flight, { foreignKey: 'flightId' });

Hotel.hasMany(Booking, { foreignKey: 'hotelId' });
Booking.belongsTo(Hotel, { foreignKey: 'hotelId' });

Hotel.hasMany(Review, { foreignKey: 'hotelId' });
Review.belongsTo(Hotel, { foreignKey: 'hotelId' });

Destination.hasMany(Package, { foreignKey: 'destinationId' });
Package.belongsTo(Destination, { foreignKey: 'destinationId' });

Package.hasMany(Booking, { foreignKey: 'packageId' });
Booking.belongsTo(Package, { foreignKey: 'packageId' });

Package.hasMany(Review, { foreignKey: 'packageId' });
Review.belongsTo(Package, { foreignKey: 'packageId' });

User.hasMany(PasswordReset, { foreignKey: 'email', sourceKey: 'email' });
PasswordReset.belongsTo(User, { foreignKey: 'email', targetKey: 'email' });

Booking.hasOne(Payment, { foreignKey: 'bookingId' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });

User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(PasswordHistory, { foreignKey: 'userId' });
PasswordHistory.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Referral, { as: 'ReferredUsers', foreignKey: 'referrerId' });
Referral.belongsTo(User, { as: 'Referrer', foreignKey: 'referrerId' });

User.hasOne(Referral, { as: 'ReferredBy', foreignKey: 'referredId' });
Referral.belongsTo(User, { as: 'Referred', foreignKey: 'referredId' });

User.hasMany(UserVerification, { foreignKey: 'userId' });
UserVerification.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(VendorProfile, { foreignKey: 'userId' });
VendorProfile.belongsTo(User, { foreignKey: 'userId' });

Booking.hasMany(RefundRequest, { foreignKey: 'bookingId' });
RefundRequest.belongsTo(Booking, { foreignKey: 'bookingId' });

Payment.hasMany(RefundRequest, { foreignKey: 'paymentId' });
RefundRequest.belongsTo(Payment, { foreignKey: 'paymentId' });

User.hasMany(RefundRequest, { foreignKey: 'userId' });
RefundRequest.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Message, { as: 'SentMessages', foreignKey: 'senderId' });
User.hasMany(Message, { as: 'ReceivedMessages', foreignKey: 'receiverId' });
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });

User.hasMany(AuditLog, { foreignKey: 'adminId' });
AuditLog.belongsTo(User, { foreignKey: 'adminId' });

module.exports = {
  sequelize,
  User,
  Booking,
  Flight,
  Hotel,
  Destination,
  Package,
  Payment,
  Review,
  Notification,
  PasswordReset,
  Role,
  UserRole,
  RefreshToken,
  LoginAttempt,
  PasswordHistory,
  Referral,
  UserVerification,
  VendorProfile,
  RefundRequest,
  Message,
  AuditLog
};