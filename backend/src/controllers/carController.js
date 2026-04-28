const { CarRental, VendorProfile, Image } = require('../models');
const { Op } = require('sequelize');

exports.getCars = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, minPrice, maxPrice, transmission, fuelType } = req.query;
    const offset = (page - 1) * limit;

    const where = { isAvailable: true };

    if (type) where.type = type;
    if (transmission) where.transmission = transmission;
    if (fuelType) where.fuelType = fuelType;
    
    if (minPrice || maxPrice) {
      where.pricePerDay = {};
      if (minPrice) where.pricePerDay[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.pricePerDay[Op.lte] = parseFloat(maxPrice);
    }

    const cars = await CarRental.findAndCountAll({
      where,
      include: [{ model: Image, as: 'Images' }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['pricePerDay', 'ASC']],
      distinct: true
    });

    res.status(200).json({
      success: true,
      count: cars.count,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(cars.count / limit)
      },
      data: cars.rows
    });
  } catch (error) {
    next(error);
  }
};

exports.getCar = async (req, res, next) => {
  try {
    const car = await CarRental.findByPk(req.params.id, {
      include: [{ model: Image, as: 'Images' }]
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car rental not found'
      });
    }

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    next(error);
  }
};

exports.createCar = async (req, res, next) => {
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

    const car = await CarRental.create(req.body);

    if (req.body.Images && req.body.Images.length > 0) {
      const imageRecords = req.body.Images.map(img => ({
        url: img.url,
        category: img.category || 'General',
        relatedId: car.id,
        relatedType: 'CarRental'
      }));
      await Image.bulkCreate(imageRecords);
    }

    res.status(201).json({
      success: true,
      data: car
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCar = async (req, res, next) => {
  try {
    const car = await CarRental.findByPk(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car rental not found'
      });
    }

    // Check if vendor owns this car
    if (req.user.role === 'vendor') {
        const vendor = await VendorProfile.findOne({ where: { userId: req.user.id } });
        if (car.vendorId !== vendor.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this listing' });
        }
    }

    await car.update(req.body);

    if (req.body.Images) {
      await Image.destroy({ where: { relatedId: car.id, relatedType: 'CarRental' } });
      if (req.body.Images.length > 0) {
        const imageRecords = req.body.Images.map(img => ({
          url: img.url,
          category: img.category || 'General',
          relatedId: car.id,
          relatedType: 'CarRental'
        }));
        await Image.bulkCreate(imageRecords);
      }
    }

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCar = async (req, res, next) => {
  try {
    const car = await CarRental.findByPk(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car rental not found'
      });
    }

    // Check if vendor owns this car
    if (req.user.role === 'vendor') {
        const vendor = await VendorProfile.findOne({ where: { userId: req.user.id } });
        if (car.vendorId !== vendor.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this listing' });
        }
    }

    await car.destroy();

    res.status(200).json({
      success: true,
      message: 'Car rental deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
