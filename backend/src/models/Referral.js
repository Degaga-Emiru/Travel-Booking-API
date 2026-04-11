const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Referral = sequelize.define('Referral', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  referrerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  referredId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  referralCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed'),
    defaultValue: 'pending'
  }
});

module.exports = Referral;
