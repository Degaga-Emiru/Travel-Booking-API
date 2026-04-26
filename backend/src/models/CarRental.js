const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CarRental = sequelize.define('CarRental', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  vendorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'VendorProfiles',
      key: 'id'
    }
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Economy', 'Compact', 'Intermediate', 'Standard', 'Fullsize', 'Luxury', 'SUV', 'Minivan', 'Van', 'Truck'),
    defaultValue: 'Economy'
  },
  transmission: {
    type: DataTypes.ENUM('Automatic', 'Manual'),
    defaultValue: 'Automatic'
  },
  fuelType: {
    type: DataTypes.ENUM('Gasoline', 'Diesel', 'Electric', 'Hybrid'),
    defaultValue: 'Gasoline'
  },
  passengers: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  pricePerDay: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  features: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = CarRental;
