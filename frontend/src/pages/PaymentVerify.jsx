import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();
  
  const txRef = params.txRef || searchParams.get('tx_ref') || searchParams.get('trx_ref');
  const bookingId = params.bookingId || searchParams.get('booking_id');

  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!txRef || !bookingId) {
        setStatus('error');
        setMessage('Missing payment verification details.');
        return;
      }

      try {
        const response = await api.get(`/payments/verify/${txRef}?bookingId=${bookingId}`);
        if (response.data.success) {
          setStatus('success');
          setMessage('Payment successful! Your booking is confirmed.');
        } else {
          setStatus('error');
          setMessage('Payment verification failed.');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'An error occurred while verifying payment.');
      }
    };

    verifyPayment();
  }, [txRef, bookingId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center space-y-6"
      >
        {status === 'verifying' && (
          <>
            <FiLoader className="w-20 h-20 text-primary-500 mx-auto animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900">Processing Payment</h2>
            <p className="text-gray-500">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FiCheckCircle className="w-20 h-20 text-emerald-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-500">{message}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full mt-6 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-900/20 hover:bg-primary-700 transition-all active:scale-95"
            >
              Go to My Bookings
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <FiXCircle className="w-20 h-20 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Failed</h2>
            <p className="text-gray-500">{message}</p>
            <button 
              onClick={() => navigate('/')}
              className="w-full mt-6 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:bg-black transition-all active:scale-95"
            >
              Return Home
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentVerify;
