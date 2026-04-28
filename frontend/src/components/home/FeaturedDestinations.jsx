import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMapPin, FiLoader } from 'react-icons/fi';
import api from '../../services/api';

const FeaturedDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await api.get('/destinations');
        if (response.data.success) {
          setDestinations(response.data.data.slice(0, 6)); // Show top 6
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4 bg-gray-50">
        <FiLoader className="animate-spin text-primary-600 text-4xl" />
        <p className="text-gray-500 font-bold">Uncovering amazing destinations...</p>
      </div>
    );
  }

  if (destinations.length === 0) return null;

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
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Featured Destinations
            </h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/cities" className="group flex items-center text-primary-600 font-bold hover:text-primary-700 transition-colors uppercase text-xs tracking-widest">
              View All Destinations <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {destinations.map((city, index) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -12 }}
              className="group relative bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-gray-100"
            >
              {/* Main Image Container */}
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={city.image || 'https://images.unsplash.com/photo-1547127796-06bb04e4b315?auto=format&fit=crop&q=80'} 
                  alt={city.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Floating Badge */}
                <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em]">
                  {city.country || 'Ethiopia'}
                </div>

                <div className="absolute bottom-8 left-10 text-white">
                  <div className="flex items-center text-primary-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                    <FiMapPin className="mr-2" /> Destination
                  </div>
                  <h4 className="font-black text-3xl tracking-tight leading-none">{city.name}</h4>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-10 flex-1 flex flex-col">
                <p className="text-slate-500 text-lg leading-relaxed mb-10 line-clamp-3 font-medium">
                  {city.description}
                </p>

                <div className="mt-auto flex flex-col sm:flex-row items-center gap-6">
                  <Link 
                    to={`/cities/${city.slug || city.id}`}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-primary-600 text-white font-black py-5 px-10 rounded-[1.5rem] transition-all hover:shadow-2xl active:scale-95 text-center flex items-center justify-center group"
                  >
                    View Details <FiArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to={`/hotels?city=${city.name}`}
                    className="text-slate-900 font-black hover:text-primary-600 transition-colors uppercase text-[10px] tracking-widest py-2"
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
