import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingAPI } from '../services/booking';
import BookingCard from '../components/booking/BookingCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiCalendar, FiFilter } from 'react-icons/fi';

const Bookings = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const {
    data: bookingsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userBookings', filter],
    queryFn: () => bookingAPI.getUserBookings({ 
      status: filter === 'all' ? undefined : filter 
    }),
  });

  const bookings = bookingsData?.data?.data || [];

  const filterOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'price_low', label: 'Price: Low to High' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">
          Manage your travel bookings and view booking history
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  filter === option.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input w-40"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {isLoading && <LoadingSpinner />}

      {error && (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">Failed to load bookings. Please try again.</div>
          <button
            onClick={() => refetch()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && bookings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCalendar className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {filter === 'all' 
              ? "You haven't made any bookings yet. Start planning your next adventure!"
              : `No ${filter} bookings found.`
            }
          </p>
          {filter === 'all' && (
            <div className="space-x-4">
              <a
                href="/hotels"
                className="btn-primary"
              >
                Book a Hotel
              </a>
              <a
                href="/flights"
                className="btn-secondary"
              >
                Find Flights
              </a>
            </div>
          )}
        </div>
      )}

      {bookings.length > 0 && (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onUpdate={refetch}
            />
          ))}
        </div>
      )}

      {/* Booking Stats */}
      {bookings.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">
              {bookings.length}
            </div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              ${bookings.reduce((total, b) => total + parseFloat(b.finalAmount), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;