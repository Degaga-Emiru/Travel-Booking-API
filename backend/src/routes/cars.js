const express = require('express');
const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getCars);
router.get('/:id', optionalAuth, getCar);

// Protected routes
router.use(protect);

// Admin, agent, and vendor routes
router.post('/', authorize('admin', 'agent', 'vendor'), createCar);
router.put('/:id', authorize('admin', 'agent', 'vendor'), updateCar);
router.delete('/:id', authorize('admin', 'agent', 'vendor'), deleteCar);

module.exports = router;
