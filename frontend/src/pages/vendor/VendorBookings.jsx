import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiCalendar, FiCheckCircle, FiXCircle, FiInfo, FiUser, FiMapPin } from 'react-icons/fi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const VendorBookings = () => {
  const queryClient = useQueryClient();
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['vendorBookings'],
    queryFn: async () => {
      const response = await api.get('/vendor/bookings');
      return response.data.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await api.patch(`/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorBookings']);
      toast.success('Booking status updated!');
    }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Booking Requests</h1>
          <p className="text-gray-500 mt-2 font-medium">Accept, manage, and track your customer reservations.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Service</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookingsData?.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-black">
                      {booking.User?.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{booking.User?.firstName} {booking.User?.lastName}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{booking.User?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center space-x-2">
                      <span className="text-lg">{booking.bookingType === 'hotel' ? '🏨' : '✈️'}</span>
                      <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                         {booking.Hotel?.name || booking.Flight?.airline || 'Service Details'}
                      </p>
                   </div>
                   <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">
                      {new Date(booking.startDate || booking.flightDate).toLocaleDateString()}
                   </p>
                </td>
                <td className="px-8 py-6">
                   <p className="text-sm font-black text-slate-900">${booking.finalAmount}</p>
                   <p className="text-[10px] text-emerald-600 font-bold uppercase">Paid via Chapa</p>
                </td>
                <td className="px-8 py-6">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                      booking.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                   }`}>
                      {booking.status}
                   </span>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex items-center justify-end space-x-2">
                      {booking.status === 'pending' && (
                         <>
                            <button 
                               onClick={() => updateStatusMutation.mutate({ id: booking.id, status: 'confirmed' })}
                               className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all"
                            >
                               <FiCheckCircle />
                            </button>
                            <button 
                               onClick={() => updateStatusMutation.mutate({ id: booking.id, status: 'cancelled' })}
                               className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-all"
                            >
                               <FiXCircle />
                            </button>
                         </>
                      )}
                      <button className="p-2 bg-gray-50 text-slate-900 rounded-lg hover:bg-gray-100 transition-all">
                         <FiInfo />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookingsData?.length === 0 && (
           <div className="p-20 text-center">
              <FiCalendar className="text-gray-200 text-6xl mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-900">No bookings yet</h3>
              <p className="text-gray-500 mt-2">When customers book your services, they will appear here.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default VendorBookings;
