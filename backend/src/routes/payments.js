const express = require('express');
const {
  createPaymentIntent,
  confirmPayment,
  getPayment,
  getPayments,
  refundPayment,
  getPaymentStats
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(protect);

// Customer routes
router.post('/create-intent', paymentLimiter, createPaymentIntent);
router.post('/confirm', paymentLimiter, confirmPayment);
router.get('/my-payments', getPayments);
router.get('/:id', getPayment);

// Admin routes
router.get('/', authorize('admin'), getPayments);
router.get('/admin/stats', authorize('admin'), getPaymentStats);
router.post('/:id/refund', authorize('admin'), refundPayment);

module.exports = router;