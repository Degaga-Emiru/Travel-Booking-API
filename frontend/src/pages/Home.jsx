import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedDestinations from '../components/home/FeaturedDestinations';
import PopularHotels from '../components/home/PopularHotels';
import PopularFlights from '../components/home/PopularFlights';
import Airports from '../components/home/Airports';
import Experience from '../components/home/Experience';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import { motion } from 'framer-motion';

const Home = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="overflow-x-hidden pt-16 md:pt-0">
      {/* 🌄 Hero Section (Handled its own animations) */}
      <Hero />

      {/* 🏙 Featured Destinations */}
      <motion.div {...fadeInUp}>
        <FeaturedDestinations />
      </motion.div>

      {/* ✈️ Experience / Why Choose Us */}
      <motion.div {...fadeInUp}>
        <Experience />
      </motion.div>

      {/* 🏨 Popular Hotels */}
      <motion.div {...fadeInUp}>
        <PopularHotels />
      </motion.div>

      {/* ✈️ Popular Flights */}
      <motion.div {...fadeInUp}>
        <PopularFlights />
      </motion.div>

      {/* ✈️ Airports Section */}
      <motion.div {...fadeInUp}>
        <Airports />
      </motion.div>

      {/* 💬 Testimonials */}
      <motion.div {...fadeInUp}>
        <Testimonials />
      </motion.div>

      {/* 📩 Newsletter */}
      <motion.div {...fadeInUp}>
        <Newsletter />
      </motion.div>

      {/* Portfolio Demo Label */}
      <div className="bg-gray-100 py-6 text-center border-t border-gray-200">
        <p className="text-gray-400 text-sm font-medium tracking-wide flex items-center justify-center">
          <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
          OFFICIAL DEMO • ETHIOPIAN TRAVEL PLATFORM 2026
        </p>
      </div>
    </div>
  );
};

export default Home;