import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiMapPin, FiStar, FiEdit, FiTrash2, FiExternalLink, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';

const VendorHotels = () => {
  const { data: hotelsData, isLoading } = useQuery({
    queryKey: ['vendorHotels'],
    queryFn: async () => {
      const response = await api.get('/vendor/hotels');
      return response.data.data;
    }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Hotels</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your hotel listings and room availability.</p>
        </div>
        <Link to="/vendor/hotels/add" className="flex items-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-900/20 hover:scale-105 transition-all">
          <FiPlus />
          <span>Add New Hotel</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center px-6">
         <FiSearch className="text-gray-400 mr-4" />
         <input type="text" placeholder="Search your hotels..." className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-bold" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotelsData?.map((hotel, i) => (
          <motion.div 
            key={hotel.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group"
          >
            <div className="relative h-56 overflow-hidden">
               <img src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={hotel.name} />
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center text-amber-600 shadow-sm">
                  <FiStar className="mr-1 fill-amber-600" /> {hotel.starRating} Stars
               </div>
            </div>
            
            <div className="p-8 space-y-6">
               <div>
                  <h3 className="text-xl font-black text-slate-900 truncate">{hotel.name}</h3>
                  <div className="flex items-center text-xs text-gray-400 font-bold mt-2">
                     <FiMapPin className="mr-1 text-primary-500" /> {hotel.city}, {hotel.country}
                  </div>
               </div>

               <div className="flex justify-between items-center py-4 border-y border-gray-50">
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Starting Price</p>
                     <p className="text-lg font-black text-slate-900">${hotel.pricePerNight}<span className="text-xs text-gray-400 font-bold">/night</span></p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rooms</p>
                     <p className="text-lg font-black text-slate-900">{hotel.availableRooms}/{hotel.totalRooms}</p>
                  </div>
               </div>

               <div className="flex items-center space-x-2">
                  <button className="flex-1 py-3 bg-gray-50 text-slate-900 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all flex items-center justify-center">
                     <FiEdit className="mr-2" /> Edit
                  </button>
                  <button className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all">
                     <FiTrash2 />
                  </button>
                  <Link to={`/hotels/${hotel.id}`} className="p-3 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-all">
                     <FiExternalLink />
                  </Link>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {hotelsData?.length === 0 && (
         <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <FiPlus className="text-gray-200 text-4xl" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No hotels listed yet</h3>
            <p className="text-gray-500 mt-2 mb-10">Expand your business by adding your first hotel listing.</p>
            <Link to="/vendor/hotels/add" className="px-10 py-5 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-900/20">Add Hotel Now</Link>
         </div>
      )}
    </div>
  );
};

export default VendorHotels;
