const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VendorProfile = sequelize.define('VendorProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  businessType: {
    type: DataTypes.ENUM('Hotel', 'Airline', 'Agency', 'Car Rental'),
    allowNull: false
  },
  businessLicenseNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  taxId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ownerIdCard: {
    type: DataTypes.STRING, // URL to document
    allowNull: true
  },
  licenseDocument: {
    type: DataTypes.STRING, // URL to document
    allowNull: true
  },
  registrationDocument: {
    type: DataTypes.STRING, // URL to document
    allowNull: true
  },
  bankAccountDetails: {
    type: DataTypes.JSONB,
    defaultValue: {
      bankName: '',
      accountNumber: '',
      accountHolderName: ''
    }
  },
  socialMedia: {
    type: DataTypes.JSONB,
    defaultValue: {
      website: '',
      facebook: '',
      instagram: ''
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'suspended'),
    defaultValue: 'pending'
  },
  commissionRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 10.00 // Default 10%
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00
  },
  totalBookings: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalRevenue: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  payoutBalance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  }
}, {
  timestamps: true
});

module.exports = VendorProfile;
