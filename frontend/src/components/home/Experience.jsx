import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiHeart, FiZap, FiCheckCircle } from 'react-icons/fi';

const Experience = () => {
  const benefits = [
    {
      icon: <FiZap className="text-3xl" />,
      title: "Fast & Easy Booking",
      desc: "Instant confirmations and a seamless 3-step booking process for your perfect stay."
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: "Secure Platform",
      desc: "Your data and payments are protected by industry-leading encryption and security protocols."
    },
    {
      icon: <FiHeart className="text-3xl" />,
      title: "Curated Destinations",
      desc: "Hand-picked Ethiopian gems that offer authentic and unforgettable travel experiences."
    },
    {
      icon: <FiCheckCircle className="text-3xl" />,
      title: "Best Price Guarantee",
      desc: "We work directly with local partners to ensure you get the most competitive rates available."
    }
  ];

  return (
    <section className="py-24 bg-primary-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <h2 className="text-primary-400 font-bold uppercase tracking-widest text-sm mb-4">Why Choose Us</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
              An Unforgettable <br />
              <span className="text-primary-500">Ethiopian Experience</span>
            </h3>
            <p className="text-primary-100/70 text-lg mb-10 leading-relaxed">
              We are more than just a booking platform. We are your local companion, dedicated to showing you the hidden wonders of Ethiopia with the convenience of modern technology.
            </p>
            <button className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-xl hover:shadow-primary-500/20 active:scale-95">
              Learn More
            </button>
          </motion.div>

          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="text-primary-500 mb-6">{item.icon}</div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-primary-100/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
