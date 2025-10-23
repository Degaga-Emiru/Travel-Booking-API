const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  bookingReference: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  bookingType: {
    type: DataTypes.ENUM('flight', 'hotel', 'package', 'car_rental'),
    allowNull: false
  },
  flightId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Flights',
      key: 'id'
    }
  },
  hotelId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Hotels',
      key: 'id'
    }
  },
  packageId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Packages',
      key: 'id'
    }
  },
  carRentalId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  bookingDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  checkInDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  checkOutDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  flightDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  passengers: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  rooms: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  adults: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  children: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  finalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'refunded'),
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
    defaultValue: 'pending'
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancellationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  indexes: [
    {
      fields: ['bookingReference']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['bookingDate']
    }
  ]
});

// Instance method to generate booking reference
Booking.prototype.generateReference = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TB';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = Booking;