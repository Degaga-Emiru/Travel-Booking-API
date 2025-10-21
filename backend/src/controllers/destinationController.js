const { Destination, Package, Hotel } = require('../models');
const { Op } = require('sequelize');

exports.getDestinations = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, country, isPopular } = req.query;
    const offset = (page - 1) * limit;

    let where = { isActive: true };
    if (country) where.country = { [Op.iLike]: `%${country}%` };
    if (isPopular !== undefined) where.isPopular = isPopular === 'true';

    const destinations = await Destination.findAndCountAll({
      where,
      include: [
        {
          model: Package,
          where: { isActive: true },
          required: false
        },
        {
          model: Hotel,
          where: { isActive: true },
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['isPopular', 'DESC'], ['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: destinations.count,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(destinations.count / limit)
      },
      data: destinations.rows
    });
  } catch (error) {
    next(error);
  }
};

exports.getPopularDestinations = async (req, res, next) => {
  try {
    const destinations = await Destination.findAll({
      where: { 
        isPopular: true, 
        isActive: true 
      },
      include: [
        {
          model: Package,
          where: { isActive: true, isFeatured: true },
          required: false,
          limit: 3
        }
      ],
      limit: 12,
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    next(error);
  }
};

exports.getDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByPk(req.params.id, {
      include: [
        {
          model: Package,
          where: { isActive: true },
          required: false
        },
        {
          model: Hotel,
          where: { isActive: true },
          required: false,
          order: [['starRating', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

exports.createDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create(req.body);

    res.status(201).json({
      success: true,
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

exports.updateDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByPk(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    await destination.update(req.body);

    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByPk(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Check if destination has packages
    const destinationPackages = await Package.count({ where: { destinationId: destination.id } });
    
    if (destinationPackages > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete destination with existing packages. Deactivate instead.'
      });
    }

    await destination.destroy();

    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getDestinationStats = async (req, res, next) => {
  try {
    const totalDestinations = await Destination.count();
    const activeDestinations = await Destination.count({ where: { isActive: true } });
    const popularDestinations = await Destination.count({ where: { isPopular: true } });
    
    const destinationsByCountry = await Destination.findAll({
      where: { isActive: true },
      attributes: [
        'country',
        [sequelize.fn('count', '*'), 'count']
      ],
      group: ['country'],
      order: [[sequelize.literal('count'), 'DESC']]
    });

    const popularDestinationsList = await Destination.findAll({
      where: { isPopular: true, isActive: true },
      include: [{
        model: Package,
        attributes: [[sequelize.fn('count', '*'), 'packageCount']]
      }],
      limit: 10
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalDestinations,
        active: activeDestinations,
        popular: popularDestinations,
        byCountry: destinationsByCountry,
        popularDestinations: popularDestinationsList
      }
    });
  } catch (error) {
    next(error);
  }
};