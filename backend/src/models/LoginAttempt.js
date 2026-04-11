const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoginAttempt = sequelize.define('LoginAttempt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = LoginAttempt;
