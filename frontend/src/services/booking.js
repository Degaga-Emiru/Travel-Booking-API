import api from './api';

export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: (params) => api.get('/bookings/my-bookings', { params }),
  getAllBookings: (params) => api.get('/bookings', { params }),
  getBooking: (id) => api.get(`/bookings/${id}`),
  updateBooking: (id, updateData) => api.put(`/bookings/${id}`, updateData),
  cancelBooking: (id, reason) => api.put(`/bookings/${id}/cancel`, { cancellationReason: reason }),
  getStats: () => api.get('/bookings/stats'),
};