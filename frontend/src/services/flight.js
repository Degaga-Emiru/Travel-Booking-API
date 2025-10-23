import api from './api';

export const flightAPI = {
  getAll: (params) => api.get('/flights', { params }),
  search: (params) => api.get('/flights/search', { params }),
  getById: (id) => api.get(`/flights/${id}`),
  create: (flightData) => api.post('/flights', flightData),
  update: (id, flightData) => api.put(`/flights/${id}`, flightData),
  delete: (id) => api.delete(`/flights/${id}`),
  getStats: () => api.get('/flights/admin/stats'),
};