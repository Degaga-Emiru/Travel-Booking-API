const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General'
  },
  relatedId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  relatedType: {
    type: DataTypes.ENUM('Hotel', 'Flight', 'CarRental'),
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['relatedId', 'relatedType']
    }
  ]
});

module.exports = Image;
