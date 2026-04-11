import api from './api';

export const packageAPI = {
  getAll: (params) => api.get('/packages', { params }),
  getFeaturedPackages: () => api.get('/packages/featured'),
  search: (params) => api.get('/packages/search', { params }),
  getById: (id) => api.get(`/packages/${id}`),
  create: (packageData) => api.post('/packages', packageData),
  update: (id, packageData) => api.put(`/packages/${id}`, packageData),
  delete: (id) => api.delete(`/packages/${id}`),
  getStats: () => api.get('/packages/admin/stats'),
};