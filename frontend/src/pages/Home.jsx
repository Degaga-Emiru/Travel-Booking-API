import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedDestinations from '../components/home/FeaturedDestinations';
import PopularHotels from '../components/home/PopularHotels';
import Airports from '../components/home/Airports';
import Experience from '../components/home/Experience';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      {/* 🌄 Hero Section with Slide-in animations */}
      <Hero />

      {/* 🏙 Featured Destinations */}
      <FeaturedDestinations />

      {/* ✈️ Experience / Why Choose Us */}
      <Experience />

      {/* 🏨 Popular Hotels */}
      <PopularHotels />

      {/* ✈️ Airports Section */}
      <Airports />

      {/* 💬 Testimonials */}
      <Testimonials />

      {/* 📩 Newsletter */}
      <Newsletter />

      {/* Portfolio Demo Label */}
      <div className="bg-gray-100 py-4 text-center">
        <p className="text-gray-500 text-sm font-medium">
          This is a demo travel booking platform for portfolio purposes.
        </p>
      </div>
    </div>
  );
};

export default Home;