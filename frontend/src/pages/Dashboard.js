import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { bookingAPI } from '../services/booking';
import { FiCalendar, FiPackage, FiTrendingUp, FiUser, FiMapPin, FiCreditCard } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['userBookings'],
    queryFn: () => bookingAPI.getUserBookings({ limit: 5 }),
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['bookingStats'],
    queryFn: () => bookingAPI.getStats(),
  });

  const stats = [
    {
      title: 'Total Bookings',
      value: statsData?.data?.data?.total || 0,
      icon: <FiCalendar className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Confirmed',
      value: statsData?.data?.data?.byStatus?.confirmed || 0,
      icon: <FiTrendingUp className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Pending',
      value: statsData?.data?.data?.byStatus?.pending || 0,
      icon: <FiPackage className="w-6 h-6" />,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Spent',
      value: `$${statsData?.data?.data?.totalRevenue?.toLocaleString() || 0}`,
      icon: <FiCreditCard className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
  ];

  if (bookingsLoading || statsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your travel plans today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                <Link
                  to="/bookings"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {bookingsData?.data?.data?.length > 0 ? (
                <div className="space-y-4">
                  {bookingsData.data.data.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {booking.bookingType === 'flight' ? '✈️' : 
                             booking.bookingType === 'hotel' ? '🏨' : '🎒'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.bookingReference}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {booking.bookingType} • {formatDate(booking.bookingDate)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${booking.finalAmount}
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by booking your first trip.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/hotels"
                      className="btn-primary"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/hotels"
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <FiMapPin className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Book a Hotel</span>
              </Link>
              <Link
                to="/flights"
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <FiCalendar className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Find Flights</span>
              </Link>
              <Link
                to="/packages"
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <FiPackage className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">View Packages</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <FiUser className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Update Profile</span>
              </Link>
            </div>
          </div>

          {/* User Info */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Role</p>
                  <p className="font-medium text-gray-900 capitalize">{user?.role}</p>
                </div>
                <div>
                  <p className="text-gray-600">Member since</p>
                  <p className="font-medium text-gray-900">
                    {new Date(user?.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default Dashboard;