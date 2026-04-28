import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiChevronLeft, FiChevronRight, FiLoader } from 'react-icons/fi';
import api from '../../services/api';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const PopularHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await api.get('/hotels');
        if (response.data.success) {
          setHotels(response.data.data.slice(0, 8)); // Show top 8
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <FiLoader className="animate-spin text-primary-600 text-4xl" />
        <p className="text-gray-500 font-bold">Discovering the best hotels for you...</p>
      </div>
    );
  }

  if (hotels.length === 0) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary-600 font-bold uppercase tracking-widest text-sm mb-2">Top Recommended</h2>
            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">Popular Hotels</h3>
          </motion.div>
          
          <div className="hidden md:flex space-x-4">
            <button className="hotel-prev group w-12 h-12 rounded-full border-2 border-primary-100 flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all shadow-lg hover:shadow-primary-600/20">
              <FiChevronLeft className="text-primary-600 group-hover:text-white text-xl" />
            </button>
            <button className="hotel-next group w-12 h-12 rounded-full border-2 border-primary-100 flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all shadow-lg hover:shadow-primary-600/20">
              <FiChevronRight className="text-primary-600 group-hover:text-white text-xl" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: '.hotel-prev',
            nextEl: '.hotel-next',
          }}
          autoplay={{ delay: 4000 }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12 !overflow-visible"
        >
          {hotels.map((hotel, index) => (
            <SwiperSlide key={hotel.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all h-full group"
              >
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md shadow-lg px-4 py-2 rounded-2xl flex items-center">
                    <FiStar className="text-amber-500 mr-2 fill-current" />
                    <span className="font-black text-slate-900 text-sm">{hotel.averageRating || hotel.starRating}</span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center text-primary-600 text-xs font-black uppercase tracking-widest mb-3">
                    <FiMapPin className="mr-2" /> {hotel.city}, {hotel.country}
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-6 line-clamp-1 group-hover:text-primary-600 transition-colors">{hotel.name}</h4>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                    <div>
                      <span className="text-3xl font-black text-slate-900">${hotel.pricePerNight}</span>
                      <span className="text-gray-400 text-xs font-bold ml-1 uppercase tracking-tighter">/ night</span>
                    </div>
                    <button className="bg-slate-900 hover:bg-primary-600 text-white text-sm font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary-600/20 active:scale-95">
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PopularHotels;
