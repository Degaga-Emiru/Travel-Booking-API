import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { flightAPI } from '../services/flight';
import FlightCard from '../components/flight/FlightCard';
import FlightSearch from '../components/flight/FlightSearch';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';

const Flights = () => {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    arrival: '',
    date: '',
    passengers: 1,
    class: 'economy',
  });
  const [sortBy, setSortBy] = useState('price_asc');

  const {
    data: flightsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['flights', searchParams],
    queryFn: () => flightAPI.search(searchParams),
    enabled: !!searchParams.departure && !!searchParams.arrival && !!searchParams.date,
  });

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  const flights = flightsData?.data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Flight</h1>
        <p className="text-gray-600 mt-2">
          Compare prices and book flights to your favorite destinations
        </p>
      </div>

      {/* Search Section */}
      <div className="card p-6 mb-8">
        <FlightSearch onSearch={handleSearch} />
      </div>

      {/* Results Header */}
      {searchParams.departure && searchParams.arrival && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {flights.length} flights found
            </h2>
            <p className="text-gray-600 text-sm">
              {searchParams.departure} → {searchParams.arrival} • {new Date(searchParams.date).toLocaleDateString()} • {searchParams.passengers} {searchParams.passengers === 1 ? 'passenger' : 'passengers'}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input w-48"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="duration_asc">Duration: Shortest</option>
              <option value="departure_asc">Departure: Earliest</option>
            </select>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading && <LoadingSpinner />}

      {error && (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Failed to load flights. Please try again.</div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      )}

      {searchParams.departure && searchParams.arrival && !isLoading && flights.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No flights found matching your criteria</div>
          <p className="text-gray-400">Try adjusting your search dates or destinations</p>
        </div>
      )}

      {flights.length > 0 && (
        <div className="space-y-4">
          {flights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              searchParams={searchParams}
            />
          ))}
        </div>
      )}

      {/* Initial State */}
      {(!searchParams.departure || !searchParams.arrival) && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFilter className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Start your flight search
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Enter your departure and arrival cities, travel date, and preferences to find the best flights for your journey.
          </p>
        </div>
      )}
    </div>
  );
};

export default Flights;