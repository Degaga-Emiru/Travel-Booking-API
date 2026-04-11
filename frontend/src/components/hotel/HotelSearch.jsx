import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FiSearch, FiCalendar, FiUsers, FiHome } from 'react-icons/fi';
import { CITIES } from '../../utils/constants';

const HotelSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    checkIn: null,
    checkOut: null,
    guests: 1,
    rooms: 1,
  });

  const handleInputChange = (field, value) => {
    const newParams = { ...searchParams, [field]: value };
    setSearchParams(newParams);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchParams.city && searchParams.checkIn && searchParams.checkOut) {
      onSearch({
        ...searchParams,
        checkIn: searchParams.checkIn.toISOString(),
        checkOut: searchParams.checkOut.toISOString(),
      });
    }
  };

  const isFormValid = searchParams.city && searchParams.checkIn && searchParams.checkOut;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* City */}
        <div>
          <label className="form-label">Destination</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={searchParams.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="form-input pl-10"
              required
            >
              <option value="">Select a city</option>
              {Object.values(CITIES).flat().map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Check-in Date */}
        <div>
          <label className="form-label">Check-in</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-5 w-5 text-gray-400" />
            </div>
            <DatePicker
              selected={searchParams.checkIn}
              onChange={(date) => handleInputChange('checkIn', date)}
              minDate={new Date()}
              className="form-input pl-10 w-full"
              placeholderText="Select date"
              required
            />
          </div>
        </div>

        {/* Check-out Date */}
        <div>
          <label className="form-label">Check-out</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-5 w-5 text-gray-400" />
            </div>
            <DatePicker
              selected={searchParams.checkOut}
              onChange={(date) => handleInputChange('checkOut', date)}
              minDate={searchParams.checkIn || new Date()}
              className="form-input pl-10 w-full"
              placeholderText="Select date"
              required
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="form-label">Guests</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUsers className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={searchParams.guests}
              onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
              className="form-input pl-10"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rooms */}
        <div>
          <label className="form-label">Rooms</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiHome className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={searchParams.rooms}
              onChange={(e) => handleInputChange('rooms', parseInt(e.target.value))}
              className="form-input pl-10"
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Room' : 'Rooms'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={!isFormValid}
          className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search Hotels
        </button>
      </div>
    </form>
  );
};

export default HotelSearch;