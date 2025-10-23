const express = require('express');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelStats,
  searchHotels,
  getHotelReviews
} = require('../controllers/hotelController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateHotelSearch } = require('../middleware/validation');
const { searchLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, validateHotelSearch, searchHotels);
router.get('/search', optionalAuth, validateHotelSearch, searchHotels);
router.get('/:id', optionalAuth, getHotel);
router.get('/:id/reviews', optionalAuth, getHotelReviews);

// Protected routes
router.use(protect);

// Admin and agent routes
router.post('/', authorize('admin', 'agent'), createHotel);
router.get('/admin/stats', authorize('admin', 'agent'), getHotelStats);
router.put('/:id', authorize('admin', 'agent'), updateHotel);
router.delete('/:id', authorize('admin', 'agent'), deleteHotel);

module.exports = router;