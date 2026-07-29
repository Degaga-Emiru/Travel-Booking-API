const { Flight, Booking, sequelize, VendorProfile, Image } = require('../models');
const { Op } = require('sequelize');


exports.getFlights = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const flights = await Flight.findAndCountAll({
      where: { isActive: true },
      include: [{ model: Image, as: 'Images' }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['departureTime', 'ASC']],
      distinct: true
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
    const { departure, arrival, date, returnDate, passengers = 1, class: flightClass = 'economy' } = req.query;
    
    const departureDate = new Date(date);
    const nextDay = new Date(departureDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const where = {
      [Op.and]: [
        {
          [Op.or]: [
            { departureAirport: { [Op.iLike]: `%${departure}%` } },
            { departureCity: { [Op.iLike]: `%${departure}%` } }
          ]
        },
        {
          [Op.or]: [
            { arrivalAirport: { [Op.iLike]: `%${arrival}%` } },
            { arrivalCity: { [Op.iLike]: `%${arrival}%` } }
          ]
        }
      ],
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

    const outboundFlights = await Flight.findAll({
      where,
      order: [
        ['departureTime', 'ASC'],
        [flightClass + 'Price', 'ASC']
      ],
      include: [{ model: Image, as: 'Images' }]
    });

    let returnFlights = [];
    if (returnDate) {
      const returnDateStart = new Date(returnDate);
      const returnNextDay = new Date(returnDateStart);
      returnNextDay.setDate(returnNextDay.getDate() + 1);

      const returnWhere = {
        [Op.and]: [
          {
            [Op.or]: [
              { departureAirport: { [Op.iLike]: `%${arrival}%` } },
              { departureCity: { [Op.iLike]: `%${arrival}%` } }
            ]
          },
          {
            [Op.or]: [
              { arrivalAirport: { [Op.iLike]: `%${departure}%` } },
              { arrivalCity: { [Op.iLike]: `%${departure}%` } }
            ]
          }
        ],
        departureTime: {
          [Op.between]: [returnDateStart, returnNextDay]
        },
        isActive: true
      };

      // Add seat availability based on class for return flights
      switch (flightClass) {
        case 'economy':
          returnWhere.availableEconomySeats = { [Op.gte]: parseInt(passengers) };
          break;
        case 'business':
          returnWhere.availableBusinessSeats = { [Op.gte]: parseInt(passengers) };
          break;
        case 'first':
          returnWhere.availableFirstClassSeats = { [Op.gte]: parseInt(passengers) };
          break;
      }

      returnFlights = await Flight.findAll({
        where: returnWhere,
        order: [
          ['departureTime', 'ASC'],
          [flightClass + 'Price', 'ASC']
        ],
        include: [{ model: Image, as: 'Images' }]
      });
    }

    res.status(200).json({
      success: true,
      count: outboundFlights.length + returnFlights.length,
      data: {
        outbound: outboundFlights,
        return: returnFlights.length > 0 ? returnFlights : undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByPk(req.params.id, {
      include: [{ model: Image, as: 'Images' }]
    });

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
    // If user is a vendor, associate with their vendor profile and check verification
    if (req.user.role === 'vendor') {
      const vendor = await VendorProfile.findOne({ where: { userId: req.user.id } });
      
      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: 'Vendor profile not found'
        });
      }

      if (vendor.status !== 'verified') {
        return res.status(403).json({
          success: false,
          message: 'Your vendor account is not yet approved. Please complete business verification.'
        });
      }

      req.body.vendorId = vendor.id;
    }

    const flight = await Flight.create(req.body);

    if (req.body.Images && req.body.Images.length > 0) {
      const imageRecords = req.body.Images.map(img => ({
        url: img.url,
        category: img.category || 'General',
        relatedId: flight.id,
        relatedType: 'Flight'
      }));
      await Image.bulkCreate(imageRecords);
    }

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

    if (req.body.Images) {
      await Image.destroy({ where: { relatedId: flight.id, relatedType: 'Flight' } });
      if (req.body.Images.length > 0) {
        const imageRecords = req.body.Images.map(img => ({
          url: img.url,
          category: img.category || 'General',
          relatedId: flight.id,
          relatedType: 'Flight'
        }));
        await Image.bulkCreate(imageRecords);
      }
    }

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