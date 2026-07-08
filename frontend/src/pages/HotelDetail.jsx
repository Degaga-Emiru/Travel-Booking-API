import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiStar, FiWifi, FiCoffee, FiTv, FiWind, FiCalendar, FiUsers, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = location.state?.searchParams || {};

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedDates, setSelectedDates] = useState({ 
    checkIn: searchParams.checkIn ? new Date(searchParams.checkIn) : null, 
    checkOut: searchParams.checkOut ? new Date(searchParams.checkOut) : null 
  });
  const [guests, setGuests] = useState(searchParams.guests || 1);

  const getNights = () => {
    if (selectedDates.checkIn && selectedDates.checkOut) {
      const diffTime = Math.abs(selectedDates.checkOut - selectedDates.checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays > 0 ? diffDays : 1;
    }
    return 1;
  };
  const nights = getNights();

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await api.get(`/hotels/${id}`);
        setHotel(response.data.data);
      } catch (error) {
        console.error('Failed to fetch hotel details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const handleBooking = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      toast.error('Please select check-in and check-out dates to continue.');
      return;
    }

    const formattedDates = {
      checkIn: selectedDates.checkIn.toISOString(),
      checkOut: selectedDates.checkOut.toISOString(),
    };
    navigate(`/booking/hotel/${id}`, { state: { hotel, selectedDates: formattedDates, guests } });
  };

  if (loading) return <LoadingSpinner />;
  if (!hotel) return <div className="text-center py-20">Hotel not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center"><FiMapPin className="mr-1 text-primary-500" /> {hotel.location}</div>
              <div className="flex items-center"><FiStar className="mr-1 text-amber-500 fill-amber-500" /> {hotel.rating} (124 reviews)</div>
            </div>
          </motion.div>

          {/* Image Gallery */}
          {hotel.Images && hotel.Images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 h-[400px]">
              <div className="relative h-full group">
                <img src={hotel.Images[0]?.url} className="w-full h-full object-cover rounded-3xl" alt={hotel.name} />
                <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">{hotel.Images[0]?.category || 'General'}</span>
              </div>
              <div className="grid grid-rows-2 gap-4">
                {hotel.Images[1] ? (
                  <div className="relative h-full group">
                    <img src={hotel.Images[1].url} className="w-full h-full object-cover rounded-3xl" alt={hotel.name} />
                    <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">{hotel.Images[1].category || 'General'}</span>
                  </div>
                ) : (
                  <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b" className="w-full h-full object-cover rounded-3xl" alt="Placeholder" />
                )}
                {hotel.Images[2] ? (
                  <div className="relative h-full group">
                    <img src={hotel.Images[2].url} className="w-full h-full object-cover rounded-3xl" alt={hotel.name} />
                    <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">{hotel.Images[2].category || 'General'}</span>
                  </div>
                ) : (
                  <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb" className="w-full h-full object-cover rounded-3xl" alt="Placeholder" />
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 h-[400px]">
              <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945" className="w-full h-full object-cover rounded-3xl" alt={hotel.name} />
              <div className="grid grid-rows-2 gap-4">
                <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b" className="w-full h-full object-cover rounded-3xl" alt={hotel.name} />
                <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb" className="w-full h-full object-cover rounded-3xl" alt={hotel.name} />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About this hotel</h2>
            <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl"><FiWifi className="mr-3 text-primary-500" /> Free WiFi</div>
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl"><FiCoffee className="mr-3 text-primary-500" /> Breakfast</div>
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl"><FiTv className="mr-3 text-primary-500" /> Smart TV</div>
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl"><FiWind className="mr-3 text-primary-500" /> Air Conditioning</div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-3xl font-bold text-gray-900">${hotel.pricePerNight}</span>
                <span className="text-gray-500 text-sm"> / night</span>
              </div>
              <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">Available</div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Dates</label>
                <div className="grid grid-cols-2 gap-2">
                  <DatePicker 
                    selected={selectedDates.checkIn}
                    onChange={(date) => setSelectedDates(prev => ({ ...prev, checkIn: date }))}
                    minDate={new Date()}
                    placeholderText="Check-in"
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                  />
                  <DatePicker 
                    selected={selectedDates.checkOut}
                    onChange={(date) => setSelectedDates(prev => ({ ...prev, checkOut: date }))}
                    minDate={selectedDates.checkIn || new Date()}
                    placeholderText="Check-out"
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Guests</label>
                <select 
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleBooking}
              className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-900/20 hover:bg-primary-700 transition-all active:scale-95"
            >
              Reserve Now
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium">You won't be charged yet</p>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">${hotel.pricePerNight} x {nights} night{nights > 1 ? 's' : ''}</span>
                <span className="font-bold">${hotel.pricePerNight * nights}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service fee</span>
                <span className="font-bold">$25</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>${(hotel.pricePerNight * nights) + 25}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
