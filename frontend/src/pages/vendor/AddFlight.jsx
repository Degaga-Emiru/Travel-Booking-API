import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSend, FiMapPin, FiClock, FiDollarSign, FiArrowLeft, FiUser } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AddFlight = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    airline: '',
    airlineCode: '',
    flightNumber: '',
    departureAirport: '',
    departureCity: '',
    departureCountry: '',
    arrivalAirport: '',
    arrivalCity: '',
    arrivalCountry: '',
    departureTime: '',
    arrivalTime: '',
    duration: '',
    economyPrice: '',
    businessPrice: '',
    firstClassPrice: '',
    economySeats: 150,
    businessSeats: 20,
    firstClassSeats: 10
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/flights', {
        ...formData,
        availableEconomySeats: formData.economySeats,
        availableBusinessSeats: formData.businessSeats,
        availableFirstClassSeats: formData.firstClassSeats,
        departureAirportName: formData.departureAirport, // Simplified for now
        arrivalAirportName: formData.arrivalAirport
      });
      toast.success('Flight scheduled successfully!');
      navigate('/vendor/flights');
    } catch (error) {
      toast.error('Failed to schedule flight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-slate-900 transition-all"><FiArrowLeft size={20} /></button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Schedule New Flight</h1>
          <p className="text-gray-500 font-medium">Add a new flight route and pricing classes.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Airline Info */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center space-x-3 mb-2">
               <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center"><FiSend /></div>
               <h3 className="text-xl font-black text-slate-900">Airline Details</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Airline Name</label>
                  <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.airline} onChange={e => setFormData({...formData, airline: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IATA Code (e.g. ET)</label>
                  <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.airlineCode} onChange={e => setFormData({...formData, airlineCode: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Flight Number</label>
                <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.flightNumber} onChange={e => setFormData({...formData, flightNumber: e.target.value})} required />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center space-x-3 mb-2">
               <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><FiClock /></div>
               <h3 className="text-xl font-black text-slate-900">Schedule</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Departure Time</label>
                <input type="datetime-local" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Arrival Time</label>
                <input type="datetime-local" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration (minutes)</label>
                <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} required />
              </div>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
           <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><FiMapPin /></div>
              <h3 className="text-xl font-black text-slate-900">Route Information</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <p className="text-xs font-black text-primary-500 uppercase tracking-[0.2em]">Departure</p>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Airport Code" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm" value={formData.departureAirport} onChange={e => setFormData({...formData, departureAirport: e.target.value})} />
                    <input type="text" placeholder="City" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm" value={formData.departureCity} onChange={e => setFormData({...formData, departureCity: e.target.value})} />
                 </div>
              </div>
              <div className="space-y-6">
                 <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em]">Arrival</p>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Airport Code" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm" value={formData.arrivalAirport} onChange={e => setFormData({...formData, arrivalAirport: e.target.value})} />
                    <input type="text" placeholder="City" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm" value={formData.arrivalCity} onChange={e => setFormData({...formData, arrivalCity: e.target.value})} />
                 </div>
              </div>
           </div>
        </div>

        {/* Pricing */}
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/40">
           <div className="flex items-center space-x-3 mb-10">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><FiDollarSign /></div>
              <h3 className="text-xl font-black">Pricing & Seat Classes</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4 bg-white/5 p-6 rounded-[2rem] border border-white/5">
                 <p className="font-bold text-sm text-primary-400">Economy Class</p>
                 <input type="number" placeholder="Price" className="w-full p-4 bg-white/10 border-none rounded-2xl text-white font-black" value={formData.economyPrice} onChange={e => setFormData({...formData, economyPrice: e.target.value})} />
                 <input type="number" placeholder="Seats" className="w-full p-4 bg-white/10 border-none rounded-2xl text-white font-bold text-sm" value={formData.economySeats} onChange={e => setFormData({...formData, economySeats: e.target.value})} />
              </div>
              <div className="space-y-4 bg-white/5 p-6 rounded-[2rem] border border-white/5">
                 <p className="font-bold text-sm text-amber-400">Business Class</p>
                 <input type="number" placeholder="Price" className="w-full p-4 bg-white/10 border-none rounded-2xl text-white font-black" value={formData.businessPrice} onChange={e => setFormData({...formData, businessPrice: e.target.value})} />
                 <input type="number" placeholder="Seats" className="w-full p-4 bg-white/10 border-none rounded-2xl text-white font-bold text-sm" value={formData.businessSeats} onChange={e => setFormData({...formData, businessSeats: e.target.value})} />
              </div>
              <div className="space-y-4 bg-white/5 p-6 rounded-[2rem] border border-white/5">
                 <p className="font-bold text-sm text-rose-400">First Class</p>
                 <input type="number" placeholder="Price" className="w-full p-4 bg-white/10 border-none rounded-2xl text-white font-black" value={formData.firstClassPrice} onChange={e => setFormData({...formData, firstClassPrice: e.target.value})} />
                 <input type="number" placeholder="Seats" className="w-full p-4 bg-white/10 border-none rounded-2xl text-white font-bold text-sm" value={formData.firstClassSeats} onChange={e => setFormData({...formData, firstClassSeats: e.target.value})} />
              </div>
           </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-6 bg-primary-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-primary-600/30 hover:scale-[1.02] active:scale-95 transition-all">
          {loading ? 'Scheduling...' : 'Schedule Flight'}
        </button>
      </form>
    </div>
  );
};

export default AddFlight;
