import React from 'react';
import FeaturedDestinations from '../components/home/FeaturedDestinations';
import Newsletter from '../components/home/Newsletter';

const Cities = () => {
  return (
    <div className="pt-20">
      <div className="bg-primary-900 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4">All Destinations</h1>
        <p className="text-primary-100 text-lg max-w-2xl mx-auto">
          Explore the diverse beauty of Ethiopia, from rock-hewn churches to lush national parks and vibrant cities.
        </p>
      </div>
      <FeaturedDestinations />
      <Newsletter />
    </div>
  );
};

export default Cities;
