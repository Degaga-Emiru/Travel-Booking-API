import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiSend } from 'react-icons/fi';

const Newsletter = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-primary-600 rounded-[3rem] overflow-hidden p-12 md:p-20 text-center"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary-700/30 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-3xl mb-8">
              <FiMail className="text-3xl text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Get Exclusive <br className="md:hidden" /> Travel Deals
            </h2>
            <p className="text-primary-100 text-lg mb-10">
              Subscribe to our newsletter and receive curated travel tips, local insights, and special discounts directly in your inbox.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-8 py-5 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-primary-400/50 text-gray-900 font-medium"
              />
              <button className="bg-primary-900 text-white font-bold px-10 py-5 rounded-2xl hover:bg-black transition-all flex items-center justify-center active:scale-95">
                Subscribe <FiSend className="ml-2" />
              </button>
            </form>
            
            <p className="text-primary-200/50 text-xs mt-6">
              By subscribing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
