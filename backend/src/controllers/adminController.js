const { User, VendorProfile, Booking, Payment, RefundRequest, Flight, Hotel, Package, AuditLog } = require('../models');
const { Op } = require('sequelize');
const chapa = require('../utils/chapa');
const { logAdminAction } = require('../utils/logger');

// @desc    Get all users with filtering and pagination
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', role, isBlocked } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (role) where.role = role;
    if (isBlocked !== undefined) where.isBlocked = isBlocked === 'true';

    const { count, rows: users } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (Block/Unblock)
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isBlocked = isBlocked;
    await user.save();

    // Log action
    await logAdminAction(
      req.user.id,
      isBlocked ? 'BLOCK_USER' : 'UNBLOCK_USER',
      'User',
      user.id,
      { email: user.email },
      req.ip
    );

    res.status(200).json({
      success: true,
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vendors
// @route   GET /api/admin/vendors
// @access  Private/Admin
exports.getAllVendors = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const vendors = await VendorProfile.findAll({
      where,
      include: [{
        model: User,
        attributes: ['firstName', 'lastName', 'email', 'phone']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject vendor
// @route   PATCH /api/admin/vendors/:id/approve
// @access  Private/Admin
exports.updateVendorStatus = async (req, res, next) => {
  try {
    const { status, commissionRate } = req.body;
    const vendor = await VendorProfile.findByPk(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    vendor.status = status;
    if (commissionRate) vendor.commissionRate = commissionRate;
    await vendor.save();

    // Log action
    await logAdminAction(
      req.user.id,
      `VENDOR_${status.toUpperCase()}`,
      'VendorProfile',
      vendor.id,
      { status, commissionRate },
      req.ip
    );

    // If approved, ensure user role is vendor
    if (status === 'approved') {
      const user = await User.findByPk(vendor.userId);
      if (user && user.role !== 'vendor') {
        user.role = 'vendor';
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Vendor status updated to ${status}`,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, bookingType } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (bookingType) where.bookingType = bookingType;

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email'] },
        { model: Flight, attributes: ['flightNumber'] },
        { model: Hotel, attributes: ['name'] },
        { model: Package, attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments/transactions
// @route   GET /api/admin/payments
// @access  Private/Admin
exports.getAllPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const { count, rows: payments } = await Payment.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email'] },
        { model: Booking, attributes: ['bookingReference'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all refund requests
// @route   GET /api/admin/refunds
// @access  Private/Admin
exports.getAllRefunds = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const refunds = await RefundRequest.findAll({
      where,
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email'] },
        { model: Booking, attributes: ['bookingReference', 'totalAmount'] },
        { model: Payment, attributes: ['paymentReference', 'paymentIntentId'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: refunds.length,
      data: refunds
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject refund
// @route   PATCH /api/admin/refunds/:id
// @access  Private/Admin
exports.processRefund = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const refund = await RefundRequest.findByPk(req.params.id, {
      include: [Payment, Booking]
    });

    if (!refund) {
      return res.status(404).json({ success: false, message: 'Refund request not found' });
    }

    if (refund.status !== 'pending' && refund.status !== 'under_review') {
      return res.status(400).json({ success: false, message: 'Refund already processed' });
    }

    refund.status = status;
    refund.adminNotes = adminNotes;

    // Log action
    await logAdminAction(
      req.user.id,
      `REFUND_${status.toUpperCase()}`,
      'RefundRequest',
      refund.id,
      { amount: refund.amount, adminNotes },
      req.ip
    );

    if (status === 'approved') {
      // Simulation of Chapa refund call
      refund.status = 'processed';
      refund.processedAt = new Date();
      
      const payment = refund.Payment;
      payment.status = 'refunded';
      payment.refundAmount = refund.amount;
      payment.refundDate = new Date();
      await payment.save();

      const booking = refund.Booking;
      booking.status = 'refunded';
      booking.paymentStatus = 'refunded';
      await booking.save();
    }

    await refund.save();

    res.status(200).json({
      success: true,
      message: `Refund ${status} successfully`,
      data: refund
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Audit Logs
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
exports.getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: logs } = await AuditLog.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalVendors = await VendorProfile.count({ where: { status: 'approved' } });
    const pendingVendors = await VendorProfile.count({ where: { status: 'pending' } });
    const totalBookings = await Booking.count();
    const totalRevenue = await Payment.sum('amount', { where: { status: 'completed' } }) || 0;
    const pendingRefunds = await RefundRequest.count({ where: { status: 'pending' } });

    // Last 7 days revenue for chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueData = await Payment.findAll({
      where: {
        status: 'completed',
        paymentDate: { [Op.gte]: sevenDaysAgo }
      },
      attributes: [
        [sequelize.fn('date', sequelize.col('paymentDate')), 'date'],
        [sequelize.fn('sum', sequelize.col('amount')), 'total']
      ],
      group: [sequelize.fn('date', sequelize.col('paymentDate'))],
      order: [[sequelize.fn('date', sequelize.col('paymentDate')), 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalVendors,
        pendingVendors,
        totalBookings,
        totalRevenue,
        pendingRefunds,
        revenueChart: revenueData
      }
    });
  } catch (error) {
    next(error);
  }
};
