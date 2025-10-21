const express = require('express');
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  getBookingStats
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.post('/', validateBooking, createBooking);
router.get('/my-bookings', getUserBookings);
router.get('/stats', authorize('admin', 'agent'), getBookingStats);
router.get('/:id', getBooking);
router.put('/:id', updateBooking);
router.put('/:id/cancel', cancelBooking);

// Admin and agent routes
router.get('/', authorize('admin', 'agent'), getAllBookings);

module.exports = router;