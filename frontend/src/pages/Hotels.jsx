import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hotelAPI } from '../services/hotel';
import HotelCard from '../components/hotel/HotelCard';
import HotelSearch from '../components/hotel/HotelSearch';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';

const Hotels = () => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    minPrice: '',
    maxPrice: '',
    rating: '',
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('rating_desc');

  const {
    data: hotelsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['hotels', searchParams],
    queryFn: () => hotelAPI.search(searchParams),
    enabled: !!searchParams.city,
  });

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  const hotels = hotelsData?.data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Stay</h1>
        <p className="text-gray-600 mt-2">
          Discover amazing hotels at the best prices
        </p>
      </div>

      {/* Search Section */}
      <div className="card p-6 mb-8">
        <HotelSearch onSearch={handleSearch} />
      </div>

      {/* Results Header */}
      {searchParams.city && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {hotels.length} hotels found
              {searchParams.city && ` in ${searchParams.city}`}
            </h2>
            {searchParams.checkIn && searchParams.checkOut && (
              <p className="text-gray-600 text-sm">
                {new Date(searchParams.checkIn).toLocaleDateString()} - {new Date(searchParams.checkOut).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input w-40"
            >
              <option value="rating_desc">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600'}`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600'}`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading && <LoadingSpinner />}

      {error && (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Failed to load hotels. Please try again.</div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      )}

      {searchParams.city && !isLoading && hotels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No hotels found matching your criteria</div>
          <p className="text-gray-400">Try adjusting your search filters</p>
        </div>
      )}

      {hotels.length > 0 && (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
        }>
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              viewMode={viewMode}
              searchParams={searchParams}
            />
          ))}
        </div>
      )}

      {/* Initial State */}
      {!searchParams.city && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFilter className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Start your hotel search
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Enter your destination, travel dates, and preferences to find the perfect hotel for your stay.
          </p>
        </div>
      )}
    </div>
  );
};

export default Hotels;