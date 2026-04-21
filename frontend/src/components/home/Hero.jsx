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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="max-w-4xl"
              >
                <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] tracking-tight">
                  <span className="text-primary-400 block text-2xl md:text-3xl font-bold uppercase tracking-[0.3em] mb-4">Discover</span>
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-10 font-medium drop-shadow-md max-w-2xl mx-auto leading-relaxed">
                  {slide.subtitle}
                </p>
                <div className="flex justify-center gap-4">
                   <button className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:shadow-primary-600/40 active:scale-95">
                     Book Your Journey
                   </button>
                   <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-2xl font-bold transition-all active:scale-95">
                     Watch Video
                   </button>
                </div>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Static Search Bar Overlay */}
      <div className="absolute bottom-16 left-0 right-0 z-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, type: "spring", damping: 20 }}
          className="max-w-6xl mx-auto bg-white/10 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-1 border border-white/20"
        >
          <div className="bg-white rounded-[1.8rem] p-6 md:p-10 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3 group">
              <label className="text-[10px] font-black text-gray-400 uppercase flex items-center tracking-widest group-hover:text-primary-600 transition-colors">
                <FiMapPin className="mr-2 text-primary-500 text-lg" /> Destination
              </label>
              <input 
                type="text" 
                placeholder="Where to?" 
                className="w-full bg-gray-50/50 border-0 rounded-2xl px-5 py-4 text-gray-800 font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-primary-500 underline-none transition-all text-lg"
              />
            </div>
            
            <div className="space-y-3 group">
              <label className="text-[10px] font-black text-gray-400 uppercase flex items-center tracking-widest group-hover:text-primary-600 transition-colors">
                <FiCalendar className="mr-2 text-primary-500 text-lg" /> Dates
              </label>
              <input 
                type="text" 
                placeholder="Check in - Out" 
                className="w-full bg-gray-50/50 border-0 rounded-2xl px-5 py-4 text-gray-800 font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-primary-500 underline-none transition-all text-lg"
              />
            </div>

            <div className="space-y-3 group">
              <label className="text-[10px] font-black text-gray-400 uppercase flex items-center tracking-widest group-hover:text-primary-600 transition-colors">
                <FiUsers className="mr-2 text-primary-500 text-lg" /> Travelers
              </label>
              <input 
                type="text" 
                placeholder="Add guests" 
                className="w-full bg-gray-50/50 border-0 rounded-2xl px-5 py-4 text-gray-800 font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-primary-500 underline-none transition-all text-lg"
              />
            </div>

            <div className="flex items-end">
              <button className="w-full h-[68px] bg-primary-600 hover:bg-primary-700 text-white font-black rounded-2xl flex items-center justify-center transition-all hover:shadow-[0_10px_20px_rgba(37,99,235,0.3)] active:scale-95 text-lg uppercase tracking-wider">
                <FiSearch className="mr-3 text-2xl" /> Find Now
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
