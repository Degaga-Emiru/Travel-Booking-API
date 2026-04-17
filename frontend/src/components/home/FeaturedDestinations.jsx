import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';
import data from '../../data/ethiopiaData.json';

const FeaturedDestinations = () => {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-4 md:space-y-0 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary-600 font-bold uppercase tracking-widest text-sm mb-2">Explore the Extraordinary</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Featured Destinations
            </h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/cities" className="group flex items-center text-primary-600 font-bold hover:text-primary-700 transition-colors">
              View All Destinations <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.destinations.map((city, index) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              {/* Main Image Container */}
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={city.image} 
                  alt={city.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6 flex items-center text-white">
                  <FiMapPin className="mr-2" />
                  <span className="font-bold text-xl">{city.name}</span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-8 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
                  {city.description}
                </p>

                {/* Landmarks Preview */}
                <div className="flex space-x-3 mb-8">
                  {city.previewImages.map((img, i) => (
                    <div key={i} className="hidden sm:block w-16 h-16 rounded-xl overflow-hidden ring-2 ring-gray-100 group-hover:ring-primary-100 transition-all">
                      <img src={img} alt="Landmark" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="flex-1" />
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <Link 
                    to={`/cities/${city.slug}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-all hover:shadow-lg active:scale-95"
                  >
                    Explore City
                  </Link>
                  <Link 
                    to={`/hotels?city=${city.name}`}
                    className="text-primary-600 font-bold hover:underline"
                  >
                    View Hotels
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
