import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { packageAPI } from '../services/package';
import PackageCard from '../components/package/PackageCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiSearch, FiMapPin, FiCalendar } from 'react-icons/fi';

const Packages = () => {
  const [searchParams, setSearchParams] = useState({
    destination: '',
    duration: '',
    travelers: 1,
  });
  const [sortBy, setSortBy] = useState('featured');

  const {
    data: packagesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['packages', searchParams],
    queryFn: () => packageAPI.search(searchParams),
  });

  const {
    data: featuredPackagesData,
  } = useQuery({
    queryKey: ['featuredPackages'],
    queryFn: () => packageAPI.getFeaturedPackages(),
  });

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  const packages = searchParams.destination ? packagesData?.data?.data : featuredPackagesData?.data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Travel Packages</h1>
        <p className="text-gray-600 mt-2">
          All-inclusive packages for unforgettable experiences
        </p>
      </div>

      {/* Search Section */}
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Destination */}
          <div>
            <label className="form-label">Destination</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchParams.destination}
                onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
                className="form-input pl-10"
                placeholder="Where to?"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="form-label">Duration (days)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={searchParams.duration}
                onChange={(e) => setSearchParams(prev => ({ ...prev, duration: e.target.value }))}
                className="form-input pl-10"
              >
                <option value="">Any duration</option>
                <option value="3">1-3 days</option>
                <option value="7">4-7 days</option>
                <option value="14">8-14 days</option>
                <option value="15">15+ days</option>
              </select>
            </div>
          </div>

          {/* Travelers */}
          <div>
            <label className="form-label">Travelers</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={searchParams.travelers}
                onChange={(e) => setSearchParams(prev => ({ ...prev, travelers: parseInt(e.target.value) }))}
                className="form-input pl-10"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Traveler' : 'Travelers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={() => handleSearch(searchParams)}
              className="w-full btn-primary"
            >
              Search Packages
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {searchParams.destination ? 'Search Results' : 'Featured Packages'}
          </h2>
          <p className="text-gray-600 text-sm">
            {packages.length} packages available
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-input w-48"
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="duration_asc">Duration: Shortest</option>
            <option value="rating_desc">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading && <LoadingSpinner />}

      {error && (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Failed to load packages. Please try again.</div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      )}

      {packages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              searchParams={searchParams}
            />
          ))}
        </div>
      )}

      {!searchParams.destination && packages.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No featured packages available</div>
          <p className="text-gray-400">Check back later for new offers</p>
        </div>
      )}
    </div>
  );
};

export default Packages;