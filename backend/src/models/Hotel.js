const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hotel = sequelize.define('Hotel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  chain: {
    type: DataTypes.STRING,
    allowNull: true
  },
  starRating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  checkInTime: {
    type: DataTypes.TIME,
    defaultValue: '14:00'
  },
  checkOutTime: {
    type: DataTypes.TIME,
    defaultValue: '12:00'
  },
  pricePerNight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 10.0
  },
  totalRooms: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  availableRooms: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  roomTypes: {
    type: DataTypes.JSONB,
    defaultValue: {
      standard: { price: 0, available: 0 },
      deluxe: { price: 0, available: 0 },
      suite: { price: 0, available: 0 }
    }
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  policies: {
    type: DataTypes.JSONB,
    defaultValue: {
      cancellation: 'Free cancellation up to 24 hours before check-in',
      pets: 'Not allowed',
      smoking: 'Non-smoking rooms only'
    }
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  indexes: [
    {
      fields: ['city', 'country']
    },
    {
      fields: ['starRating']
    },
    {
      fields: ['averageRating']
    }
  ]
});

module.exports = Hotel;