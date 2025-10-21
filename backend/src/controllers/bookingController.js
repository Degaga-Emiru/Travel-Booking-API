const { Booking, User, Flight, Hotel, Package, Payment } = require('../models');
const { Op } = require('sequelize');
const { generateBookingReference, calculateTotalAmount } = require('../utils/helpers');
const { sendBookingConfirmation, sendBookingCancellation } = require('../utils/emailService');

exports.createBooking = async (req, res, next) => {
  try {
    const {
      bookingType,
      flightId,
      hotelId,
      packageId,
      checkInDate,
      checkOutDate,
      flightDate,
      passengers,
      adults = 1,
      children = 0,
      rooms = 1,
      specialRequests
    } = req.body;

    let bookingData = {
      bookingReference: generateBookingReference(),
      userId: req.user.id,
      bookingType,
      adults,
      children,
      specialRequests
    };

    let totalAmount = 0;
    let resource;

    switch (bookingType) {
      case 'flight':
        resource = await Flight.findByPk(flightId);
        if (!resource) {
          return res.status(404).json({
            success: false,
            message: 'Flight not found'
          });
        }
        if (resource.availableEconomySeats < adults + children) {
          return res.status(400).json({
            success: false,
            message: 'Not enough seats available'
          });
        }
        bookingData.flightId = flightId;
        bookingData.flightDate = flightDate;
        bookingData.passengers = passengers || [];
        totalAmount = resource.economyPrice * (adults + children);
        
        // Update available seats
        await resource.update({
          availableEconomySeats: resource.availableEconomySeats - (adults + children)
        });
        break;

      case 'hotel':
        resource = await Hotel.findByPk(hotelId);
        if (!resource) {
          return res.status(404).json({
            success: false,
            message: 'Hotel not found'
          });
        }
        if (resource.availableRooms < rooms) {
          return res.status(400).json({
            success: false,
            message: 'Not enough rooms available'
          });
        }
        bookingData.hotelId = hotelId;
        bookingData.checkInDate = checkInDate;
        bookingData.checkOutDate = checkOutDate;
        bookingData.rooms = rooms;
        
        const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
        totalAmount = resource.pricePerNight * nights * rooms;
        
        // Update available rooms
        await resource.update({
          availableRooms: resource.availableRooms - rooms
        });
        break;

      case 'package':
        resource = await Package.findByPk(packageId);
        if (!resource) {
          return res.status(404).json({
            success: false,
            message: 'Package not found'
          });
        }
        if (resource.availableSlots < adults + children) {
          return res.status(400).json({
            success: false,
            message: 'Not enough slots available'
          });
        }
        bookingData.packageId = packageId;
        totalAmount = resource.discountPrice || resource.price;
        
        // Update available slots
        await resource.update({
          availableSlots: resource.availableSlots - (adults + children)
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid booking type'
        });
    }

    // Calculate final amount with tax
    const amountDetails = calculateTotalAmount(totalAmount, resource.taxRate || 10);
    
    bookingData.totalAmount = amountDetails.baseAmount;
    bookingData.taxAmount = amountDetails.taxAmount;
    bookingData.finalAmount = amountDetails.finalAmount;

    const booking = await Booking.create(bookingData);

    // Populate booking with related data
    const populatedBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Flight },
        { model: Hotel },
        { model: Package, include: [Destination] },
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    // Send booking confirmation email
    await sendBookingConfirmation(req.user, populatedBooking);

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let where = { userId: req.user.id };
    if (status) where.status = status;

    const bookings = await Booking.findAndCountAll({
      where,
      include: [
        { model: Flight },
        { model: Hotel },
        { model: Package, include: [Destination] },
        { model: Payment }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['bookingDate', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: bookings.count,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(bookings.count / limit)
      },
      data: bookings.rows
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, bookingType, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    if (status) where.status = status;
    if (bookingType) where.bookingType = bookingType;
    if (startDate && endDate) {
      where.bookingDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const bookings = await Booking.findAndCountAll({
      where,
      include: [
        { model: Flight },
        { model: Hotel },
        { model: Package, include: [Destination] },
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Payment }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['bookingDate', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: bookings.count,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(bookings.count / limit)
      },
      data: bookings.rows
    });
  } catch (error) {
    next(error);
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: Flight },
        { model: Hotel },
        { model: Package, include: [Destination] },
        { model: User, attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
        { model: Payment }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin/agent
    if (booking.userId !== req.user.id && !['admin', 'agent'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only admin/agent can update bookings
    if (!['admin', 'agent'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update bookings'
      });
    }

    const { status, specialRequests, notes } = req.body;
    
    await booking.update({
      status: status || booking.status,
      specialRequests: specialRequests || booking.specialRequests,
      notes: notes || booking.notes
    });

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User },
        { model: Flight },
        { model: Hotel },
        { model: Package }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin/agent
    if (booking.userId !== req.user.id && !['admin', 'agent'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    const { cancellationReason } = req.body;

    // Restore availability
    if (booking.flightId && booking.Flight) {
      await booking.Flight.update({
        availableEconomySeats: booking.Flight.availableEconomySeats + booking.adults + booking.children
      });
    }

    if (booking.hotelId && booking.Hotel) {
      await booking.Hotel.update({
        availableRooms: booking.Hotel.availableRooms + booking.rooms
      });
    }

    if (booking.packageId && booking.Package) {
      await booking.Package.update({
        availableSlots: booking.Package.availableSlots + booking.adults + booking.children
      });
    }

    await booking.update({
      status: 'cancelled',
      cancellationReason,
      cancellationDate: new Date()
    });

    // Send cancellation email
    await sendBookingCancellation(booking.User, booking);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookingStats = async (req, res, next) => {
  try {
    const totalBookings = await Booking.count();
    const confirmedBookings = await Booking.count({ where: { status: 'confirmed' } });
    const pendingBookings = await Booking.count({ where: { status: 'pending' } });
    const cancelledBookings = await Booking.count({ where: { status: 'cancelled' } });
    
    const totalRevenue = await Booking.sum('finalAmount', {
      where: { status: 'confirmed', paymentStatus: 'paid' }
    });

    const monthlyRevenue = await Booking.findAll({
      where: {
        status: 'confirmed',
        paymentStatus: 'paid',
        bookingDate: { [Op.gte]: new Date(new Date().getFullYear(), 0, 1) }
      },
      attributes: [
        [sequelize.fn('date_trunc', 'month', sequelize.col('bookingDate')), 'month'],
        [sequelize.fn('sum', sequelize.col('finalAmount')), 'revenue'],
        [sequelize.fn('count', '*'), 'bookings']
      ],
      group: ['month'],
      order: [['month', 'ASC']]
    });

    const bookingsByType = await Booking.findAll({
      attributes: [
        'bookingType',
        [sequelize.fn('count', '*'), 'count'],
        [sequelize.fn('sum', sequelize.col('finalAmount')), 'revenue']
      ],
      where: { status: 'confirmed', paymentStatus: 'paid' },
      group: ['bookingType']
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalBookings,
        byStatus: {
          confirmed: confirmedBookings,
          pending: pendingBookings,
          cancelled: cancelledBookings
        },
        totalRevenue: totalRevenue || 0,
        monthlyRevenue,
        bookingsByType
      }
    });
  } catch (error) {
    next(error);
  }
};