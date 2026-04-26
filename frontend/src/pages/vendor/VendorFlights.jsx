import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiPlus, FiSend, FiMapPin, FiClock, FiEdit, FiTrash2, FiExternalLink, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';

const VendorFlights = () => {
  const { data: flightsData, isLoading } = useQuery({
    queryKey: ['vendorFlights'],
    queryFn: async () => {
      const response = await api.get('/vendor/flights');
      return response.data.data;
    }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Flight Inventory</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage airline schedules, seat classes, and pricing.</p>
        </div>
        <Link to="/vendor/flights/add" className="flex items-center space-x-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-900/20 hover:scale-105 transition-all">
          <FiPlus />
          <span>Add New Flight</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {flightsData?.map((flight, i) => (
          <motion.div 
            key={flight.id} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 flex flex-col lg:flex-row items-center gap-10 hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
          >
            <div className="flex items-center space-x-6 flex-1">
               <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg">
                  {flight.airlineCode}
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900">{flight.airline}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Flight {flight.flightNumber}</p>
               </div>
            </div>

            <div className="flex-[2] flex items-center justify-between w-full lg:w-auto px-10 border-x border-gray-50">
               <div className="text-center">
                  <p className="text-2xl font-black text-slate-900">{flight.departureAirport}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase mt-1">{flight.departureCity}</p>
               </div>
               <div className="flex flex-col items-center px-6 opacity-30 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] font-black mb-1">{Math.floor(flight.duration / 60)}h {flight.duration % 60}m</p>
                  <div className="w-24 h-px bg-gray-300 relative">
                     <FiSend className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1 text-primary-600 rotate-90" />
                  </div>
                  <p className="text-[10px] font-black mt-1">Non-stop</p>
               </div>
               <div className="text-center">
                  <p className="text-2xl font-black text-slate-900">{flight.arrivalAirport}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase mt-1">{flight.arrivalCity}</p>
               </div>
            </div>

            <div className="flex-1 text-center lg:text-right">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Economy Base</p>
               <p className="text-2xl font-black text-slate-900">${flight.economyPrice}</p>
            </div>

            <div className="flex items-center space-x-2">
               <button className="p-4 bg-gray-50 text-slate-900 rounded-2xl font-bold hover:bg-gray-100 transition-all"><FiEdit /></button>
               <button className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all"><FiTrash2 /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {flightsData?.length === 0 && (
         <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <FiSend className="text-gray-200 text-4xl" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No flights scheduled</h3>
            <p className="text-gray-500 mt-2 mb-10">Start your operations by scheduling your first flight.</p>
            <Link to="/vendor/flights/add" className="px-10 py-5 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-900/20">Add Flight</Link>
         </div>
      )}
    </div>
  );
};

export default VendorFlights;
