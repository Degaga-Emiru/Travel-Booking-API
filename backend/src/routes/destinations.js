const express = require('express');
const {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  getPopularDestinations,
  getDestinationStats
} = require('../controllers/destinationController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getDestinations);
router.get('/popular', optionalAuth, getPopularDestinations);
router.get('/:id', optionalAuth, getDestination);

// Protected routes
router.use(protect);

// Admin and agent routes
router.post('/', authorize('admin', 'agent'), createDestination);
router.get('/admin/stats', authorize('admin', 'agent'), getDestinationStats);
router.put('/:id', authorize('admin', 'agent'), updateDestination);
router.delete('/:id', authorize('admin', 'agent'), deleteDestination);

module.exports = router;