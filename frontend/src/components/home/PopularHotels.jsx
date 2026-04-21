import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import data from '../../data/ethiopiaData.json';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const PopularHotels = () => {
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
            <h3 className="text-4xl font-extrabold text-gray-900">Popular Hotels</h3>
          </motion.div>
          
          <div className="hidden md:flex space-x-4">
            <button className="hotel-prev group w-12 h-12 rounded-full border-2 border-primary-100 flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all">
              <FiChevronLeft className="text-primary-600 group-hover:text-white text-xl" />
            </button>
            <button className="hotel-next group w-12 h-12 rounded-full border-2 border-primary-100 flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all">
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
          className="pb-12"
        >
          {data.hotels.map((hotel, index) => (
            <SwiperSlide key={hotel.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full"
              >
                <div className="relative h-64">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur shadow-sm px-3 py-1 rounded-full flex items-center">
                    <FiStar className="text-yellow-500 mr-1 fill-current" />
                    <span className="font-bold text-gray-800 text-sm">{hotel.rating}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-primary-600 text-sm font-bold mb-2">
                    <FiMapPin className="mr-1" /> {hotel.city}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1">{hotel.name}</h4>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-black text-primary-700">${hotel.price}</span>
                      <span className="text-gray-400 text-sm ml-1">/ night</span>
                    </div>
                    <div className="flex space-x-2">
                       <button className="text-primary-600 font-bold text-sm hover:underline">Details</button>
                       <button className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all">Book</button>
                    </div>
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
