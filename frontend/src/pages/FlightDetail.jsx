import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSend, FiClock, FiShield, FiBriefcase, FiArrowRight } from 'react-icons/fi';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion } from 'framer-motion';

const FlightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passengers, setPassengers] = useState(1);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await api.get(`/flights/${id}`);
        setFlight(response.data.data);
      } catch (error) {
        console.error('Failed to fetch flight details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlight();
  }, [id]);

  const handleBooking = () => {
    navigate(`/booking/flight/${id}`, { state: { flight, passengers } });
  };

  if (loading) return <LoadingSpinner />;
  if (!flight) return <div className="text-center py-20">Flight not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div 
          className="bg-slate-900 p-8 text-white relative overflow-hidden"
        >
          {flight.Images && flight.Images.length > 0 && (
            <div className="absolute inset-0 z-0">
              <img src={flight.Images[0]?.url} className="w-full h-full object-cover opacity-20" alt={flight.airline} />
            </div>
          )}
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Flight Confirmation</span>
              <span className="px-3 py-1 bg-primary-500 rounded-full text-[10px] font-black uppercase shadow-lg shadow-primary-900/50">{flight.airline}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-4xl font-black mb-2">{flight.departureAirport}</p>
                <p className="text-sm opacity-60">{flight.departureTime}</p>
              </div>
              <div className="flex-1 px-10 flex flex-col items-center">
                <p className="text-xs opacity-40 font-bold mb-2">Non-stop • {Math.floor(flight.duration / 60)}h {flight.duration % 60}m</p>
                <div className="w-full h-px bg-white/20 relative">
                  <FiSend className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-400 rotate-90 text-2xl" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black mb-2">{flight.arrivalAirport}</p>
                <p className="text-sm opacity-60">{flight.arrivalTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><FiBriefcase size={20} /></div>
              <div>
                <p className="font-bold text-gray-900">Baggage Included</p>
                <p className="text-xs text-gray-500">1 Carry-on • 2 Checked bags</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><FiShield size={20} /></div>
              <div>
                <p className="font-bold text-gray-900">Refundable</p>
                <p className="text-xs text-gray-500">Up to 24h before departure</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><FiClock size={20} /></div>
              <div>
                <p className="font-bold text-gray-900">On-time</p>
                <p className="text-xs text-gray-500">95% punctuality record</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Fare</p>
              <p className="text-4xl font-black text-gray-900">${flight.price}<span className="text-lg text-gray-400 font-normal">/person</span></p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                className="p-4 bg-white border border-gray-200 rounded-2xl font-bold outline-none"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
              >
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Passengers</option>)}
              </select>
              <button 
                onClick={handleBooking}
                className="px-10 py-4 bg-primary-600 text-white rounded-2xl font-bold flex items-center shadow-xl shadow-primary-900/20 hover:bg-primary-700 transition-all active:scale-95"
              >
                Continue <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FlightDetail;
