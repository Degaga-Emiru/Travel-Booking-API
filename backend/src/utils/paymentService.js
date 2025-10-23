const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Payment, Booking } = require('../models');
const { generatePaymentReference } = require('./helpers');
const { sendPaymentConfirmation } = require('./emailService');

/**
 * Create Stripe payment intent
 */
const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    // Convert amount to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amountInCents,
      currency
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
};

/**
 * Confirm and process payment
 */
const confirmPayment = async (paymentIntentId, bookingId, userId) => {
  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment not completed');
    }

    // Find the booking
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Create payment record
    const payment = await Payment.create({
      paymentReference: generatePaymentReference(),
      userId,
      bookingId,
      amount: paymentIntent.amount / 100, // Convert back to dollars
      currency: paymentIntent.currency,
      paymentMethod: paymentIntent.payment_method_types[0],
      paymentIntentId: paymentIntent.id,
      status: 'completed',
      paymentDate: new Date()
    });

    // Update booking status
    await booking.update({
      paymentStatus: 'paid',
      status: 'confirmed'
    });

    // Get user for email
    const user = await User.findByPk(userId);

    // Send payment confirmation email
    await sendPaymentConfirmation(user, payment, booking);

    return payment;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw new Error('Failed to confirm payment');
  }
};

/**
 * Process refund
 */
const processRefund = async (paymentId, amount = null) => {
  try {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    const refundParams = {
      payment_intent: payment.paymentIntentId,
    };

    if (amount) {
      refundParams.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundParams);

    // Update payment status
    await payment.update({
      status: amount ? 'partially_refunded' : 'refunded',
      refundAmount: amount || payment.amount,
      refundDate: new Date()
    });

    // Update booking status if full refund
    if (!amount || amount === payment.amount) {
      const booking = await Booking.findByPk(payment.bookingId);
      if (booking) {
        await booking.update({
          paymentStatus: 'refunded',
          status: 'cancelled'
        });
      }
    }

    return refund;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw new Error('Failed to process refund');
  }
};

/**
 * Get payment details from Stripe
 */
const getPaymentDetails = async (paymentIntentId) => {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Error retrieving payment details:', error);
    throw new Error('Failed to retrieve payment details');
  }
};

/**
 * Verify webhook signature
 */
const verifyWebhookSignature = (payload, signature) => {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  processRefund,
  getPaymentDetails,
  verifyWebhookSignature
};