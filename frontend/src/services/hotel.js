import api from './api';

export const hotelAPI = {
  getAll: (params) => api.get('/hotels', { params }),
  search: (params) => api.get('/hotels/search', { params }),
  getById: (id) => api.get(`/hotels/${id}`),
  getReviews: (id, params) => api.get(`/hotels/${id}/reviews`, { params }),
  create: (hotelData) => api.post('/hotels', hotelData),
  update: (id, hotelData) => api.put(`/hotels/${id}`, hotelData),
  delete: (id) => api.delete(`/hotels/${id}`),
  getStats: () => api.get('/hotels/admin/stats'),
};