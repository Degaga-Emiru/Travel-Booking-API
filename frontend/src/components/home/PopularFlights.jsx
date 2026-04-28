import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FiSend, FiMapPin, FiChevronLeft, FiChevronRight, FiLoader, FiClock } from 'react-icons/fi';
import api from '../../services/api';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const PopularFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await api.get('/flights');
        if (response.data.success) {
          setFlights(response.data.data.slice(0, 8)); // Show top 8
        }
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4 bg-slate-900 text-white">
        <FiLoader className="animate-spin text-primary-500 text-4xl" />
        <p className="text-gray-400 font-bold">Preparing flight schedules...</p>
      </div>
    );
  }

  if (flights.length === 0) return null;

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary-400 font-bold uppercase tracking-widest text-sm mb-2">Ready for Takeoff</h2>
            <h3 className="text-4xl font-extrabold text-white tracking-tight">Popular Flight Routes</h3>
          </motion.div>
          
          <div className="hidden md:flex space-x-4">
            <button className="flight-prev group w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all shadow-lg">
              <FiChevronLeft className="text-white group-hover:text-white text-xl" />
            </button>
            <button className="flight-next group w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all shadow-lg">
              <FiChevronRight className="text-white group-hover:text-white text-xl" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: '.flight-prev',
            nextEl: '.flight-next',
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
          {flights.map((flight, index) => (
            <SwiperSlide key={flight.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/10 transition-all h-full group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={flight.images?.[0] || 'https://images.unsplash.com/photo-1436491865332-7a61a109c05d?auto=format&fit=crop&q=80'} 
                    alt={flight.airline} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <div className="absolute top-6 left-6 bg-primary-600 text-white shadow-lg px-4 py-2 rounded-2xl flex items-center">
                    <FiSend className="mr-2" />
                    <span className="font-black text-xs uppercase tracking-widest">{flight.airlineCode} {flight.flightNumber}</span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="text-left">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">From</p>
                        <h4 className="text-xl font-black text-white">{flight.departureCity}</h4>
                        <p className="text-xs font-bold text-primary-400 uppercase">{flight.departureAirport}</p>
                    </div>
                    <div className="flex flex-col items-center px-4">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mb-1" />
                        <div className="w-[1px] h-8 bg-gradient-to-b from-primary-500 to-emerald-500" />
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1" />
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">To</p>
                        <h4 className="text-xl font-black text-white">{flight.arrivalCity}</h4>
                        <p className="text-xs font-bold text-emerald-400 uppercase">{flight.arrivalAirport}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-8 text-gray-400">
                    <div className="flex items-center text-xs font-bold">
                        <FiClock className="mr-2 text-primary-500" /> {Math.floor(flight.duration/60)}h {flight.duration%60}m
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {flight.airline}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting from</p>
                      <span className="text-3xl font-black text-white">${flight.economyPrice}</span>
                    </div>
                    <button className="bg-white text-slate-900 hover:bg-primary-500 hover:text-white text-sm font-black px-8 py-4 rounded-2xl transition-all shadow-xl active:scale-95">
                      Book Flight
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

export default PopularFlights;
