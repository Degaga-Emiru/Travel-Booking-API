const { Hotel, Review, Booking, Destination, VendorProfile, Image, User } = require('../models');
const { Op } = require('sequelize');
const { createNotification } = require('./notificationController');

exports.getHotels = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const hotels = await Hotel.findAndCountAll({
      where: { isActive: true },
      include: [{ model: Image, as: 'Images' }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['averageRating', 'DESC']],
      distinct: true
    });

    res.status(200).json({
      success: true,
      count: hotels.count,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(hotels.count / limit)
      },
      data: hotels.rows
    });
  } catch (error) {
    next(error);
  }
};

exports.searchHotels = async (req, res, next) => {
  try {
    const { city = '', checkIn, checkOut, guests = 1, rooms = 1, minPrice, maxPrice, rating } = req.query;
    
    const where = {
      city: { [Op.iLike]: `%${city}%` },
      availableRooms: { [Op.gte]: parseInt(rooms) },
      isActive: true
    };

    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) where.pricePerNight[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.pricePerNight[Op.lte] = parseFloat(maxPrice);
    }

    if (rating) {
      where.averageRating = { [Op.gte]: parseFloat(rating) };
    }

    const hotels = await Hotel.findAll({
      where,
      order: [
        ['averageRating', 'DESC'],
        ['pricePerNight', 'ASC']
      ]
    });

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    next(error);
  }
};

exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id, {
      include: [
        { model: Image, as: 'Images' },
        {
          model: Review,
          include: [{
            model: User,
            attributes: ['firstName', 'lastName']
          }],
          limit: 10,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

exports.getHotelReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const reviews = await Review.findAndCountAll({
      where: { hotelId: req.params.id },
      include: [{
        model: User,
        attributes: ['firstName', 'lastName', 'profileImage']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: reviews.count,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(reviews.count / limit)
      },
      data: reviews.rows
    });
  } catch (error) {
    next(error);
  }
};

exports.createHotel = async (req, res, next) => {
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

    const hotel = await Hotel.create(req.body);

    if (req.body.Images && req.body.Images.length > 0) {
      const imageRecords = req.body.Images.map(img => ({
        url: img.url,
        category: img.category || 'General',
        relatedId: hotel.id,
        relatedType: 'Hotel'
      }));
      await Image.bulkCreate(imageRecords);
    }

    // Notify the vendor
    await createNotification(
      req.user.id,
      'system',
      'Hotel Created',
      `Your hotel listing for ${hotel.name} has been successfully created.`,
      hotel.id
    );

    res.status(201).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    await hotel.update(req.body);

    if (req.body.Images) {
      await Image.destroy({ where: { relatedId: hotel.id, relatedType: 'Hotel' } });
      if (req.body.Images.length > 0) {
        const imageRecords = req.body.Images.map(img => ({
          url: img.url,
          category: img.category || 'General',
          relatedId: hotel.id,
          relatedType: 'Hotel'
        }));
        await Image.bulkCreate(imageRecords);
      }
    }

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check if hotel has bookings
    const hotelBookings = await Booking.count({ where: { hotelId: hotel.id } });
    
    if (hotelBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete hotel with existing bookings. Deactivate instead.'
      });
    }

    await hotel.destroy();

    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getHotelStats = async (req, res, next) => {
  try {
    const totalHotels = await Hotel.count();
    const activeHotels = await Hotel.count({ where: { isActive: true } });
    const fiveStarHotels = await Hotel.count({ where: { starRating: 5 } });
    
    const popularHotels = await Booking.findAll({
      include: [{
        model: Hotel,
        attributes: ['name', 'city', 'country', 'averageRating']
      }],
      where: { status: 'confirmed' },
      attributes: [
        [sequelize.col('Hotel.name'), 'hotelName'],
        [sequelize.fn('count', '*'), 'bookings'],
        [sequelize.fn('sum', sequelize.col('Booking.finalAmount')), 'revenue']
      ],
      group: ['Hotel.id', 'Hotel.name', 'Hotel.city', 'Hotel.country', 'Hotel.averageRating'],
      order: [[sequelize.literal('bookings'), 'DESC']],
      limit: 10
    });

    const hotelsByCity = await Hotel.findAll({
      where: { isActive: true },
      attributes: [
        'city',
        [sequelize.fn('count', '*'), 'count'],
        [sequelize.fn('avg', sequelize.col('pricePerNight')), 'avgPrice']
      ],
      group: ['city'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 10
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalHotels,
        active: activeHotels,
        fiveStar: fiveStarHotels,
        popularHotels,
        hotelsByCity
      }
    });
  } catch (error) {
    next(error);
  }
};