const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Flight = sequelize.define('Flight', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  airline: {
    type: DataTypes.STRING,
    allowNull: false
  },
  airlineCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  flightNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  aircraftType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  departureAirport: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departureAirportName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departureCity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departureCountry: {
    type: DataTypes.STRING,
    allowNull: false
  },
  arrivalAirport: {
    type: DataTypes.STRING,
    allowNull: false
  },
  arrivalAirportName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  arrivalCity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  arrivalCountry: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departureTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  arrivalTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  economyPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  businessPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  firstClassPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  economySeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  businessSeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  firstClassSeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  availableEconomySeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  availableBusinessSeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  availableFirstClassSeats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  baggageAllowance: {
    type: DataTypes.JSONB,
    defaultValue: {
      economy: { carryOn: 1, checked: 1, weight: 20 },
      business: { carryOn: 2, checked: 2, weight: 32 },
      firstClass: { carryOn: 2, checked: 3, weight: 40 }
    }
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  isInternational: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  indexes: [
    {
      fields: ['departureAirport', 'arrivalAirport']
    },
    {
      fields: ['departureTime']
    },
    {
      fields: ['airline']
    }
  ]
});

module.exports = Flight;