import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheck, FiArrowRight, FiArrowLeft, FiCreditCard, FiUser, FiInfo } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const BookingWizard = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  // We expect hotel, or outboundFlight & returnFlight from Flights.jsx
  const { hotel, flight, outboundFlight, returnFlight, selectedDates, guests, passengers, searchParams } = state || {};

  const bookingFlight = outboundFlight || flight;
  const isRoundTrip = !!returnFlight;
  const totalTravelers = guests || passengers || 1;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Initialize state with an array of traveler details
  const [travelers, setTravelers] = useState(
    Array.from({ length: totalTravelers }, () => ({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      passportNumber: '',
      dob: ''
    }))
  );
  
  const [specialRequests, setSpecialRequests] = useState('');

  const steps = [
    { id: 1, title: 'Information', icon: <FiUser /> },
    { id: 2, title: 'Summary', icon: <FiInfo /> },
    { id: 3, title: 'Payment', icon: <FiCreditCard /> }
  ];

  const handleTravelerChange = (index, field, value) => {
    const updated = [...travelers];
    updated[index][field] = value;
    setTravelers(updated);
  };

  const validateTravelers = () => {
    for (let i = 0; i < travelers.length; i++) {
      const t = travelers[i];
      if (!t.firstName || !t.lastName || (i === 0 && !t.email)) {
        toast.error(`Please fill in required fields for Traveler ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateTravelers()) return;
    setStep(s => s + 1);
  };
  
  const handleBack = () => setStep(s => s - 1);

  const getFlightPrice = (f) => {
    if (!f) return 0;
    if (searchParams?.class === 'business') return f.businessPrice;
    if (searchParams?.class === 'first') return f.firstClassPrice;
    return f.economyPrice;
  };

  const calculateTotal = () => {
    if (hotel) {
      const nights = selectedDates?.checkIn && selectedDates?.checkOut 
        ? Math.ceil((new Date(selectedDates.checkOut) - new Date(selectedDates.checkIn)) / (1000 * 60 * 60 * 24)) 
        : 1;
      return (hotel.pricePerNight * nights * (searchParams?.rooms || 1)) + 25; // +25 arbitrary tax/fee
    } else {
      const outboundPrice = getFlightPrice(bookingFlight);
      const returnPrice = getFlightPrice(returnFlight);
      return (outboundPrice + returnPrice) * totalTravelers;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const bookingData = {
        bookingType: hotel ? 'hotel' : 'flight',
        hotelId: hotel?.id,
        flightId: bookingFlight?.id,
        returnFlightId: returnFlight?.id,
        adults: totalTravelers,
        children: 0,
        totalAmount: calculateTotal(),
        passengers: travelers,
        specialRequests
      };

      if (hotel) {
        bookingData.checkInDate = selectedDates?.checkIn;
        bookingData.checkOutDate = selectedDates?.checkOut;
        bookingData.rooms = searchParams?.rooms || 1;
      } else {
        bookingData.flightDate = searchParams?.date || new Date().toISOString();
      }

      const response = await api.post('/bookings', bookingData);
      
      // Initialize Payment (using primary traveler's info)
      const primaryTraveler = travelers[0];
      const paymentResponse = await api.post('/payments/initialize', {
        bookingId: response.data.data.id,
        amount: response.data.data.finalAmount,
        email: primaryTraveler.email,
        firstName: primaryTraveler.firstName,
        lastName: primaryTraveler.lastName
      });

      if (paymentResponse.data.success) {
        window.location.href = paymentResponse.data.data.checkout_url;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
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
              
              <div className="space-y-10">
                {travelers.map((traveler, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">
                      Traveler {index + 1} {index === 0 && <span className="text-sm text-primary-600 ml-2 font-medium">(Primary Contact)</span>}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">First Name *</label>
                        <input type="text" className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" value={traveler.firstName} onChange={e => handleTravelerChange(index, 'firstName', e.target.value)} required />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Last Name *</label>
                        <input type="text" className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" value={traveler.lastName} onChange={e => handleTravelerChange(index, 'lastName', e.target.value)} required />
                      </div>
                      
                      {index === 0 && (
                        <div className="md:col-span-2">
                          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Email Address *</label>
                          <input type="email" className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" value={traveler.email} onChange={e => handleTravelerChange(index, 'email', e.target.value)} required />
                        </div>
                      )}
                      
                      {!hotel && (
                        <>
                          <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Passport Number</label>
                            <input type="text" className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" value={traveler.passportNumber} onChange={e => handleTravelerChange(index, 'passportNumber', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Date of Birth</label>
                            <input type="date" className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" value={traveler.dob} onChange={e => handleTravelerChange(index, 'dob', e.target.value)} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Special Requests (Optional)</label>
                  <textarea 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500" 
                    rows="3"
                    value={specialRequests}
                    onChange={e => setSpecialRequests(e.target.value)}
                  ></textarea>
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
              
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 space-y-6">
                {/* Primary Booking Item */}
                <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 text-2xl">
                    {hotel ? '🏨' : '✈️'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {hotel ? hotel.name : `Outbound: ${bookingFlight?.airline}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {hotel ? hotel.location : `${bookingFlight?.departureCity} to ${bookingFlight?.arrivalCity}`}
                        </p>
                      </div>
                      {!hotel && (
                        <div className="text-right font-semibold text-gray-700">
                          {new Date(bookingFlight?.departureTime).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Return Flight if applicable */}
                {isRoundTrip && (
                  <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-2xl">
                      ✈️
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Return: {returnFlight?.airline}</h3>
                          <p className="text-sm text-gray-500">{returnFlight?.departureCity} to {returnFlight?.arrivalCity}</p>
                        </div>
                        <div className="text-right font-semibold text-gray-700">
                          {new Date(returnFlight?.departureTime).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-1">Primary Traveler</p>
                    <p className="font-bold">{travelers[0].firstName} {travelers[0].lastName}</p>
                    <p className="text-gray-500 text-xs">{travelers[0].email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-1">Total {hotel ? 'Guests' : 'Passengers'}</p>
                    <p className="font-bold">{totalTravelers}</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center text-xl">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="font-bold text-primary-600">${calculateTotal().toFixed(2)}</span>
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
