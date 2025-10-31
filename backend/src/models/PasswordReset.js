const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PasswordReset = sequelize.define('PasswordReset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['otp']
    },
    {
      fields: ['expiresAt']
    }
  ]
});

// Instance method to check if OTP is valid
PasswordReset.prototype.isValid = function() {
  return !this.isUsed && this.expiresAt > new Date() && this.attempts < 3;
};

// Static method to cleanup expired OTPs
PasswordReset.cleanupExpired = async function() {
  await this.destroy({
    where: {
      expiresAt: {
        [Op.lt]: new Date()
      }
    }
  });
};

module.exports = PasswordReset;