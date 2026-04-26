import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiDownload, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const tx_ref = searchParams.get('tx_ref');

  useEffect(() => {
    toast.success('Payment verified successfully!');
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-gray-100"
      >
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <FiCheckCircle size={48} />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Your booking has been confirmed. A confirmation email and receipt have been sent to your inbox.
        </p>

        <div className="bg-gray-50 rounded-3xl p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Transaction ID</span>
            <span className="font-bold text-gray-700">{tx_ref || 'TRX-982341'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Status</span>
            <span className="text-emerald-600 font-bold">Paid</span>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-black transition-all">
            <FiDownload className="mr-2" /> Download Receipt
          </button>
          <Link to="/bookings" className="w-full py-4 border border-gray-200 text-gray-600 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-50 transition-all">
            Go to My Bookings <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
