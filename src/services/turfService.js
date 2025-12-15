import api from './api';

export const turfService = {
  getTurfs: (params) => api.get('/turfs', { params }),
  getFeaturedTurfs: () => api.get('/turfs/featured'),
  getTurf: (id) => api.get(`/turfs/${id}`),
};
