const express = require('express');
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  getHotelReviews,
  getUserReviews
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getReviews);
router.get('/hotel/:hotelId', getHotelReviews);

// Protected routes
router.use(protect);

router.post('/', createReview);
router.get('/my-reviews', getUserReviews);
router.get('/:id', getReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

// Admin routes
router.delete('/admin/:id', authorize('admin'), deleteReview);

module.exports = router;