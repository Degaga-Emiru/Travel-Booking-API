const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PayoutRequest = sequelize.define('PayoutRequest', {
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
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'ETB'
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accountHolderName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending'
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = PayoutRequest;
