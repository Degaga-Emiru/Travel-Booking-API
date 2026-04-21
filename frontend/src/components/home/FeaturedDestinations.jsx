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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {data.destinations.map((city, index) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -12 }}
              className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] transition-all duration-500 flex flex-col h-full border border-gray-100"
            >
              {/* Main Image Container */}
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={city.image} 
                  alt={city.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Floating Badge */}
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest">
                  Ethiopia
                </div>

                <div className="absolute bottom-6 left-8 text-white">
                  <div className="flex items-center text-primary-400 text-xs font-black uppercase tracking-[0.2em] mb-2">
                    <FiMapPin className="mr-2" /> Destination
                  </div>
                  <h4 className="font-black text-3xl tracking-tight">{city.name}</h4>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-10 flex-1 flex flex-col">
                <p className="text-gray-500 text-lg leading-relaxed mb-8 line-clamp-2 font-medium">
                  {city.description}
                </p>

                {/* Landmarks Preview */}
                <div className="flex items-center gap-3 mb-10">
                  {city.previewImages.slice(0, 3).map((img, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 rounded-2xl overflow-hidden ring-4 ring-gray-50 group-hover:ring-primary-50 transition-all shadow-sm"
                    >
                      <img src={img} alt="Landmark" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                  <div className="ml-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Top Rated</p>
                    <div className="flex text-yellow-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex flex-col sm:flex-row items-center gap-4">
                  <Link 
                    to={`/cities/${city.slug}`}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-primary-600 text-white font-black py-4 px-8 rounded-2xl transition-all hover:shadow-xl active:scale-95 text-center flex items-center justify-center group"
                  >
                    View Details <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to={`/hotels?city=${city.name}`}
                    className="text-primary-600 font-black hover:text-primary-700 transition-colors uppercase text-xs tracking-widest py-2"
                  >
                    Find Hotels
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
