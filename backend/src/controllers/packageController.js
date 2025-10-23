const { Package, Destination, Booking } = require('../models');
const { Op } = require('sequelize');

exports.getPackages = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, destinationId, isFeatured } = req.query;
    const offset = (page - 1) * limit;

    let where = { isActive: true };
    if (destinationId) where.destinationId = destinationId;
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

    const packages = await Package.findAndCountAll({
      where,
      include: [Destination],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['isFeatured', 'DESC'], ['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: packages.count,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(packages.count / limit)
      },
      data: packages.rows
    });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedPackages = async (req, res, next) => {
  try {
    const packages = await Package.findAll({
      where: { 
        isFeatured: true, 
        isActive: true,
        availableSlots: { [Op.gt]: 0 },
        startDate: { [Op.gte]: new Date() }
      },
      include: [Destination],
      limit: 8,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    next(error);
  }
};

exports.searchPackages = async (req, res, next) => {
  try {
    const { destination, minPrice, maxPrice, duration, travelers } = req.query;
    
    let where = { 
      isActive: true,
      availableSlots: { [Op.gt]: 0 },
      startDate: { [Op.gte]: new Date() }
    };

    if (destination) {
      where['$Destination.name$'] = { [Op.iLike]: `%${destination}%` };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (duration) {
      where.duration = { [Op.lte]: parseInt(duration) };
    }

    if (travelers) {
      where.maxTravelers = { [Op.gte]: parseInt(travelers) };
    }

    const packages = await Package.findAll({
      where,
      include: [Destination],
      order: [
        ['isFeatured', 'DESC'],
        ['price', 'ASC']
      ]
    });

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    next(error);
  }
};

exports.getPackage = async (req, res, next) => {
  try {
    const package = await Package.findByPk(req.params.id, {
      include: [Destination]
    });

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    next(error);
  }
};

exports.createPackage = async (req, res, next) => {
  try {
    const package = await Package.create(req.body);

    const populatedPackage = await Package.findByPk(package.id, {
      include: [Destination]
    });

    res.status(201).json({
      success: true,
      data: populatedPackage
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePackage = async (req, res, next) => {
  try {
    const package = await Package.findByPk(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    await package.update(req.body);

    const populatedPackage = await Package.findByPk(package.id, {
      include: [Destination]
    });

    res.status(200).json({
      success: true,
      data: populatedPackage
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePackage = async (req, res, next) => {
  try {
    const package = await Package.findByPk(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Check if package has bookings
    const packageBookings = await Booking.count({ where: { packageId: package.id } });
    
    if (packageBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete package with existing bookings. Deactivate instead.'
      });
    }

    await package.destroy();

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getPackageStats = async (req, res, next) => {
  try {
    const totalPackages = await Package.count();
    const activePackages = await Package.count({ where: { isActive: true } });
    const featuredPackages = await Package.count({ where: { isFeatured: true } });
    
    const popularPackages = await Booking.findAll({
      include: [{
        model: Package,
        include: [Destination],
        attributes: ['name']
      }],
      where: { status: 'confirmed' },
      attributes: [
        [sequelize.col('Package.name'), 'packageName'],
        [sequelize.fn('count', '*'), 'bookings'],
        [sequelize.fn('sum', sequelize.col('Booking.finalAmount')), 'revenue']
      ],
      group: ['Package.id', 'Package.name'],
      order: [[sequelize.literal('bookings'), 'DESC']],
      limit: 10
    });

    const packagesByDestination = await Package.findAll({
      where: { isActive: true },
      include: [Destination],
      attributes: [
        [sequelize.col('Destination.name'), 'destination'],
        [sequelize.fn('count', '*'), 'count'],
        [sequelize.fn('avg', sequelize.col('Package.price')), 'avgPrice']
      ],
      group: ['Destination.id', 'Destination.name'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 10
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalPackages,
        active: activePackages,
        featured: featuredPackages,
        popularPackages,
        packagesByDestination
      }
    });
  } catch (error) {
    next(error);
  }
};