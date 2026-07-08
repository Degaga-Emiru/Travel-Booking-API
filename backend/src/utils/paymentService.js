const axios = require('axios');
const { Payment, Booking } = require('../models');
const { generatePaymentReference } = require('./helpers');
const { sendPaymentConfirmation } = require('./emailService');
const { v4: uuidv4 } = require('uuid');

const CHAPA_URL = 'https://api.chapa.co/v1/transaction';
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

/**
 * Initialize Chapa payment
 */
const initializeChapaPayment = async (amount, currency = 'ETB', email, firstName, lastName, txRef, returnUrl) => {
  try {
    const response = await axios.post(
      `${CHAPA_URL}/initialize`,
      {
        amount,
        currency,
        email,
        first_name: firstName,
        last_name: lastName,
        tx_ref: txRef,
        return_url: returnUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; // { status: 'success', data: { checkout_url: '...' } }
  } catch (error) {
    console.error('Error initializing Chapa payment:', error.response?.data || error.message);
    throw new Error('Failed to initialize payment');
  }
};

/**
 * Verify Chapa payment
 */
const verifyChapaPayment = async (txRef, bookingId, userId) => {
  try {
    const response = await axios.get(`${CHAPA_URL}/verify/${txRef}`, {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      },
    });

    if (response.data.status !== 'success') {
      throw new Error('Payment verification failed');
    }

    const paymentDetails = response.data.data;

    // Find the booking
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Create payment record
    const payment = await Payment.create({
      paymentReference: txRef,
      userId,
      bookingId,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      paymentMethod: 'Chapa',
      paymentIntentId: paymentDetails.id || txRef,
      status: 'completed',
      paymentDate: new Date()
    });

    // Update booking status
    await booking.update({
      paymentStatus: 'paid',
      status: 'confirmed'
    });

    // --- VENDOR BALANCE UPDATE ---
    const { VendorProfile, Flight, Hotel, CarRental } = require('../models');
    let vendorId = null;

    if (booking.hotelId) {
      const hotel = await Hotel.findByPk(booking.hotelId);
      vendorId = hotel?.vendorId;
    } else if (booking.flightId) {
      const flight = await Flight.findByPk(booking.flightId);
      vendorId = flight?.vendorId;
    } else if (booking.carRentalId) {
      const car = await CarRental.findByPk(booking.carRentalId);
      vendorId = car?.vendorId;
    }

    if (vendorId) {
      const vendor = await VendorProfile.findByPk(vendorId);
      if (vendor) {
        const amount = paymentDetails.amount;
        const commission = amount * 0.10; // 10% platform fee
        const vendorShare = amount - commission;

        await vendor.update({
          totalRevenue: parseFloat(vendor.totalRevenue || 0) + vendorShare,
          payoutBalance: parseFloat(vendor.payoutBalance || 0) + vendorShare
        });
        console.log(`Updated vendor ${vendorId} balance: +${vendorShare}`);
      }
    }
    // ----------------------------

    // Get user for email
    const { User } = require('../models');
    const user = await User.findByPk(userId);

    // Send payment confirmation email
    await sendPaymentConfirmation(user, payment, booking);

    return payment;
  } catch (error) {
    console.error('Error verifying Chapa payment:', error.response?.data || error.message);
    throw new Error('Failed to verify payment');
  }
};

/**
 * Process refund (Not directly supported by Chapa v1 API for automatic refunds, usually requires dashboard)
 */
const processRefund = async (paymentId, amount = null) => {
  throw new Error('Refunds must be processed manually through the Chapa dashboard');
};

module.exports = {
  initializeChapaPayment,
  verifyChapaPayment,
  processRefund
};