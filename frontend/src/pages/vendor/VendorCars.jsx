import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiTruck, FiMapPin, FiSettings, FiEdit, FiTrash2, FiExternalLink, FiSearch, FiZap, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';

const VendorCars = () => {
  const { data: carsData, isLoading } = useQuery({
    queryKey: ['vendorCars'],
    queryFn: async () => {
      const response = await api.get('/vendor/cars');
      return response.data.data;
    }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Car Fleet</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your rental vehicles, pricing, and availability.</p>
        </div>
        <Link to="/vendor/cars/add" className="flex items-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-900/20 hover:scale-105 transition-all">
          <FiPlus />
          <span>Add New Vehicle</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {carsData?.map((car, i) => (
          <motion.div 
            key={car.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group"
          >
            <div className="relative h-48 overflow-hidden bg-gray-50">
               <img src={car.Images?.[0]?.url || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700" alt={car.model} />
               <div className="absolute top-4 right-4 bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {car.type}
               </div>
            </div>
            
            <div className="p-8 space-y-6">
               <div>
                  <h3 className="text-xl font-black text-slate-900 truncate">{car.brand} {car.model}</h3>
                  <div className="flex items-center text-xs text-gray-400 font-bold mt-2">
                     <FiMapPin className="mr-1 text-primary-500" /> {car.location}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                  <div className="flex items-center space-x-2">
                     <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-primary-500"><FiUsers size={14} /></div>
                     <span className="text-xs font-bold text-gray-600">{car.passengers} Seats</span>
                  </div>
                  <div className="flex items-center space-x-2">
                     <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-primary-500"><FiSettings size={14} /></div>
                     <span className="text-xs font-bold text-gray-600">{car.transmission}</span>
                  </div>
               </div>

               <div className="flex justify-between items-center">
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Daily Rate</p>
                     <p className="text-2xl font-black text-slate-900">${car.pricePerDay}<span className="text-xs text-gray-400 font-bold">/day</span></p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${car.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                     {car.isAvailable ? 'Available' : 'Booked'}
                  </div>
               </div>

               <div className="flex items-center space-x-2 pt-2">
                  <Link to={`/vendor/cars/edit/${car.id}`} className="flex-1 py-3 bg-gray-50 text-slate-900 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all flex items-center justify-center">
                     <FiEdit className="mr-2" /> Edit
                  </Link>
                  <button className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all">
                     <FiTrash2 />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {carsData?.length === 0 && (
         <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <FiTruck className="text-gray-200 text-4xl" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Fleet is empty</h3>
            <p className="text-gray-500 mt-2 mb-10">Start your rental business by adding your first vehicle.</p>
            <Link to="/vendor/cars/add" className="px-10 py-5 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-900/20">Add Vehicle</Link>
         </div>
      )}
    </div>
  );
};

export default VendorCars;
