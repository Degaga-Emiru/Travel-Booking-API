const { User, VendorProfile, Booking, Payment, RefundRequest, Flight, Hotel, Package, AuditLog, CarRental, sequelize } = require('../models');
const { Op } = require('sequelize');
const { logAdminAction } = require('../utils/logger');

// ============ USERS ============

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
      where, limit: parseInt(limit), offset: parseInt(offset),
      attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count, totalPages: Math.ceil(count / limit), currentPage: parseInt(page), data: users });
  } catch (error) { next(error); }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isBlocked = isBlocked;
    await user.save();
    await logAdminAction(req.user.id, isBlocked ? 'BLOCK_USER' : 'UNBLOCK_USER', 'User', user.id, { email: user.email }, req.ip);
    res.status(200).json({ success: true, message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`, data: user });
  } catch (error) { next(error); }
};

// ============ VENDORS ============

exports.getAllVendors = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const vendors = await VendorProfile.findAll({
      where, include: [{ model: User, attributes: ['firstName', 'lastName', 'email', 'phone'] }], order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count: vendors.length, data: vendors });
  } catch (error) { next(error); }
};

exports.updateVendorStatus = async (req, res, next) => {
  try {
    const { status, commissionRate, rejectionReason } = req.body;
    const vendor = await VendorProfile.findByPk(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    vendor.status = status;
    if (commissionRate) vendor.commissionRate = commissionRate;
    if (status === 'rejected' && rejectionReason) vendor.rejectionReason = rejectionReason;
    else if (status === 'verified') vendor.rejectionReason = null;
    await vendor.save();
    await logAdminAction(req.user.id, `VENDOR_${status.toUpperCase()}`, 'VendorProfile', vendor.id, { status, commissionRate, rejectionReason }, req.ip);
    if (status === 'verified') {
      const user = await User.findByPk(vendor.userId);
      if (user && user.role !== 'vendor') { user.role = 'vendor'; await user.save(); }
    }
    res.status(200).json({ success: true, message: `Vendor status updated to ${status}`, data: vendor });
  } catch (error) { next(error); }
};

// ============ BOOKINGS ============

exports.getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, bookingType, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;
    if (bookingType) where.bookingType = bookingType;
    if (search) where.bookingReference = { [Op.iLike]: `%${search}%` };
    const { count, rows: bookings } = await Booking.findAndCountAll({
      where, limit: parseInt(limit), offset: parseInt(offset),
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email'] },
        { model: Flight, attributes: ['flightNumber', 'airline', 'departureCity', 'arrivalCity'] },
        { model: Hotel, attributes: ['name', 'city'] },
        { model: Package, attributes: ['name'] }
      ], order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count, totalPages: Math.ceil(count / limit), currentPage: parseInt(page), data: bookings });
  } catch (error) { next(error); }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    const oldStatus = booking.status;
    booking.status = status;
    if (status === 'cancelled') {
      booking.cancellationReason = reason || 'Cancelled by admin';
      booking.cancellationDate = new Date();
    }
    await booking.save();
    await logAdminAction(req.user.id, `BOOKING_${status.toUpperCase()}`, 'Booking', booking.id, { oldStatus, newStatus: status, reason }, req.ip);
    res.status(200).json({ success: true, message: `Booking ${status} successfully`, data: booking });
  } catch (error) { next(error); }
};

// ============ PAYMENTS ============

exports.getAllPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (status) where.status = status;
    if (startDate && endDate) where.paymentDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    const { count, rows: payments } = await Payment.findAndCountAll({
      where, limit: parseInt(limit), offset: parseInt(offset),
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email'] },
        { model: Booking, attributes: ['bookingReference', 'bookingType'] }
      ], order: [['createdAt', 'DESC']]
    });
    // Summary stats
    const totalRevenue = await Payment.sum('amount', { where: { status: 'completed' } }) || 0;
    const completedCount = await Payment.count({ where: { status: 'completed' } });
    const pendingCount = await Payment.count({ where: { status: 'pending' } });
    const failedCount = await Payment.count({ where: { status: 'failed' } });
    const refundedCount = await Payment.count({ where: { status: 'refunded' } });
    res.status(200).json({
      success: true, count, totalPages: Math.ceil(count / limit), currentPage: parseInt(page), data: payments,
      summary: { totalRevenue, completedCount, pendingCount, failedCount, refundedCount }
    });
  } catch (error) { next(error); }
};

exports.exportPayments = async (req, res, next) => {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email'] },
        { model: Booking, attributes: ['bookingReference'] }
      ], order: [['createdAt', 'DESC']]
    });
    const csv = ['Transaction ID,Booking Ref,User,Email,Amount,Method,Status,Date'];
    payments.forEach(p => {
      csv.push(`${p.paymentReference},${p.Booking?.bookingReference || ''},${p.User?.firstName} ${p.User?.lastName},${p.User?.email},${p.amount},${p.paymentMethod},${p.status},${new Date(p.paymentDate).toISOString()}`);
    });
    await logAdminAction(req.user.id, 'EXPORT_PAYMENTS', 'Payment', null, { count: payments.length }, req.ip);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=payments_export.csv');
    res.status(200).send(csv.join('\n'));
  } catch (error) { next(error); }
};

// ============ REFUNDS ============

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
      ], order: [['createdAt', 'DESC']]
    });
    const pendingCount = await RefundRequest.count({ where: { status: 'pending' } });
    const processedCount = await RefundRequest.count({ where: { status: 'processed' } });
    const rejectedCount = await RefundRequest.count({ where: { status: 'rejected' } });
    res.status(200).json({ success: true, count: refunds.length, data: refunds, summary: { pendingCount, processedCount, rejectedCount, total: refunds.length } });
  } catch (error) { next(error); }
};

exports.processRefund = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const refund = await RefundRequest.findByPk(req.params.id, { include: [Payment, Booking] });
    if (!refund) return res.status(404).json({ success: false, message: 'Refund request not found' });
    if (refund.status !== 'pending' && refund.status !== 'under_review') return res.status(400).json({ success: false, message: 'Refund already processed' });
    refund.status = status;
    refund.adminNotes = adminNotes;
    await logAdminAction(req.user.id, `REFUND_${status.toUpperCase()}`, 'RefundRequest', refund.id, { amount: refund.amount, adminNotes }, req.ip);
    if (status === 'approved') {
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
    res.status(200).json({ success: true, message: `Refund ${status} successfully`, data: refund });
  } catch (error) { next(error); }
};

// ============ SERVICES ============

exports.getServiceListings = async (req, res, next) => {
  try {
    const flights = await Flight.findAll({
      include: [{ model: VendorProfile, attributes: ['companyName'], include: [{ model: User, attributes: ['firstName', 'lastName'] }] }],
      order: [['createdAt', 'DESC']]
    });
    const hotels = await Hotel.findAll({
      include: [{ model: VendorProfile, attributes: ['companyName'], include: [{ model: User, attributes: ['firstName', 'lastName'] }] }],
      order: [['createdAt', 'DESC']]
    });
    const cars = await CarRental.findAll({
      include: [{ model: VendorProfile, attributes: ['companyName'], include: [{ model: User, attributes: ['firstName', 'lastName'] }] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
      success: true,
      data: { flights, hotels, cars },
      counts: { flights: flights.length, hotels: hotels.length, cars: cars.length, total: flights.length + hotels.length + cars.length }
    });
  } catch (error) { next(error); }
};

exports.updateServiceStatus = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { isActive } = req.body;
    let service;
    if (type === 'flight') service = await Flight.findByPk(id);
    else if (type === 'hotel') service = await Hotel.findByPk(id);
    else if (type === 'car') {
      service = await CarRental.findByPk(id);
      if (service) { service.isAvailable = isActive; await service.save(); }
    }
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    if (type !== 'car') { service.isActive = isActive; await service.save(); }
    await logAdminAction(req.user.id, isActive ? 'ENABLE_SERVICE' : 'DISABLE_SERVICE', type.charAt(0).toUpperCase() + type.slice(1), id, { type, isActive }, req.ip);
    res.status(200).json({ success: true, message: `Service ${isActive ? 'enabled' : 'disabled'}`, data: service });
  } catch (error) { next(error); }
};

// ============ AUDIT LOGS ============

exports.getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action, resourceType, startDate, endDate, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (action) where.action = { [Op.iLike]: `%${action}%` };
    if (resourceType) where.resourceType = resourceType;
    if (startDate && endDate) where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    const include = [{ model: User, attributes: ['firstName', 'lastName', 'email'] }];
    if (search) {
      include[0].where = {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } }
        ]
      };
      include[0].required = true;
    }
    const { count, rows: logs } = await AuditLog.findAndCountAll({
      where, limit: parseInt(limit), offset: parseInt(offset),
      include, order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, count, totalPages: Math.ceil(count / limit), currentPage: parseInt(page), data: logs });
  } catch (error) { next(error); }
};

// ============ ADMIN PROFILE ============

exports.getAdminProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.updateAdminProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { firstName, lastName, phone, address, currentPassword, newPassword } = req.body;
    if (currentPassword && newPassword) {
      const isMatch = await user.correctPassword(currentPassword);
      if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect current password' });
      user.password = newPassword;
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone !== undefined ? phone : user.phone;
    user.address = address !== undefined ? address : user.address;
    await user.save();
    await logAdminAction(req.user.id, 'UPDATE_PROFILE', 'User', user.id, { fields: Object.keys(req.body).filter(k => k !== 'currentPassword' && k !== 'newPassword') }, req.ip);
    res.status(200).json({
      success: true, message: 'Profile updated successfully',
      data: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, address: user.address, role: user.role, profileImage: user.profileImage }
    });
  } catch (error) { next(error); }
};

// ============ DASHBOARD STATS ============

exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalVendors = await VendorProfile.count({ where: { status: 'verified' } });
    const pendingVendors = await VendorProfile.count({ where: { status: 'pending_verification' } });
    const totalBookings = await Booking.count();
    const totalRevenue = await Payment.sum('amount', { where: { status: 'completed' } }) || 0;
    const pendingRefunds = await RefundRequest.count({ where: { status: 'pending' } });
    const totalFlights = await Flight.count();
    const totalHotels = await Hotel.count();
    const totalCars = await CarRental.count();

    // Month-over-month growth
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const usersThisMonth = await User.count({ where: { createdAt: { [Op.gte]: thisMonthStart } } });
    const usersLastMonth = await User.count({ where: { createdAt: { [Op.between]: [lastMonthStart, thisMonthStart] } } });
    const userGrowth = usersLastMonth > 0 ? Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100) : usersThisMonth > 0 ? 100 : 0;

    const bookingsThisMonth = await Booking.count({ where: { createdAt: { [Op.gte]: thisMonthStart } } });
    const bookingsLastMonth = await Booking.count({ where: { createdAt: { [Op.between]: [lastMonthStart, thisMonthStart] } } });
    const bookingGrowth = bookingsLastMonth > 0 ? Math.round(((bookingsThisMonth - bookingsLastMonth) / bookingsLastMonth) * 100) : bookingsThisMonth > 0 ? 100 : 0;

    const revenueThisMonth = await Payment.sum('amount', { where: { status: 'completed', paymentDate: { [Op.gte]: thisMonthStart } } }) || 0;
    const revenueLastMonth = await Payment.sum('amount', { where: { status: 'completed', paymentDate: { [Op.between]: [lastMonthStart, thisMonthStart] } } }) || 0;
    const revenueGrowth = revenueLastMonth > 0 ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100) : revenueThisMonth > 0 ? 100 : 0;

    // Revenue chart - last 7 days
    const revenueChart = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now); dayStart.setDate(now.getDate() - i); dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart); dayEnd.setHours(23, 59, 59, 999);
      const dayRevenue = await Payment.sum('amount', { where: { status: 'completed', paymentDate: { [Op.between]: [dayStart, dayEnd] } } }) || 0;
      revenueChart.push({ date: dayStart.toISOString().split('T')[0], total: parseFloat(dayRevenue), label: dayStart.toLocaleDateString('en-US', { weekday: 'short' }) });
    }

    // Recent bookings
    const recentBookings = await Booking.findAll({
      limit: 5, order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['firstName', 'lastName'] }]
    });

    // Booking type breakdown
    const flightBookings = await Booking.count({ where: { bookingType: 'flight' } });
    const hotelBookings = await Booking.count({ where: { bookingType: 'hotel' } });
    const packageBookings = await Booking.count({ where: { bookingType: 'package' } });

    res.status(200).json({
      success: true,
      data: {
        totalUsers, totalVendors, pendingVendors, totalBookings, totalRevenue, pendingRefunds,
        totalFlights, totalHotels, totalCars,
        growth: { users: userGrowth, bookings: bookingGrowth, revenue: revenueGrowth, vendors: 0 },
        revenueChart, recentBookings,
        bookingBreakdown: { flights: flightBookings, hotels: hotelBookings, packages: packageBookings }
      }
    });
  } catch (error) { next(error); }
};
