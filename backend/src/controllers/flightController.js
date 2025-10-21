const { Flight, Booking } = require('../models');
const { Op } = require('sequelize');

exports.getFlights = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const flights = await Flight.findAndCountAll({
      where: { isActive: true },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['departureTime', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: flights.count,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(flights.count / limit)
      },
      data: flights.rows
    });
  } catch (error) {
    next(error);
  }
};

exports.searchFlights = async (req, res, next) => {
  try {
    const { departure, arrival, date, passengers = 1, class: flightClass = 'economy' } = req.query;
    
    const departureDate = new Date(date);
    const nextDay = new Date(departureDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const where = {
      departureAirport: departure.toUpperCase(),
      arrivalAirport: arrival.toUpperCase(),
      departureTime: {
        [Op.between]: [departureDate, nextDay]
      },
      isActive: true
    };

    // Add seat availability based on class
    switch (flightClass) {
      case 'economy':
        where.availableEconomySeats = { [Op.gte]: parseInt(passengers) };
        break;
      case 'business':
        where.availableBusinessSeats = { [Op.gte]: parseInt(passengers) };
        break;
      case 'first':
        where.availableFirstClassSeats = { [Op.gte]: parseInt(passengers) };
        break;
    }

    const flights = await Flight.findAll({
      where,
      order: [
        ['departureTime', 'ASC'],
        [flightClass + 'Price', 'ASC']
      ]
    });

    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights
    });
  } catch (error) {
    next(error);
  }
};

exports.getFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByPk(req.params.id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.status(200).json({
      success: true,
      data: flight
    });
  } catch (error) {
    next(error);
  }
};

exports.createFlight = async (req, res, next) => {
  try {
    const flight = await Flight.create(req.body);

    res.status(201).json({
      success: true,
      data: flight
    });
  } catch (error) {
    next(error);
  }
};

exports.updateFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByPk(req.params.id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    await flight.update(req.body);

    res.status(200).json({
      success: true,
      data: flight
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByPk(req.params.id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    // Check if flight has bookings
    const flightBookings = await Booking.count({ where: { flightId: flight.id } });
    
    if (flightBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete flight with existing bookings. Deactivate instead.'
      });
    }

    await flight.destroy();

    res.status(200).json({
      success: true,
      message: 'Flight deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getFlightStats = async (req, res, next) => {
  try {
    const totalFlights = await Flight.count();
    const activeFlights = await Flight.count({ where: { isActive: true } });
    const internationalFlights = await Flight.count({ where: { isInternational: true } });
    
    const popularRoutes = await Booking.findAll({
      include: [{
        model: Flight,
        attributes: ['departureAirport', 'arrivalAirport']
      }],
      where: { status: 'confirmed' },
      attributes: [
        [sequelize.col('Flight.departureAirport'), 'departure'],
        [sequelize.col('Flight.arrivalAirport'), 'arrival'],
        [sequelize.fn('count', '*'), 'bookings']
      ],
      group: ['Flight.departureAirport', 'Flight.arrivalAirport'],
      order: [[sequelize.literal('bookings'), 'DESC']],
      limit: 10
    });

    const revenueByAirline = await Booking.findAll({
      include: [{
        model: Flight,
        attributes: ['airline']
      }],
      where: { status: 'confirmed', paymentStatus: 'paid' },
      attributes: [
        [sequelize.col('Flight.airline'), 'airline'],
        [sequelize.fn('sum', sequelize.col('Booking.finalAmount')), 'revenue'],
        [sequelize.fn('count', '*'), 'bookings']
      ],
      group: ['Flight.airline'],
      order: [[sequelize.literal('revenue'), 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalFlights,
        active: activeFlights,
        international: internationalFlights,
        popularRoutes,
        revenueByAirline
      }
    });
  } catch (error) {
    next(error);
  }
};