import api from './api';

export const slotService = {
  getAvailableSlots: (params) => api.get('/slots/available', { params }),
};
