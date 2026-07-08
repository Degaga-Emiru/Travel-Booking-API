import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const internationalHotels = [
  {
    id: 'int-1',
    name: 'Burj Al Arab Jumeirah',
    city: 'Dubai',
    country: 'UAE',
    pricePerNight: 1200,
    rating: 5.0,
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'int-2',
    name: 'The Ritz London',
    city: 'London',
    country: 'UK',
    pricePerNight: 850,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'int-3',
    name: 'Hôtel Plaza Athénée',
    city: 'Paris',
    country: 'France',
    pricePerNight: 1100,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'int-4',
    name: 'Marina Bay Sands',
    city: 'Singapore',
    country: 'Singapore',
    pricePerNight: 650,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c0d12c5d?auto=format&fit=crop&q=80'
    ]
  }
];

const InternationalHotels = () => {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary-600 font-bold uppercase tracking-widest text-sm mb-2">Global Stays</h2>
            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">International Hotels</h3>
          </motion.div>
          
          <div className="hidden md:flex space-x-4">
            <button className="int-hotel-prev group w-12 h-12 rounded-full border-2 border-primary-100 flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all shadow-lg hover:shadow-primary-600/20">
              <FiChevronLeft className="text-primary-600 group-hover:text-white text-xl" />
            </button>
            <button className="int-hotel-next group w-12 h-12 rounded-full border-2 border-primary-100 flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all shadow-lg hover:shadow-primary-600/20">
              <FiChevronRight className="text-primary-600 group-hover:text-white text-xl" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: '.int-hotel-prev',
            nextEl: '.int-hotel-next',
          }}
          autoplay={{ delay: 5000 }}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12 !overflow-visible"
        >
          {internationalHotels.map((hotel, index) => (
            <SwiperSlide key={hotel.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all h-full group flex flex-col"
              >
                <div className="relative h-72">
                  <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    className="h-full w-full rounded-t-[2.5rem]"
                  >
                    {hotel.images.map((img, i) => (
                      <SwiperSlide key={i}>
                        <img 
                          src={img} 
                          alt={`${hotel.name} - ${i + 1}`} 
                          className="w-full h-full object-cover" 
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md shadow-lg px-4 py-2 rounded-2xl flex items-center">
                    <FiStar className="text-amber-500 mr-2 fill-current" />
                    <span className="font-black text-slate-900 text-sm">{hotel.rating}</span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center text-primary-600 text-xs font-black uppercase tracking-widest mb-3">
                      <FiMapPin className="mr-2" /> {hotel.city}, {hotel.country}
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-6 line-clamp-1 group-hover:text-primary-600 transition-colors">{hotel.name}</h4>
                  </div>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-gray-50 mt-auto">
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

export default InternationalHotels;
