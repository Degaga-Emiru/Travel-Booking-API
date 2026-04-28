const express = require('express');
const {
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
  getFlightStats,
  searchFlights
} = require('../controllers/flightController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateFlightSearch } = require('../middleware/validation');
const { searchLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, validateFlightSearch, searchFlights);
router.get('/search', optionalAuth, validateFlightSearch, searchFlights);
router.get('/:id', optionalAuth, getFlight);

// Protected routes
router.use(protect);

// Admin, agent, and vendor routes
router.post('/', authorize('admin', 'agent', 'vendor'), createFlight);
router.get('/admin/stats', authorize('admin', 'agent', 'vendor'), getFlightStats);
router.put('/:id', authorize('admin', 'agent', 'vendor'), updateFlight);
router.delete('/:id', authorize('admin', 'agent', 'vendor'), deleteFlight);

module.exports = router;