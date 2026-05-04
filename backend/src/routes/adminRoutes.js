const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

// All routes here are protected and require Admin role
router.use(protect);
router.use(isAdmin);

router.get('/stats', adminController.getDashboardStats);

router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);

router.get('/vendors', adminController.getAllVendors);
router.patch('/vendors/:id/approve', adminController.updateVendorStatus);

router.get('/bookings', adminController.getAllBookings);
router.patch('/bookings/:id/status', adminController.updateBookingStatus);

router.get('/payments', adminController.getAllPayments);
router.get('/payments/export', adminController.exportPayments);

router.get('/refunds', adminController.getAllRefunds);
router.patch('/refunds/:id', adminController.processRefund);

router.get('/services', adminController.getServiceListings);
router.patch('/services/:type/:id', adminController.updateServiceStatus);

router.get('/audit-logs', adminController.getAuditLogs);

router.get('/profile', adminController.getAdminProfile);
router.put('/profile', adminController.updateAdminProfile);

module.exports = router;
