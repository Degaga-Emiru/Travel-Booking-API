import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FiSearch, FiCalendar, FiUsers, FiArrowRight } from 'react-icons/fi';
import { AIRLINES, CITIES } from '../../utils/constants';

const FlightSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    arrival: '',
    date: null,
    passengers: 1,
    class: 'economy',
  });

  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [returnDate, setReturnDate] = useState(null);

  const handleInputChange = (field, value) => {
    const newParams = { ...searchParams, [field]: value };
    setSearchParams(newParams);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchParams.departure && searchParams.arrival && searchParams.date) {
      onSearch({
        ...searchParams,
        date: searchParams.date.toISOString(),
        returnDate: returnDate ? returnDate.toISOString() : undefined,
      });
    }
  };

  const swapCities = () => {
    setSearchParams(prev => ({
      ...prev,
      departure: prev.arrival,
      arrival: prev.departure,
    }));
  };

  const isFormValid = searchParams.departure && searchParams.arrival && searchParams.date;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Trip Type */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setIsRoundTrip(false)}
          className={`px-4 py-2 rounded-lg font-medium ${
            !isRoundTrip
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          One Way
        </button>
        <button
          type="button"
          onClick={() => setIsRoundTrip(true)}
          className={`px-4 py-2 rounded-lg font-medium ${
            isRoundTrip
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Round Trip
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Departure */}
        <div>
          <label className="form-label">From</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={searchParams.departure}
              onChange={(e) => handleInputChange('departure', e.target.value)}
              className="form-input pl-10"
              required
            >
              <option value="">Select departure</option>
              {Object.values(CITIES).flat().map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={swapCities}
            className="p-2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
          >
            <FiArrowRight className="w-5 h-5 rotate-90" />
          </button>
        </div>

        {/* Arrival */}
        <div>
          <label className="form-label">To</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={searchParams.arrival}
              onChange={(e) => handleInputChange('arrival', e.target.value)}
              className="form-input pl-10"
              required
            >
              <option value="">Select destination</option>
              {Object.values(CITIES).flat().map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Departure Date */}
        <div>
          <label className="form-label">Departure Date</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-5 w-5 text-gray-400" />
            </div>
            <DatePicker
              selected={searchParams.date}
              onChange={(date) => handleInputChange('date', date)}
              minDate={new Date()}
              className="form-input pl-10 w-full"
              placeholderText="Select date"
              required
            />
          </div>
        </div>

        {/* Return Date */}
        {isRoundTrip && (
          <div>
            <label className="form-label">Return Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <DatePicker
                selected={returnDate}
                onChange={setReturnDate}
                minDate={searchParams.date || new Date()}
                className="form-input pl-10 w-full"
                placeholderText="Select date"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Passengers */}
        <div>
          <label className="form-label">Passengers</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUsers className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={searchParams.passengers}
              onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
              className="form-input pl-10"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Passenger' : 'Passengers'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Class */}
        <div>
          <label className="form-label">Class</label>
          <select
            value={searchParams.class}
            onChange={(e) => handleInputChange('class', e.target.value)}
            className="form-input"
          >
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search Flights
          </button>
        </div>
      </div>
    </form>
  );
};

export default FlightSearch;