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
    <section className="relative py-32 bg-slate-950 text-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:w-1/2"
          >
            <div className="inline-block py-1 px-4 bg-primary-600/10 border border-primary-500/20 rounded-full mb-6">
              <span className="text-primary-400 font-black uppercase tracking-[0.2em] text-xs">Why Choose Us</span>
            </div>
            <h3 className="text-5xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
              An Elevated <br />
              <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">Travel Standard</span>
            </h3>
            <p className="text-slate-400 text-xl mb-12 leading-relaxed font-medium">
              We bridge the gap between ancient traditions and modern convenience, offering a hand-curated gateway to the soul of Ethiopia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="group bg-primary-600 hover:bg-primary-500 text-white font-bold py-5 px-12 rounded-2xl transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:shadow-primary-600/40 active:scale-95 flex items-center justify-center">
                Get Started <FiZap className="ml-2 group-hover:scale-125 transition-transform" />
              </button>
            </div>
          </motion.div>

          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {benefits.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 hover:border-primary-500/30 transition-all duration-500 shadow-2xl overflow-hidden"
              >
                {/* Decorative Hover Background */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl group-hover:bg-primary-600/20 transition-all duration-500" />
                
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center text-primary-500 mb-8 border border-primary-500/10 group-hover:scale-110 group-hover:bg-primary-600 transition-all duration-500 group-hover:text-white">
                    {item.icon}
                  </div>
                  <h4 className="text-2xl font-black mb-4 group-hover:text-primary-400 transition-colors">{item.title}</h4>
                  <p className="text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
