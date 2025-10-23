const { Op } = require('sequelize');
const { Booking, Hotel, Flight, Destination, Package, Review } = require('../models');

/**
 * Get personalized recommendations for user
 */
const getPersonalizedRecommendations = async (userId, limit = 10) => {
  try {
    // Get user's booking history
    const userBookings = await Booking.findAll({
      where: { userId },
      include: [
        { model: Hotel },
        { model: Flight },
        { model: Package }
      ]
    });

    const recommendations = {
      hotels: [],
      flights: [],
      packages: [],
      destinations: []
    };

    // Hotel recommendations based on previous bookings
    if (userBookings.some(booking => booking.hotelId)) {
      const bookedHotelIds = userBookings
        .map(booking => booking.hotelId)
        .filter(id => id);

      recommendations.hotels = await Hotel.findAll({
        where: {
          id: { [Op.notIn]: bookedHotelIds },
          isActive: true
        },
        order: [['averageRating', 'DESC']],
        limit: Math.ceil(limit / 2)
      });
    }

    // Destination recommendations based on popular destinations
    recommendations.destinations = await Destination.findAll({
      where: { isPopular: true, isActive: true },
      limit: Math.ceil(limit / 2)
    });

    // Package recommendations based on user preferences
    recommendations.packages = await Package.findAll({
      where: { 
        isFeatured: true, 
        isActive: true,
        availableSlots: { [Op.gt]: 0 }
      },
      order: [['createdAt', 'DESC']],
      limit: Math.ceil(limit / 2)
    });

    // Flight recommendations to popular destinations
    const popularDestinations = await Destination.findAll({
      where: { isPopular: true },
      attributes: ['city', 'country'],
      limit: 5
    });

    if (popularDestinations.length > 0) {
      const destinationCities = popularDestinations.map(dest => dest.city);
      
      recommendations.flights = await Flight.findAll({
        where: {
          arrivalCity: { [Op.in]: destinationCities },
          departureTime: { [Op.gt]: new Date() },
          isActive: true
        },
        order: [['departureTime', 'ASC']],
        limit: Math.ceil(limit / 2)
      });
    }

    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      hotels: [],
      flights: [],
      packages: [],
      destinations: []
    };
  }
};

/**
 * Get trending destinations
 */
const getTrendingDestinations = async (limit = 6) => {
  try {
    // Get destinations with most bookings in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trendingDestinations = await Destination.findAll({
      where: { isActive: true },
      include: [{
        model: Package,
        include: [{
          model: Booking,
          where: {
            bookingDate: { [Op.gte]: thirtyDaysAgo }
          },
          required: false
        }]
      }],
      order: [
        [{ model: Package }, { model: Booking }, 'id', 'DESC']
      ],
      limit
    });

    return trendingDestinations;
  } catch (error) {
    console.error('Error getting trending destinations:', error);
    return [];
  }
};

/**
 * Get special offers and deals
 */
const getSpecialOffers = async (limit = 5) => {
  try {
    const offers = await Package.findAll({
      where: {
        discountPrice: { [Op.not]: null },
        isActive: true,
        availableSlots: { [Op.gt]: 0 },
        startDate: { [Op.gte]: new Date() }
      },
      order: [
        [sequelize.literal('(price - discountPrice)'), 'DESC']
      ],
      limit
    });

    return offers;
  } catch (error) {
    console.error('Error getting special offers:', error);
    return [];
  }
};

/**
 * Get recently viewed items (would need a separate model for tracking views)
 */
const getRecentlyViewed = async (userId, limit = 5) => {
  // This would require a UserActivity model to track views
  // For now, return featured items
  return await Package.findAll({
    where: { isFeatured: true, isActive: true },
    limit
  });
};

/**
 * Get seasonal recommendations
 */
const getSeasonalRecommendations = async () => {
  const currentMonth = new Date().getMonth() + 1;
  
  let season = '';
  if (currentMonth >= 3 && currentMonth <= 5) season = 'spring';
  else if (currentMonth >= 6 && currentMonth <= 8) season = 'summer';
  else if (currentMonth >= 9 && currentMonth <= 11) season = 'autumn';
  else season = 'winter';

  const seasonalDestinations = await Destination.findAll({
    where: {
      climate: { [Op.iLike]: `%${season}%` },
      isActive: true
    },
    limit: 4
  });

  return {
    season,
    destinations: seasonalDestinations
  };
};

module.exports = {
  getPersonalizedRecommendations,
  getTrendingDestinations,
  getSpecialOffers,
  getRecentlyViewed,
  getSeasonalRecommendations
};