import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUser, FiInfo, FiXCircle, FiSearch, FiX } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/bookings', {
        params: { page, status: filterStatus, bookingType: filterType, search }
      });
      setBookings(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [page, filterStatus, filterType, search]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-600';
      case 'pending': return 'bg-amber-100 text-amber-600';
      case 'cancelled': return 'bg-rose-100 text-rose-600';
      case 'refunded': return 'bg-blue-100 text-blue-600';
      case 'completed': return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleCancel = async () => {
    try {
      await api.patch(`/admin/bookings/${cancelModal.id}/status`, { status: 'cancelled', reason: cancelReason });
      toast.success('Booking cancelled');
      setCancelModal(null);
      setCancelReason('');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
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
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by reference..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 w-48" />
          </div>
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
            <option value="">All Types</option>
            <option value="flight">Flights</option>
            <option value="hotel">Hotels</option>
            <option value="package">Packages</option>
          </select>
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
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
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-20 text-center text-gray-500">Loading bookings...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-20 text-center text-gray-500">No bookings found.</td></tr>
              ) : (
                bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                    <td className="px-6 py-4 font-bold text-blue-600">{booking.bookingReference}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{booking.User?.firstName} {booking.User?.lastName}</p>
                      <p className="text-xs text-gray-500">{booking.User?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize font-medium">{booking.bookingType}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-gray-500 truncate">{booking.Flight?.flightNumber || booking.Hotel?.name || booking.Package?.name}</span>
                    </td>
                    <td className="px-6 py-4 font-bold">${booking.totalAmount}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(booking.status)}`}>{booking.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => setSelectedBooking(booking)} className="p-2 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
                        <FiInfo size={16} />
                      </button>
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button onClick={() => setCancelModal(booking)} className="p-2 bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-colors">
                          <FiXCircle size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
            <div className="flex space-x-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <p className="text-sm text-blue-600 font-bold mt-1">{selectedBooking.bookingReference}</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Customer</p>
                  <p className="font-bold">{selectedBooking.User?.firstName} {selectedBooking.User?.lastName}</p>
                  <p className="text-xs text-gray-500">{selectedBooking.User?.email}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <p className="text-xs text-blue-400 uppercase font-bold mb-1">Total Amount</p>
                  <p className="font-bold text-blue-700 text-xl">${selectedBooking.totalAmount}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Type</p>
                  <p className="font-bold capitalize">{selectedBooking.bookingType}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Status</p>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(selectedBooking.status)}`}>{selectedBooking.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Payment Status</p>
                  <p className="font-bold capitalize">{selectedBooking.paymentStatus}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Booked On</p>
                  <p className="font-bold">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedBooking.specialRequests && (
                <div className="bg-amber-50 p-4 rounded-2xl">
                  <p className="text-xs text-amber-400 uppercase font-bold mb-1">Special Requests</p>
                  <p className="text-sm">{selectedBooking.specialRequests}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Cancel Booking</h2>
              <p className="text-sm text-gray-500 mt-1">Booking: {cancelModal.bookingReference}</p>
            </div>
            <div className="p-8">
              <label className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-2">Cancellation Reason</label>
              <textarea className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows="3"
                placeholder="Provide a reason..." value={cancelReason} onChange={e => setCancelReason(e.target.value)}></textarea>
            </div>
            <div className="p-8 bg-gray-50 border-t border-gray-100 flex space-x-4">
              <button onClick={() => { setCancelModal(null); setCancelReason(''); }} className="flex-1 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-colors">Keep Booking</button>
              <button onClick={handleCancel} className="flex-1 py-3 bg-rose-600 text-white rounded-2xl text-sm font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-900/20">Cancel Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
