import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingAPI } from '../../services/booking';
import { formatCurrency, formatDate, getBookingTypeIcon, getStatusColor } from '../../utils/helpers';
import { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BookingCard = ({ booking, onUpdate }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: () => bookingAPI.cancelBooking(booking.id, cancelReason),
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
      setCancelReason('');
      onUpdate();
      queryClient.invalidateQueries(['userBookings']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }
    cancelMutation.mutate();
  };

  const getBookingDetails = () => {
    switch (booking.bookingType) {
      case 'flight':
        return {
          icon: '✈️',
          title: booking.Flight ? 
            `${booking.Flight.departureAirport} → ${booking.Flight.arrivalAirport}` : 
            'Flight Booking',
          date: booking.flightDate,
          details: `${booking.adults + booking.children} passenger${booking.adults + booking.children > 1 ? 's' : ''}`,
        };
      case 'hotel':
        return {
          icon: '🏨',
          title: booking.Hotel?.name || 'Hotel Booking',
          date: booking.checkInDate,
          details: `${booking.rooms} room${booking.rooms > 1 ? 's' : ''}, ${booking.adults + booking.children} guest${booking.adults + booking.children > 1 ? 's' : ''}`,
        };
      case 'package':
        return {
          icon: '🎒',
          title: booking.Package?.name || 'Travel Package',
          date: booking.Package?.startDate,
          details: `${booking.Package?.duration || 'N/A'} days, ${booking.adults + booking.children} traveler${booking.adults + booking.children > 1 ? 's' : ''}`,
        };
      default:
        return {
          icon: '📦',
          title: 'Booking',
          date: booking.bookingDate,
          details: '',
        };
    }
  };

  const details = getBookingDetails();

  return (
    <>
      <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Booking Info */}
          <div className="flex-1">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-xl">
                {details.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {details.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(details.date)}</span>
                  </div>
                  
                  {details.details && (
                    <div className="flex items-center">
                      <FiUsers className="w-4 h-4 mr-2" />
                      <span>{details.details}</span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <FiDollarSign className="w-4 h-4 mr-2" />
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(booking.finalAmount)}
                    </span>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Booking Reference: <strong>{booking.bookingReference}</strong></span>
                    <span className="text-xs text-gray-500">
                      Booked on {formatDate(booking.bookingDate)}
                    </span>
                  </div>
                  
                  {booking.specialRequests && (
                    <div className="mt-2">
                      <span className="text-gray-500">Special Requests: </span>
                      <span className="text-gray-700">{booking.specialRequests}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 mt-4 lg:mt-0 lg:ml-6">
            {booking.status === 'pending' && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="btn-danger text-sm"
                disabled={cancelMutation.isLoading}
              >
                Cancel
              </button>
            )}
            
            {booking.status === 'confirmed' && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="btn-danger text-sm"
                disabled={cancelMutation.isLoading}
              >
                Cancel
              </button>
            )}

            <button className="btn-secondary text-sm">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Cancel Booking
              </h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel booking <strong>{booking.bookingReference}</strong>?
              This action cannot be undone.
            </p>

            <div className="mb-4">
              <label className="form-label">Cancellation Reason</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="form-input h-20"
                placeholder="Please provide a reason for cancellation..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn-secondary flex-1"
                disabled={cancelMutation.isLoading}
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                className="btn-danger flex-1"
                disabled={cancelMutation.isLoading}
              >
                {cancelMutation.isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;