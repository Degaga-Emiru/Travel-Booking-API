import React, { useState, useEffect } from 'react';
import { FiCalendar, FiMapPin, FiUser, FiInfo, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import api from '../../services/api';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/bookings', {
        params: { 
          page, 
          status: filterStatus,
          bookingType: filterType
        }
      });
      setBookings(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, filterStatus, filterType]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-600';
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'cancelled': return 'bg-rose-100 text-rose-600';
      case 'refunded': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-sm text-gray-500">Monitor and manage all flight, hotel, and package bookings.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="flight">Flights</option>
            <option value="hotel">Hotels</option>
            <option value="package">Packages</option>
          </select>
          <select 
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Booking Ref</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-500">Loading bookings...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-500">No bookings found.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                    <td className="px-6 py-4 font-bold text-blue-600">{booking.bookingReference}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{booking.User?.firstName} {booking.User?.lastName}</p>
                      <p className="text-xs text-gray-500">{booking.User?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="capitalize font-medium">{booking.bookingType}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-gray-500 truncate max-w-[150px]">
                          {booking.Flight?.flightNumber || booking.Hotel?.name || booking.Package?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">${booking.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
                        <FiInfo size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
            <div className="flex space-x-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
