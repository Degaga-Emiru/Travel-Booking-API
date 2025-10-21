const { Payment, Booking, User } = require('../models');
const { Op } = require('sequelize');
const { createPaymentIntent, confirmPayment, processRefund } = require('../utils/paymentService');

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { bookingId, amount, currency = 'usd' } = req.body;

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify booking belongs to user
    if (booking.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this booking'
      });
    }

    // Verify booking amount matches
    if (Math.abs(booking.finalAmount - amount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount does not match booking amount'
      });
    }

    const metadata = {
      bookingId: booking.id,
      userId: req.user.id,
      bookingReference: booking.bookingReference
    };

    const paymentIntent = await createPaymentIntent(amount, currency, metadata);

    res.status(200).json({
      success: true,
      data: paymentIntent
    });
  } catch (error) {
    next(error);
  }
};

exports.confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    const payment = await confirmPayment(paymentIntentId, bookingId, req.user.id);

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        {
          model: Booking,
          include: [Flight, Hotel, Package]
        },
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user owns the payment or is admin
    if (payment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this payment'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

exports.getPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    
    // If not admin, only show user's payments
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    if (status) where.status = status;
    if (startDate && endDate) {
      where.paymentDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const payments = await Payment.findAndCountAll({
      where,
      include: [
        {
          model: Booking,
          include: [Flight, Hotel, Package]
        },
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['paymentDate', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: payments.count,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(payments.count / limit)
      },
      data: payments.rows
    });
  } catch (error) {
    next(error);
  }
};

exports.refundPayment = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const paymentId = req.params.id;

    const refund = await processRefund(paymentId, amount);

    res.status(200).json({
      success: true,
      message: amount ? 'Partial refund processed' : 'Full refund processed',
      data: refund
    });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentStats = async (req, res, next) => {
  try {
    const totalPayments = await Payment.count();
    const completedPayments = await Payment.count({ where: { status: 'completed' } });
    const refundedPayments = await Payment.count({ where: { status: 'refunded' } });
    
    const totalRevenue = await Payment.sum('amount', {
      where: { status: 'completed' }
    });

    const monthlyRevenue = await Payment.findAll({
      where: {
        status: 'completed',
        paymentDate: { [Op.gte]: new Date(new Date().getFullYear(), 0, 1) }
      },
      attributes: [
        [sequelize.fn('date_trunc', 'month', sequelize.col('paymentDate')), 'month'],
        [sequelize.fn('sum', sequelize.col('amount')), 'revenue'],
        [sequelize.fn('count', '*'), 'payments']
      ],
      group: ['month'],
      order: [['month', 'ASC']]
    });

    const paymentMethods = await Payment.findAll({
      where: { status: 'completed' },
      attributes: [
        'paymentMethod',
        [sequelize.fn('count', '*'), 'count'],
        [sequelize.fn('sum', sequelize.col('amount')), 'amount']
      ],
      group: ['paymentMethod'],
      order: [[sequelize.literal('amount'), 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalPayments,
        byStatus: {
          completed: completedPayments,
          refunded: refundedPayments
        },
        totalRevenue: totalRevenue || 0,
        monthlyRevenue,
        paymentMethods
      }
    });
  } catch (error) {
    next(error);
  }
};