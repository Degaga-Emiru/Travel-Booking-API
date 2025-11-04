const sequelize = require('../config/database');

// Import all models
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
// Add association
User.hasMany(PasswordReset, { foreignKey: 'email', sourceKey: 'email' });
PasswordReset.belongsTo(User, { foreignKey: 'email', targetKey: 'email' });
Booking.hasOne(Payment, { foreignKey: 'bookingId' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

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
  PasswordReset

};