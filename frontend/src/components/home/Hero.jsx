import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiUsers, FiSearch } from 'react-icons/fi';
import data from '../../data/ethiopiaData.json';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Background Slideshow */}
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={2000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        className="h-full w-full"
      >
        {data.heroSlides.map((slide, index) => (
          <SwiperSlide key={index} className="relative overflow-hidden">
            {/* Ken Burns Animation Image */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.15 }}
              transition={{
                duration: 6,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute inset-0 h-full w-full"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
            </motion.div>
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
            
            {/* Hero Content (Floating uniquely per slide or static) */}
            <div className="relative flex h-full items-center justify-center text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="max-w-4xl"
              >
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-primary-200 mb-8 font-medium drop-shadow-lg">
                  {slide.subtitle}
                </p>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Static Search Bar Overlay */}
      <div className="absolute bottom-16 left-0 right-0 z-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center">
                <FiMapPin className="mr-1 text-primary-600" /> Destination
              </label>
              <input 
                type="text" 
                placeholder="Where are you going?" 
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center">
                <FiCalendar className="mr-1 text-primary-600" /> Check-in / Out
              </label>
              <input 
                type="text" 
                placeholder="Dates" 
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center">
                <FiUsers className="mr-1 text-primary-600" /> Guests
              </label>
              <input 
                type="text" 
                placeholder="How many?" 
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-end">
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all hover:shadow-lg active:scale-95">
                <FiSearch className="mr-2 text-xl" /> Search Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/70"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
