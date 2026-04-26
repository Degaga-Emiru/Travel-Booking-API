import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheck, FiArrowRight, FiArrowLeft, FiCreditCard, FiUser, FiInfo } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const BookingWizard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { hotel, flight, selectedDates, guests, passengers } = state || {};

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    passportNumber: '',
    specialRequests: ''
  });

  const steps = [
    { id: 1, title: 'Information', icon: <FiUser /> },
    { id: 2, title: 'Summary', icon: <FiInfo /> },
    { id: 3, title: 'Payment', icon: <FiCreditCard /> }
  ];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const bookingData = {
        bookingType: hotel ? 'hotel' : 'flight',
        hotelId: hotel?.id,
        flightId: flight?.id,
        startDate: selectedDates?.checkIn,
        endDate: selectedDates?.checkOut,
        numberOfGuests: guests || passengers,
        totalAmount: hotel ? (hotel.pricePerNight * 3 + 25) : (flight.price * passengers),
        travelerDetails: formData
      };

      const response = await api.post('/bookings', bookingData);
      
      // Initialize Payment
      const paymentResponse = await api.post('/payments/initialize', {
        bookingId: response.data.data.id,
        amount: bookingData.totalAmount,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      if (paymentResponse.data.success) {
        window.location.href = paymentResponse.data.data.checkout_url;
      }
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 -z-10"></div>
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all border-4 
              ${step >= s.id ? 'bg-primary-600 border-primary-100 text-white' : 'bg-white border-gray-100 text-gray-300'}`}
            >
              {step > s.id ? <FiCheck /> : s.icon}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest mt-3 ${step >= s.id ? 'text-primary-600' : 'text-gray-300'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
        >
          {step === 1 && (
            <div className="p-10 space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">Passenger Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">First Name</label>
                  <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Last Name</label>
                  <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Email Address</label>
                  <input type="email" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <button onClick={handleNext} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-black transition-all">
                Continue to Summary <FiArrowRight className="ml-2" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="p-10 space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">Review Booking</h2>
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-gray-200">
                  <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 text-3xl">
                    {hotel ? '🏨' : '✈️'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{hotel?.name || flight?.airline}</h3>
                    <p className="text-sm text-gray-500">{hotel?.location || `${flight?.origin} to ${flight?.destination}`}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-1">Traveler</p>
                    <p className="font-bold">{formData.firstName} {formData.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-1">Guests/Pass</p>
                    <p className="font-bold">{guests || passengers}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-5 border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center">
                  <FiArrowLeft className="mr-2" /> Back
                </button>
                <button onClick={handleSubmit} disabled={loading} className="flex-[2] py-5 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-900/20 hover:bg-primary-700 transition-all flex items-center justify-center">
                  {loading ? 'Processing...' : 'Confirm & Pay with Chapa'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BookingWizard;
