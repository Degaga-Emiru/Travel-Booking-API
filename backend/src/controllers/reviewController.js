const { Review, User, Hotel, Package } = require('../models');
const { Op } = require('sequelize');

exports.createReview = async (req, res, next) => {
  try {
    const { hotelId, packageId, rating, comment } = req.body;

    if (!hotelId && !packageId) {
      return res.status(400).json({
        success: false,
        message: 'Either hotelId or packageId is required'
      });
    }

    // Check if user already reviewed this item
    const existingReview = await Review.findOne({
      where: {
        userId: req.user.id,
        [Op.or]: [
          { hotelId: hotelId || null },
          { packageId: packageId || null }
        ]
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this item'
      });
    }

    const review = await Review.create({
      userId: req.user.id,
      hotelId,
      packageId,
      rating,
      comment,
      isVerified: true // Auto-verify for now
    });

    // Update hotel or package rating
    if (hotelId) {
      await updateHotelRating(hotelId);
    } else if (packageId) {
      await updatePackageRating(packageId);
    }

    const populatedReview = await Review.findByPk(review.id, {
      include: [{
        model: User,
        attributes: ['firstName', 'lastName', 'profileImage']
      }]
    });

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, rating, isVerified } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    if (rating) where.rating = rating;
    if (isVerified !== undefined) where.isVerified = isVerified === 'true';

    const reviews = await Review.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'profileImage']
        },
        {
          model: Hotel,
          attributes: ['name']
        },
        {
          model: Package,
          attributes: ['name']
        }
      ],
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

exports.getHotelReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    const offset = (page - 1) * limit;

    let where = { hotelId: req.params.hotelId };
    if (rating) where.rating = rating;

    const reviews = await Review.findAndCountAll({
      where,
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

exports.getUserReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const reviews = await Review.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Hotel,
          attributes: ['name', 'images']
        },
        {
          model: Package,
          attributes: ['name', 'images']
        }
      ],
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

exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'profileImage']
        },
        {
          model: Hotel,
          attributes: ['name', 'images']
        },
        {
          model: Package,
          attributes: ['name', 'images']
        }
      ]
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const { rating, comment } = req.body;

    await review.update({
      rating: rating || review.rating,
      comment: comment || review.comment
    });

    // Update hotel or package rating
    if (review.hotelId) {
      await updateHotelRating(review.hotelId);
    } else if (review.packageId) {
      await updatePackageRating(review.packageId);
    }

    const populatedReview = await Review.findByPk(review.id, {
      include: [{
        model: User,
        attributes: ['firstName', 'lastName', 'profileImage']
      }]
    });

    res.status(200).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const hotelId = review.hotelId;
    const packageId = review.packageId;

    await review.destroy();

    // Update hotel or package rating
    if (hotelId) {
      await updateHotelRating(hotelId);
    } else if (packageId) {
      await updatePackageRating(packageId);
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update hotel rating
const updateHotelRating = async (hotelId) => {
  const ratingStats = await Review.findOne({
    where: { hotelId },
    attributes: [
      [sequelize.fn('avg', sequelize.col('rating')), 'averageRating'],
      [sequelize.fn('count', '*'), 'reviewCount']
    ]
  });

  if (ratingStats) {
    await Hotel.update({
      averageRating: parseFloat(ratingStats.get('averageRating') || 0).toFixed(2),
      reviewCount: ratingStats.get('reviewCount')
    }, {
      where: { id: hotelId }
    });
  }
};

// Helper function to update package rating
const updatePackageRating = async (packageId) => {
  const ratingStats = await Review.findOne({
    where: { packageId },
    attributes: [
      [sequelize.fn('avg', sequelize.col('rating')), 'averageRating'],
      [sequelize.fn('count', '*'), 'reviewCount']
    ]
  });

  if (ratingStats) {
    await Package.update({
      averageRating: parseFloat(ratingStats.get('averageRating') || 0).toFixed(2),
      reviewCount: ratingStats.get('reviewCount')
    }, {
      where: { id: packageId }
    });
  }
};