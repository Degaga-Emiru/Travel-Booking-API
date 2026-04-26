import React from 'react';
import { Link } from 'react-router-dom';
import { FiXCircle, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

const PaymentFailed = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-gray-100"
      >
        <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <FiXCircle size={48} />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4">Payment Failed</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          We couldn't process your payment. This could be due to insufficient funds or a temporary technical issue.
        </p>

        <div className="space-y-4">
          <button className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-primary-700 transition-all shadow-xl shadow-primary-900/20">
            <FiRefreshCw className="mr-2" /> Try Again
          </button>
          <Link to="/" className="w-full py-4 border border-gray-200 text-gray-600 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-50 transition-all">
            <FiArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;
