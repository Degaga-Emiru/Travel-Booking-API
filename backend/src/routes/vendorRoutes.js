const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('vendor', 'admin'));

router.get('/stats', vendorController.getDashboardStats);
router.patch('/profile', vendorController.updateProfile);
router.post('/payouts', vendorController.requestPayout);
router.get('/bookings', vendorController.getVendorBookings);
router.get('/hotels', vendorController.getMyHotels);
router.get('/flights', vendorController.getMyFlights);

module.exports = router;
