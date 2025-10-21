const express = require('express');
const {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  getFeaturedPackages,
  getPackageStats,
  searchPackages
} = require('../controllers/packageController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getPackages);
router.get('/featured', optionalAuth, getFeaturedPackages);
router.get('/search', optionalAuth, searchPackages);
router.get('/:id', optionalAuth, getPackage);

// Protected routes
router.use(protect);

// Admin and agent routes
router.post('/', authorize('admin', 'agent'), createPackage);
router.get('/admin/stats', authorize('admin', 'agent'), getPackageStats);
router.put('/:id', authorize('admin', 'agent'), updatePackage);
router.delete('/:id', authorize('admin', 'agent'), deletePackage);

module.exports = router;